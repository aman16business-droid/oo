
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.error('[Shopify Audit] CRITICAL: Missing Shopify configuration in .env file.');
  console.log('[Shopify Audit] Domain:', domain);
  console.log('[Shopify Audit] Token:', storefrontAccessToken ? '********' : 'MISSING');
}

async function apiFetch(path: string) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${path}:`, error);
    return null;
  }
}

export async function getAllProducts() {
  const data = await apiFetch('/api/shopify/products');
  return data?.data?.products?.edges || [];
}

export async function getShop() {
  const data = await apiFetch('/api/shopify/shop');
  return data?.data?.shop;
}

export async function createCheckout(items: { variantId: string; quantity: number }[]) {
  try {
    const response = await fetch('/api/shopify/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });
    const data = await response.json();
    
    // Check for userErrors
    if (data?.data?.cartCreate?.userErrors?.length > 0) {
      console.error('Cart Create Errors:', data.data.cartCreate.userErrors);
      // Return the first error message to display
      return { error: data.data.cartCreate.userErrors[0].message };
    }

    const url = data?.data?.cartCreate?.cart?.checkoutUrl || data?.data?.checkoutCreate?.checkout?.webUrl || null;
    return url ? { url } : { error: 'Failed to generate checkout URL' };
  } catch (error) {
    console.error('Checkout error:', error);
    return { error: 'Network error generating checkout' };
  }
}
