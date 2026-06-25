import { useEffect } from 'react';
import { 
  sendShopifyAnalytics, 
  getClientBrowserParameters,
  useShopifyCookies,
  AnalyticsEventName,
  AnalyticsPageType
} from '@shopify/hydrogen-react';
import { useAppContext } from './../AppContext';

export function ShopifyAnalyticsTracker({ shopId }: { shopId?: string }) {
  const { currentView, viewedProduct } = useAppContext();
  const shopDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
  const currentDomain = window.location.hostname;
  
  // Create cookies on current domain
  const hasCookies = useShopifyCookies({ hasUserConsent: true, domain: currentDomain });

  useEffect(() => {
    console.log('[ShopifyAnalyticsTracker] Check preconditions', { shopDomain, shopId, hasCookies });
    if (!shopDomain || !shopId || !hasCookies) return;

    const timeout = setTimeout(() => {
      try {
        let pageType: any = AnalyticsPageType.page;
        let resourceId = undefined;

        if (viewedProduct) {
          pageType = AnalyticsPageType.product;
          resourceId = viewedProduct.id;
        } else if (currentView === 'home') {
          pageType = AnalyticsPageType.home;
        } else if (
          (currentView as any) === 'category' || 
          currentView === 'collection' ||
          currentView === 'new-arrivals' ||
          currentView === 'shop-all' ||
          currentView === 'men-wear' ||
          currentView === 'women-wear' ||
          currentView === 'premium' ||
          currentView === 'best-sellers'
        ) {
          pageType = AnalyticsPageType.collection;
        } else if (currentView === 'search-results') {
          pageType = AnalyticsPageType.search;
        }

        const payload: any = {
          hasUserConsent: true,
          shopId,
          currency: 'USD',
          ...getClientBrowserParameters(),
          pageType,
          canonicalUrl: window.location.href,
        };

        if (resourceId) {
          payload.resourceId = resourceId;
        }

        console.log('[ShopifyAnalyticsTracker] Sending PAGE_VIEW', payload);
        sendShopifyAnalytics({
          eventName: AnalyticsEventName.PAGE_VIEW,
          payload
        }, shopDomain).catch((e: any) => console.warn('Shopify analytics warning:', e));

        if (pageType === AnalyticsPageType.collection) {
          console.log('[ShopifyAnalyticsTracker] Sending COLLECTION_VIEW', payload);
          sendShopifyAnalytics({
            eventName: AnalyticsEventName.COLLECTION_VIEW,
            payload
          }, shopDomain).catch((e: any) => console.warn('Shopify analytics warning:', e));
        }

        if (pageType === AnalyticsPageType.search) {
          console.log('[ShopifyAnalyticsTracker] Sending SEARCH_VIEW', payload);
          sendShopifyAnalytics({
            eventName: AnalyticsEventName.SEARCH_VIEW,
            payload
          }, shopDomain).catch((e: any) => console.warn('Shopify analytics warning:', e));
        }
        if (resourceId && pageType === AnalyticsPageType.product && viewedProduct) {
          const productPayload = {
            ...payload,
            products: [{
              productGid: viewedProduct.id,
              name: viewedProduct.title,
              brand: viewedProduct.vendor || 'Unknown',
              price: viewedProduct.priceRange?.minVariantPrice?.amount || viewedProduct.originalPrice || '0',
              quantity: 1,
            }]
          };
          console.log('[ShopifyAnalyticsTracker] Sending PRODUCT_VIEW', productPayload);
          sendShopifyAnalytics({
            eventName: AnalyticsEventName.PRODUCT_VIEW,
            payload: productPayload
          }, shopDomain).catch((e: any) => console.warn('Shopify analytics warning:', e));
        }
      } catch (e) {
        console.error('Failed to send Shopify analytics:', e);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentView, viewedProduct, shopDomain, shopId, hasCookies]);

  useEffect(() => {
    if (!shopDomain || !shopId || !hasCookies) return;

    const handleAddToCart = (e: any) => {
      const item = e.detail;
      const payload: any = {
        hasUserConsent: true,
        shopId,
        currency: 'USD',
        ...getClientBrowserParameters(),
        cartId: 'gid://shopify/Cart/unknown',
        products: [{
          productGid: item.id,
          variantGid: item.variantId || item.variants?.[0]?.id,
          name: item.title,
          brand: item.vendor || 'Unknown',
          price: item.priceRange?.minVariantPrice?.amount || item.originalPrice || '0',
          quantity: item.quantity,
        }]
      };
      
      console.log('[ShopifyAnalyticsTracker] Sending ADD_TO_CART', payload);
      sendShopifyAnalytics({
        eventName: AnalyticsEventName.ADD_TO_CART,
        payload
      }, shopDomain).catch((e: any) => console.warn('Shopify analytics warning:', e));
    };

    window.addEventListener('shopify:add_to_cart', handleAddToCart);
    return () => window.removeEventListener('shopify:add_to_cart', handleAddToCart);
  }, [shopDomain, shopId, hasCookies]);

  return null;
}
