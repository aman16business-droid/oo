
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  try {
    const result = await fetch(`https://${domain}/api/2024-01/graphql.json?cb=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-cache', // Prevents even browser-level caching
    });

    if (!result.ok) {
      const errorText = await result.text();
      console.error('SHOPIFY API RAW ERROR:', result.status, errorText);
      throw new Error(`Shopify API error: ${result.status} ${errorText}`);
    }

    const json = await result.json();
    console.log('SHOPIFY LIVE RESPONSE:', json);

    return {
      status: result.status,
      body: json,
    };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return {
      status: 500,
      error: 'Error receiving data from Shopify',
    };
  }
}

export async function getAllProducts() {
  const query = `
    query getProducts {
      products(first: 100) {
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
