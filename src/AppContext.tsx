import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  image: string;
  title: string;
  originalPrice: string;
  salePrice: string;
  savePercentage: string;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export type ViewType = 'new-arrivals' | 'old-home' | 'shop-all' | 'men-wear' | 'women-wear';

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavOpen: boolean;
  setIsFavOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  viewedProduct: Product | null;
  setViewedProduct: (product: Product | null) => void;

  recentlyViewed: Product[];
  lastAddedItem: CartItem | null;
  isCartBarVisible: boolean;
  setIsCartBarVisible: (visible: boolean) => void;

  updateCartItemQty: (index: number, newQty: number) => void;
  updateCartItemSize: (index: number, newSize: string) => void;

  quickAddProduct: Product | null;
  setQuickAddProduct: (product: Product | null) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  openQuickAdd: (product: Product) => void;

  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  shopifyProducts: Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isFavOpen, setIsFavOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [viewedProduct, setViewedProductState] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [isCartBarVisible, setIsCartBarVisible] = useState(false);

  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const openQuickAdd = (product: Product) => {
    setQuickAddProduct(product);
    setIsQuickAddOpen(true);
  };

  const [currentView, setCurrentView] = useState<ViewType>('new-arrivals');
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    async function initShopify() {
      try {
        const { getAllProducts } = await import('./lib/shopify');
        const edges = await getAllProducts();
        const formatted = edges.map(({ node }: any) => ({
          id: node.id,
          title: node.title,
          image: node.images.edges[0]?.node.url || '',
          originalPrice: node.compareAtPriceRange?.minVariantPrice.amount || node.priceRange.minVariantPrice.amount,
          salePrice: node.priceRange.minVariantPrice.amount,
          savePercentage: node.compareAtPriceRange ?
            Math.round((1 - (parseFloat(node.priceRange.minVariantPrice.amount) / parseFloat(node.compareAtPriceRange.minVariantPrice.amount))) * 100).toString() + '%'
            : '0%'
        }));
        setShopifyProducts(formatted);
      } catch (error) {
        console.error('Failed to fetch Shopify products:', error);
      }
    }
    initShopify();
  }, []);

  const setViewedProduct = (product: Product | null) => {
    setViewedProductState(product);
    if (product) {
      setRecentlyViewed((prev) => {
        // Filter out the product if it's already there to move it to the front
        const filtered = prev.filter((p) => p.id !== product.id);
        // Keep only top 10 recently viewed
        return [product, ...filtered].slice(0, 10);
      });
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.findIndex((i) => i.id === item.id && i.size === item.size);
      if (existing >= 0) {
        const next = [...prev];
        next[existing].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
    setLastAddedItem(item);
    setIsCartBarVisible(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCartItemQty = (index: number, newQty: number) => {
    setCart((prev) => {
      const next = [...prev];
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      next[index].quantity = newQty;
      return next;
    });
  };

  const updateCartItemSize = (index: number, newSize: string) => {
    setCart((prev) => {
      const next = [...prev];
      next[index].size = newSize;
      return next;
    });
  };

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        favorites,
        toggleFavorite,
        isFavOpen,
        setIsFavOpen,
        isSearchOpen,
        setIsSearchOpen,
        viewedProduct,
        setViewedProduct,
        recentlyViewed,
        lastAddedItem,
        isCartBarVisible,
        setIsCartBarVisible,
        updateCartItemQty,
        updateCartItemSize,
        quickAddProduct,
        setQuickAddProduct,
        isQuickAddOpen,
        setIsQuickAddOpen,
        openQuickAdd,
        currentView,
        setCurrentView,
        shopifyProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
