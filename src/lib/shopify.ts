
const domain = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'shadowshopp.myshopify.com').replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

if (!domain || !storefrontAccessToken) {
  console.error('[Shopify Audit] CRITICAL: Missing Shopify configuration in .env file.');
  console.log('[Shopify Audit] Domain:', domain);
  console.log('[Shopify Audit] Token:', storefrontAccessToken ? '********' : 'MISSING');
}

async function apiFetch(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(path, options);
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

export async function createCheckout(items: { variantId: string; quantity: number; attributes?: { key: string; value: string }[] }[], attributes?: { key: string; value: string }[]) {
  try {
    const response = await fetch('/api/shopify/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items, attributes })
    });
    const data = await response.json();
    
    if (data?.data?.cartCreate?.userErrors?.length > 0) {
      console.error('Cart Create Errors:', data.data.cartCreate.userErrors);
      return { error: data.data.cartCreate.userErrors[0].message };
    }

    const url = data?.data?.cartCreate?.cart?.checkoutUrl || data?.data?.checkoutCreate?.checkout?.webUrl || null;
    return url ? { url } : { error: 'Failed to generate checkout URL' };
  } catch (error) {
    console.error('Checkout error:', error);
    return { error: 'Network error generating checkout' };
  }
}
