import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

// Standardizing the shopify fetch for server-side use
async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  const storefrontAccessToken = (process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STORE_TOKEN || '').trim();
  const domain = (process.env.VITE_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '').trim();

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
        console.log(`[Shopify Audit] SUCCESS using strategy: ${strategy.name}`);
        return { status: 200, body: json };
      }
      console.warn(`[Shopify Audit] Strategy ${strategy.name} failed with GraphQL errors:`, JSON.stringify(json.errors, null, 2));
    } else if (result) {
      console.warn(`[Shopify Audit] Strategy ${strategy.name} failed with status: ${result.status}`);
      try {
        const errText = await result.text();
        console.warn(`[Shopify Audit] Response body:`, errText.slice(0, 200));
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
    const { items } = req.body;
    
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

    const variables = {
      input: {
        lines: items.map((item: any) => ({
          merchandiseId: item.variantId,
          quantity: item.quantity
        }))
      }
    };

    const response = await shopifyFetch({ query, variables });
    
    console.log('[Shopify Server] Checkout/Cart Response:', JSON.stringify(response.body, null, 2));

    if (response.status !== 200) {
      return res.status(response.status).json(response);
    }
    res.json(response.body);
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
