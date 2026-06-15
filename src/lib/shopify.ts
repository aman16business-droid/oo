
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.error('[Shopify Audit] CRITICAL: Missing Shopify configuration in .env file.');
  console.log('[Shopify Audit] Domain:', domain);
  console.log('[Shopify Audit] Token:', storefrontAccessToken ? '********' : 'MISSING');
}

async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  if (!domain || !storefrontAccessToken) {
    console.error('[Shopify Audit] Configuration missing.');
    return { status: 500, error: 'Shopify configuration missing' };
  }
  try {
    const isPrivate = storefrontAccessToken.startsWith('shpat_');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isPrivate) {
      headers['Shopify-Storefront-Private-Token'] = storefrontAccessToken!;
    } else {
      headers['X-Shopify-Storefront-Access-Token'] = storefrontAccessToken!;
    }

    // Use a unique cache-busting parameter and no-store to force fresh data from Shopify's edge
    const cacheBuster = `cb=${Date.now()}`;
    const url = `https://${domain}/api/2024-01/graphql.json?${cacheBuster}`;

    console.log(`[Shopify Audit] Fetching LIVE from: ${url}`);

    const result = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      cache: 'no-store', // Force browser to bypass cache
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.error('[Shopify Audit] HTTP Error:', result.status, errorText);
      
      // Fallback for some Shopify apps that use X-Shopify-Access-Token instead for Storefront
      if (result.status === 401) {
        console.warn('[Shopify Audit] 401 detected. Trying fallback header X-Shopify-Access-Token...');
        const retryResult = await fetch(url, {
          method: 'POST',
          headers: {
            ...headers,
            'X-Shopify-Access-Token': storefrontAccessToken!,
          },
          body: JSON.stringify({ query, variables }),
          cache: 'no-store',
        });
        if (retryResult.ok) {
          const json = await retryResult.json();
          return { status: retryResult.status, body: json };
        }
      }
      
      throw new Error(`Shopify API error: ${result.status}`);
    }

    const json = await result.json();
    
    if (json.errors) {
      console.error('[Shopify Audit] GraphQL Errors:', JSON.stringify(json.errors, null, 2));
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
