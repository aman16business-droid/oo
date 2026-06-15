import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

// Standardizing the shopify fetch for server-side use
async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STORE_TOKEN;

  if (!domain || !storefrontAccessToken) {
    return { status: 500, error: 'Shopify configuration missing' };
  }

  const isPrivate = storefrontAccessToken.startsWith('shpat_');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isPrivate) {
    headers['Shopify-Storefront-Private-Token'] = storefrontAccessToken!;
  } else {
    headers['X-Shopify-Storefront-Access-Token'] = storefrontAccessToken!;
  }

  // Try both Storefront and Admin endpoints if one fails? 
  // No, let's stick to the user's provided domain and token type.
  const url = `https://${domain}/api/2024-07/graphql.json`;

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    if (!result.ok) {
      // Fallback for Admin Token if the user provided one but named it Storefront Token
      if (result.status === 401 || result.status === 403) {
        const adminUrl = `https://${domain}/admin/api/2024-07/graphql.json`;
        const adminResult = await fetch(adminUrl, {
          method: 'POST',
          headers: {
            ...headers,
            'X-Shopify-Access-Token': storefrontAccessToken!,
          },
          body: JSON.stringify({ query, variables }),
        });
        if (adminResult.ok) {
          const json = await adminResult.json();
          return { status: adminResult.status, body: json };
        }
      }
      return { status: result.status, error: `Shopify API error: ${result.status}` };
    }

    const json = await result.json();
    return { status: result.status, body: json };
  } catch (error: any) {
    return { status: 500, error: error.message };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for products
  app.get("/api/shopify/products", async (req, res) => {
    const query = `
      query getProducts {
        products(first: 100, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              title
              handle
              createdAt
              publishedAt
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
                    quantityAvailable
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
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

    const response = await shopifyFetch({ query });
    if (response.status !== 200) {
      return res.status(response.status).json(response);
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
    const query = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lineItems: items.map((item: any) => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))
      }
    };

    const response = await shopifyFetch({ query, variables });
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
