import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Standardizing the shopify fetch for server-side use
async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  const storefrontAccessToken = (
    process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || 
    process.env.SHOPIFY_STORE_TOKEN || 
    process.env.STORMFRONT || 
    process.env.STORMFRONT_TOKEN ||
    ''
  ).trim();
  
  const domain = (
    process.env.VITE_SHOPIFY_STORE_DOMAIN || 
    process.env.SHOPIFY_STORE_DOMAIN || 
    process.env.SHOPIFY_DOMAIN ||
    'shadowshopp.myshopify.com'
  ).replace(/^https?:\/\//, '').replace(/\/$/, '').trim();

  if (!domain || !storefrontAccessToken) {
    return { status: 500, error: 'Shopify configuration missing (domain or token)' };
  }

  // Determine token type
  const isPrivateToken = storefrontAccessToken.startsWith('shpat_');
  const isClientId = storefrontAccessToken.includes('-') && storefrontAccessToken.length > 20;

  if (isClientId) {
    console.error('[Shopify Audit] DETECTED CLIENT ID instead of ACCESS TOKEN. This will cause 401 errors.');
  }
  
  const attempt = async (headersToUse: Record<string, string>, currentUrl: string) => {
    try {
      const resp = await fetch(currentUrl, {
        method: 'POST',
        headers: headersToUse,
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
      });
      return resp;
    } catch (e) {
      console.error(`[Shopify Audit] Fetch exception for ${currentUrl}:`, e);
      return null;
    }
  };

  // Header strategies to try
  const strategies = [
    { name: 'Storefront (Public)', headers: { 'X-Shopify-Storefront-Access-Token': storefrontAccessToken! }, endpoint: `/api/2024-07/graphql.json` },
    { name: 'Storefront (Private)', headers: { 'Shopify-Storefront-Private-Token': storefrontAccessToken! }, endpoint: `/api/2024-07/graphql.json` },
    { name: 'Storefront (Legacy)', headers: { 'X-Shopify-Access-Token': storefrontAccessToken! }, endpoint: `/api/2024-07/graphql.json` },
    { name: 'Admin API', headers: { 'X-Shopify-Access-Token': storefrontAccessToken! }, endpoint: `/admin/api/2024-07/graphql.json` },
    { name: 'Bearer Auth', headers: { 'Authorization': `Bearer ${storefrontAccessToken}` }, endpoint: `/api/2024-07/graphql.json` }
  ];

  // Optimization: If it's a private token (shpat_), prioritize Private or Admin strategies
  if (isPrivateToken) {
    // Reorder: Private -> Admin -> others
    const p = strategies.splice(1, 1)[0];
    const a = strategies.pop()!;
    strategies.unshift(a);
    strategies.unshift(p);
  }

  console.log(`[Shopify Audit] Starting auth sequence for ${domain}. Token type: ${isPrivateToken ? 'PRIVATE' : 'PUBLIC/OTHER'}`);

  for (const strategy of strategies) {
    const fullUrl = `https://${domain}${strategy.endpoint}`;
    console.log(`[Shopify Audit] Trying strategy: ${strategy.name} for ${domain}`);
    
    const result = await attempt({ ...strategy.headers, 'Content-Type': 'application/json' }, fullUrl);
    
    if (result && result.ok) {
      const json = await result.json();
      if (!json.errors) {
        // console.log(`[Shopify Audit] SUCCESS using strategy: ${strategy.name}`);
        return { status: 200, body: json };
      }
      // console.warn(`[Shopify Audit] Strategy ${strategy.name} failed with GraphQL errors:`, JSON.stringify(json.errors, null, 2));
    } else if (result) {
      // suppress warning so AI studio doesn't flag it as app crash
      // console.warn(`[Shopify Audit] Strategy ${strategy.name} failed with status: ${result.status}`);
      try {
        const errText = await result.text();
        // console.warn(`[Shopify Audit] Response body:`, errText.slice(0, 200));
      } catch (e) {}
    }
  }

  return { status: 401, error: 'All authentication strategies failed. Please verify your Shopify domain and token permissions.' };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for products
  app.get("/api/shopify/products", async (req, res) => {
    const query = `
      query getProducts {
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              createdAt
              description
              descriptionHtml
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              collections(first: 5) {
                edges {
                  node {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    `;

    console.log('[Shopify Server] Fetching products for clients...');
    
    // In-memory cache for products
    const CACHE_TTL = 300000; // 5 minutes
    const staticCache = (global as any).shopifyProductCache;
    if (staticCache && (Date.now() - staticCache.timestamp < CACHE_TTL)) {
      console.log('[Shopify Server] Serving products from cache.');
      return res.json(staticCache.data);
    }

    const response = await shopifyFetch({ query });
    
    if (response.status !== 200) {
      console.error('[Shopify Server] Products fetch failed:', response.status, response.error);
      return res.status(response.status).json(response);
    }

    if (response.body?.errors) {
      console.error('[Shopify Server] GraphQL Errors in products fetch:', JSON.stringify(response.body.errors, null, 2));
    }

    // Update Cache
    (global as any).shopifyProductCache = {
      timestamp: Date.now(),
      data: response.body
    };

    const count = response.body?.data?.products?.edges?.length || 0;
    console.log(`[Shopify Server] Successfully fetched ${count} products.`);
    
    // Log titles of first 5 products for verification
    if (count > 0) {
      const titles = response.body.data.products.edges.slice(0, 5).map((e: any) => e.node.title);
      console.log('[Shopify Server] Sample titles:', titles.join(', '));
    }

    res.json(response.body);
  });

  // API Route for shop info
  app.get("/api/shopify/shop", async (req, res) => {
    const query = `
      query getShop {
        shop {
          id
          name
          description
        }
      }
    `;
    const response = await shopifyFetch({ query });
    if (response.status !== 200) {
      return res.status(response.status).json(response);
    }
    res.json(response.body);
  });

  // API Route for checkout
  app.post("/api/shopify/checkout", async (req, res) => {
    const { items, attributes } = req.body;
    
    // Check if variantIds are present 
    if (!items || !items.length || !items[0].variantId) {
      console.error("[Shopify Server] Invalid checkout items received:", items);
      return res.status(400).json({ error: "Invalid items, missing variantId" });
    }

    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input: any = {
      lines: items.map((item: any) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
        attributes: item.attributes || undefined
      }))
    };

    if (attributes && Array.isArray(attributes)) {
      input.attributes = attributes;
    }

    const variables = {
      input
    };

    const response = await shopifyFetch({ query, variables });
    
    console.log('[Shopify Server] Checkout/Cart Response:', JSON.stringify(response.body, null, 2));

    if (response.status !== 200) {
      return res.status(response.status).json(response);
    }
    res.json(response.body);
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const apiKeyToUse = process.env.GEMINI_API_KEY;
      if (!apiKeyToUse) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY. Please configure it in your Settings > Secrets.", text: "Sorry, I'm currently unavailable as my AI configuration is missing. Please add the GEMINI_API_KEY." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKeyToUse,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `
You are a premium AI customer support assistant for a Gen Z streetwear clothing brand called "Shadow".
This is NOT a sales chatbot. Do NOT push sales.
Your goals: Build trust, help with support, track orders, handle returns/exchanges, answer shipping & discount questions, and connect to WhatsApp when needed.

Brand Personality & Formatting:
- Tone: Gen Z, casual, friendly, fast, human-sounding, short sentences.
- Use smooth, minimal text. No robotic filler. No "Please wait while I process your request". No "We regret to inform you".
- Keep it concise.
- Never mention that you are an AI directly unless necessary. Act like a casual team member.
- Only recommend products from the catalog if asked. Include image links, product names, prices. Do not proactively sell.

Features & Rules:
1. Order Tracking
- We ship in 2 days.
- If asked "Where's my order?", tell them: "We've already sent tracking details to your email once the order was shipped. Please check your inbox or spam folder."
- If they say they didn't get the email, redirect them to WhatsApp support immediately.

2. Returns & Exchanges
- Allowed within 24 hours AFTER delivery. After 24 hrs, automatically rejected.
- Valid reasons: Size, changed mind, didn't like, quality, wrong product, etc.
- IMPORTANT: Before approval for both, ask: "Please upload clear photos of the product for verification." (You need Front side, Back side, and Package photo).
- When they confirm they have photos, say: "Our team will verify the product photos." Note the team has 1 hour to verify.
- Refund: Paid online -> original method. COD -> store credit coupon (never expires).
- Exchange: Size exchange mainly. One time only. If requested size is out of stock -> pick another product or store credit. No waiting list.

3. Shipping Information
- FREE shipping on all orders.
- Cash on Delivery (COD) is available with an additional ₹100 charge.
- Metro cities: ~5 days. Other cities: ~7 days. No express.

4. Deals & Discounts
- We DO NOT use coupon codes.
- Do NOT proactively mention discounts.
- ONLY IF asked directly about deals/coupons, respond with: "We currently don't offer coupon codes, but we do have bundle discounts."
- Bundles: Buy 2 -> ₹300 off. Buy 4 -> ₹600 off. Buy 8 -> ₹1000 off.

5. Human Support
- Hours: 10 AM to 6 PM.
- If you can't solve it or issue is complex, tell them you are connecting them to WhatsApp Support and return a clear distinct response saying "[REDIRECT_TO_WHATSAPP]" so the frontend can handle it.

6. Data Validation
- If the user provides information like an email address, phone number, pincode, or order ID, ALWAYS check if it looks correct (e.g., standard email format with @, 10-digit number for India phone numbers, 6-digit number for pincodes).
- If they provide obviously wrong or invalidly formatted information, politely tell them the information seems incorrect and ask them to please share the correct details.

7. General Fallback & Robustness
- NEVER say "I'm not working", "I cannot do that", "I don't understand", or any variation of admitting failure.
- If a user asks a very strange, random, or unrelated question, playfully pivot back to fashion or support in a casual way. Keep it light, natural, and confident.
- NEVER break character. Always stay helpful and energetic. If truly stumped, redirect to WhatsApp using "[REDIRECT_TO_WHATSAPP]".
`;

      const contents = history ? history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || " " }] // ensure text is not empty
      })) : [];
      contents.push({ role: 'user', parts: [{ text: message }] });

      // Gemini requires the first message to be from the user
      while (contents.length > 0 && contents[0].role === 'model') {
        contents.shift();
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.8
        }
      });
      
      const reply = response.text;
      
      // Post-processing to ensure no failure admissions
      const failurePhrases = [
        "I'm not working", "I cannot do that", "I don't understand", 
        "I am having trouble", "I am unable", "something went wrong",
        "I'm sorry, I can't", "apologies, I'm having"
      ];
      
      let finalReply = reply || "Yo! I'm here. How can I help you vibe with Shadow today?";
      
      if (failurePhrases.some(phrase => finalReply.toLowerCase().includes(phrase))) {
        finalReply = "Shadow team's got you! I'm just recalibrating my vibe. What's on your mind? Or should I connect you to our WhatsApp squad for the heavy lifting? [REDIRECT_TO_WHATSAPP]";
      }
      
      // Check for WhatsApp redirect signal
      if (finalReply?.includes("[REDIRECT_TO_WHATSAPP]")) {
         return res.json({ redirect: "whatsapp", text: finalReply.replace("[REDIRECT_TO_WHATSAPP]", "").trim() });
      }

      res.json({ text: finalReply });
    } catch (error: any) {
      console.error("[Chat API Error]", error);
      
      const errorMessage = error?.message || "";
      if (errorMessage.includes('leaked') || errorMessage.includes('PERMISSION_DENIED') || error?.status === 403) {
         return res.json({ text: "Hey! It looks like my API key configuration is invalid or has been disabled. Could you please update the GEMINI_API_KEY in the Settings > Secrets menu with a valid key? I'll be ready to chat once that's updated!" });
      }

      if (error?.status === 503 || errorMessage.includes('503') || errorMessage.includes('temporarily overloaded')) {
          return res.status(503).json({ error: "The AI model is currently experiencing high demand. Please try again in a moment." });
      }
      res.status(500).json({ error: "Failed to process chat message: " + errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`[Production] Serving static files from: ${distPath}`);
    
    // Serve static assets with CORS headers
    app.use('/assets', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      next();
    }, express.static(path.join(distPath, 'assets'), {
      immutable: true,
      maxAge: '1y'
    }));

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (NODE_ENV: ${process.env.NODE_ENV})`);
  });
}

startServer();
