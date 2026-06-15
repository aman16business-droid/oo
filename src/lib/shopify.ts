
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.error('[Shopify Audit] CRITICAL: Missing Shopify configuration in .env file.');
  console.log('[Shopify Audit] Domain:', domain);
  console.log('[Shopify Audit] Token:', storefrontAccessToken ? '********' : 'MISSING');
}

async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  if (!domain || !storefrontAccessToken) {
    return { status: 500, error: 'Shopify configuration missing' };
  }
  try {
    const isPrivate = storefrontAccessToken.startsWith('shpat_');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isPrivate) {
      // Private Storefront Token (for server-side or advanced apps)
      headers['Shopify-Storefront-Private-Token'] = storefrontAccessToken!;
    } else {
      // Standard Public Storefront Token
      headers['X-Shopify-Storefront-Access-Token'] = storefrontAccessToken!;
    }

    console.log(`[Shopify Audit] Fetching from ${domain}...`);
    console.log(`[Shopify Audit] Using ${isPrivate ? 'Private' : 'Public'} Token.`);

    const result = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      cache: 'no-cache',
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.error('[Shopify Audit] HTTP Error:', result.status, errorText);
      throw new Error(`Shopify API error: ${result.status}`);
    }

    const json = await result.json();
    
    if (json.errors) {
      console.error('[Shopify Audit] GraphQL Errors:', json.errors);
    } else {
      console.log('[Shopify Audit] Successfully received data:', !!json.data);
    }

    return {
      status: result.status,
      body: json,
    };
  } catch (error) {
    console.error('[Shopify Audit] Fetch exception:', error);
    return {
      status: 500,
      error: 'Error receiving data from Shopify',
    };
  }
}

export async function getAllProducts() {
  const query = `
    query getProducts {
      products(first: 100, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
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
  
  if (response.error || !response.body?.data) {
    console.error('Shopify response error:', response);
    return [];
  }

  return response.body.data.products.edges;
}

export async function createCheckout(items: { variantId: string; quantity: number }[]) {
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
      lineItems: items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }))
    }
  };

  const response = await shopifyFetch({ query, variables });
  
  if (response.error || !response.body?.data?.checkoutCreate?.checkout) {
    console.error('Checkout error:', response);
    // Fallback or error handling
    return null;
  }

  return response.body.data.checkoutCreate.checkout.webUrl;
}
