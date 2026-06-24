import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAsset, saveAsset, removeAsset } from './lib/db';
import { db, auth, storage } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import defaultHeroBanner from './assets/images/new_hero_banner_1781808849648.jpg';
import defaultMenBanner from './assets/images/men_fashion_banner_final_1781774068555.jpg';
import defaultWomenBanner from './assets/images/women_fashion_banner_final_1781774082253.jpg';

export interface Product {
  id: string;
  image: string;
  images: string[];
  title: string;
  handle: string;
  description: string;
  originalPrice: string;
  salePrice: string;
  savePercentage: string;
  inventory: number;
  available: boolean;
  variants: any[];
  collections: string[];
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
  variantId?: string;
}

export type ViewType = 'new-arrivals' | 'old-home' | 'shop-all' | 'men-wear' | 'women-wear' | 'search-results' | 'premium' | 'best-sellers' | 'home' | 'collection' | 'terms' | 'faqs' | 'privacy' | 'shipping-policy' | 'return-policy' | 'exchange-policy' | 'payment-policy';

interface CollectionMeta {
  title: string;
  category: string;
  gender?: 'men' | 'women';
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isProductInWishlist: (productId: string) => boolean;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

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
  collectionMeta: CollectionMeta | null;
  setCollectionMeta: (meta: CollectionMeta | null) => void;
  shopifyProducts: Product[];
  isLoading: boolean;
  connectionStatus: 'connected' | 'error' | 'loading';
  refreshProducts: () => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  fileToDataUri: (file: File) => Promise<string>;
  communityImages: string[];
  setCommunityImages: (images: string[]) => void;
  uploadCommunityImage: (index: number, file: File) => Promise<string>;
  uploadProductImage: (productId: string, file: File) => Promise<string>;
  siteSettings: {
    heroBanner: string;
    menBanner: string;
    womenBanner: string;
    ugcVideos: string[];
    lockedKeys: string[];
  };
  setSiteSettings: (settings: any) => void;
  uploadSiteAsset: (key: string, file: File) => Promise<string>;
  updateSiteAssetUrl: (key: string, url: string) => Promise<void>;
  resetSiteAsset: (key: string) => Promise<void>;
  uploadUgcVideo: (index: number, file: File) => Promise<string>;
  isLocked: (key: string) => boolean;
  isUploading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  deliveryPincode: string;
  setDeliveryPincode: (pin: string) => void;
}

const INITIAL_UGC_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-a-street-wear-outfit-34533-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-fashion-girl-in-a-studio-setting-34516-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-girl-in-a-modern-outfit-posing-for-the-camera-34511-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-fashionable-outfit-34547-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-a-fashionable-outfit-in-the-city-34505-large.mp4"
];

const INITIAL_COMMUNITY_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554412930-c74f63ca9c8a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-152913957ed06-5906f9141f0d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
];

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Archive Logo Tee',
    handle: 'archive-logo-tee',
    description: 'A heavyweight premium cotton tee featuring our heritage logo in a faded vintage print. Boxy fit, drop shoulders.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'],
    originalPrice: '4500',
    salePrice: '3200',
    savePercentage: '29%',
    inventory: 10,
    available: true,
    variants: [],
    collections: ['new-arrivals', 'best-sellers', 'men'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Shadow Cargo Pants',
    handle: 'shadow-cargo-pants',
    description: 'Technical cargo pants with multi-pocket configuration and adjustable toggle hems. Water-resistant nylon blend.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae6c?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae6c?q=80&w=800&auto=format&fit=crop'],
    originalPrice: '8900',
    salePrice: '8900',
    savePercentage: '0%',
    inventory: 5,
    available: true,
    variants: [],
    collections: ['new-arrivals', 'men'],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Onyx Utility Vest',
    handle: 'onyx-utility-vest',
    description: 'Layering essential with breathable mesh lining and four oversized utility pockets. Matte black hardware.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop'],
    originalPrice: '6200',
    salePrice: '4800',
    savePercentage: '23%',
    inventory: 8,
    available: true,
    variants: [],
    collections: ['best-sellers', 'women'],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Distortion Graphic Hoodie',
    handle: 'distortion-graphic-hoodie',
    description: 'Heavyweight fleece hoodie with screen-printed distortion graphic on back. Relaxed silhouette.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'],
    originalPrice: '7500',
    salePrice: '7500',
    savePercentage: '0%',
    inventory: 12,
    available: true,
    variants: [],
    collections: ['new-arrivals', 'women'],
    createdAt: new Date().toISOString()
  }
];

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Don't throw here, just log it. Let the caller decide if it should throw.
  return errInfo;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved wishlist', e);
      }
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [viewedProduct, setViewedProductState] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [isCartBarVisible, setIsCartBarVisible] = useState(false);

  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [siteSettings, setSiteSettings] = useState(() => {
    const defaults = {
      heroBanner: defaultHeroBanner,
      menBanner: defaultMenBanner,
      womenBanner: defaultWomenBanner,
      ugcVideos: INITIAL_UGC_VIDEOS,
      lockedKeys: []
    };
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Replace old raw /src/assets paths with the correct Vite imports
        if (parsed.heroBanner?.startsWith('/src/assets/')) parsed.heroBanner = defaultHeroBanner;
        if (parsed.menBanner?.startsWith('/src/assets/')) parsed.menBanner = defaultMenBanner;
        if (parsed.womenBanner?.startsWith('/src/assets/')) parsed.womenBanner = defaultWomenBanner;
        
        return { ...defaults, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved siteSettings', e);
      }
    }
    return defaults;
  });

  const [communityImages, setCommunityImages] = useState<string[]>(INITIAL_COMMUNITY_IMAGES);

  const [shopifyProducts, setShopifyProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shopifyProducts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  // Helper to apply overrides from IndexedDB to products
  const applyProductOverrides = async (products: Product[]) => {
    return await Promise.all(products.map(async (p) => {
      const blob = await getAsset(`productImage_${p.id}`);
      if (blob) {
        return { ...p, image: URL.createObjectURL(blob as Blob) };
      }
      return p;
    }));
  };

  // Keep shopifyProducts in sync with localStorage for basic metadata
  useEffect(() => {
    if (shopifyProducts.length > 0) {
      // Filter out blob URLs if possible to avoid storing dead refs
      const cleanProducts = shopifyProducts.map(p => {
        if (p.image?.startsWith('blob:')) {
          // Find original product image if possible or just remove it to force override load next time
          return { ...p, image: '' }; 
        }
        return p;
      });
      localStorage.setItem('shopifyProducts', JSON.stringify(cleanProducts));
    }
  }, [shopifyProducts]);

  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'loading'>('loading');
  const [syncKey, setSyncKey] = useState(0);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUserState] = useState<any | null>(() => {
    const savedUser = localStorage.getItem('shadow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [deliveryPincode, setDeliveryPincode] = useState('');

  const setUser = (newUser: any | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('shadow_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('shadow_user');
    }
  };

  const initShopify = async () => {
    setIsLoading(true);
    setConnectionStatus('loading');
    try {
      const { getAllProducts, getShop } = await import('./lib/shopify');
      console.log(`[Shopify Audit] SYNC START - Looking for Store: ${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'NOT SET'}`);
      console.log('INITIATING LIVE SHOPIFY AUDIT...', new Date().toISOString());
      
      const shop = await getShop();
      if (shop) {
        console.log(`[Shopify Audit] CONNECTED TO SHOP: ${shop.name}`);
      } else {
        console.warn('[Shopify Audit] Could not fetch shop info. Token might be restricted.');
      }

      const edges = await getAllProducts();
      
      if (!edges || edges.length === 0) {
        console.warn('SHOPIFY API RETURNED 0 PRODUCTS. Checking for server-side error...');
        // If we got back 0 but reached the server, maybe there's an error message inside
      }

      const formatted: Product[] = edges.map(({ node }: any) => {
        const isAvailable = node.variants?.edges?.some((edge: any) => edge.node.availableForSale) || false;
        const imagesArr = node.images?.edges?.map((e: any) => e.node.url) || [];
        
        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          description: node.description || '',
          image: imagesArr[0] || '',
          images: imagesArr,
          originalPrice: node.compareAtPriceRange?.minVariantPrice?.amount || node.priceRange?.minVariantPrice?.amount || '0',
          salePrice: node.priceRange?.minVariantPrice?.amount || '0',
          savePercentage: (() => {
            const sale = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
            const original = parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount || node.priceRange?.minVariantPrice?.amount || '0');
            if (original > sale && original > 0) {
              return Math.round((1 - (sale / original)) * 100).toString() + '%';
            }
            return '0%';
          })(),
          inventory: 0,
          available: isAvailable,
          variants: node.variants?.edges?.map((v: any) => v.node) || [],
          collections: node.collections?.edges?.map((c: any) => c.node.handle) || [],
          createdAt: node.createdAt
        };
      });

      // Apply overrides after fetching from Shopify
      const overridden = await applyProductOverrides(formatted);

      console.log('--- SHOPIFY LIVE PRODUCT AUDIT ---');
      console.table(overridden.map(p => ({ 
        Title: p.title, 
        Collections: p.collections.join(', '), 
        Price: p.salePrice,
        Available: p.available,
        Date: p.createdAt
      })));

      setShopifyProducts(overridden);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('AppContext initShopify error:', error);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load custom assets and sync with Shopify
  useEffect(() => {
    const initializeStore = async () => {
      // 0. Robustness: Anonymous sign-in for Storage/Firestore access
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
          console.log('[Firebase] Anonymous sign-in successful');
        }
      } catch (authErr) {
        console.warn('[Firebase] Anonymous sign-in failed, continuing as guest:', authErr);
      }

      // 1. Load Assets from Firestore & IndexedDB
      const bannerKeys = ['heroBanner', 'menBanner', 'womenBanner'];
      const bannerOverrides: any = {};
      const newLockedKeys = new Set<string>();
      
      try {
        const settingsRef = doc(db, 'settings', 'siteSettings');
        const snap = await getDoc(settingsRef);
        if (snap.exists()) {
           const data = snap.data();
           console.log("[Firebase] Loaded site settings:", data);
           for (const key of bannerKeys) {
             if (data[key]) {
               bannerOverrides[key] = data[key];
               newLockedKeys.add(key);
             }
           }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'settings/siteSettings');
      }

      // Fallback to IndexedDB for anything not in Firestore
      for (const key of bannerKeys) {
        if (!bannerOverrides[key]) {
          const blob = await getAsset(key);
          if (blob) {
            bannerOverrides[key] = URL.createObjectURL(blob as Blob);
            newLockedKeys.add(key);
          }
        }
      }

      const ugcVideos = [...INITIAL_UGC_VIDEOS];
      for (let i = 0; i < 5; i++) {
        const blob = await getAsset(`ugcVideo_${i}`);
        if (blob) {
          ugcVideos[i] = URL.createObjectURL(blob as Blob);
        }
      }

      const commImages = [...INITIAL_COMMUNITY_IMAGES];
      for (let i = 0; i < INITIAL_COMMUNITY_IMAGES.length; i++) {
        const blob = await getAsset(`communityImage_${i}`);
        if (blob) {
          commImages[i] = URL.createObjectURL(blob as Blob);
        }
      }
      setCommunityImages(commImages);

      setSiteSettings((prev: any) => ({
        ...prev,
        ...bannerOverrides,
        ugcVideos,
        lockedKeys: [...new Set([...(prev.lockedKeys || []), ...Array.from(newLockedKeys)])]
      }));

      // 2. Fetch from Shopify and apply overrides
      await initShopify();
      
      setShopifyProducts(prev => {
        if (prev.length === 0) {
          console.log('[Shopify Fallback] No products found, using initial catalog.');
          return INITIAL_PRODUCTS;
        }
        return prev;
      });
    };

    initializeStore();
  }, [syncKey]);

  useEffect(() => {
    // Save settings to localStorage, filtering out blob URLs but keeping lockedKeys
    const cleanSettings = { ...siteSettings };
    if (cleanSettings.heroBanner?.startsWith('blob:')) delete cleanSettings.heroBanner;
    if (cleanSettings.menBanner?.startsWith('blob:')) delete cleanSettings.menBanner;
    if (cleanSettings.womenBanner?.startsWith('blob:')) delete cleanSettings.womenBanner;
    if (cleanSettings.ugcVideos) {
      cleanSettings.ugcVideos = cleanSettings.ugcVideos.map((v, i) => 
        v.startsWith('blob:') ? INITIAL_UGC_VIDEOS[i] : v
      );
    }
    try {
      localStorage.setItem('siteSettings', JSON.stringify(cleanSettings));
    } catch (e) {
      console.warn("Failed to save siteSettings to localStorage, might be too large:", e);
    }
  }, [siteSettings]);

  const isLocked = (key: string) => siteSettings.lockedKeys?.includes(key);

  const updateSiteAssetUrl = async (key: string, url: string) => {
    setIsUploading(true);
    try {
      console.log(`[Asset] Updating ${key} with URL: ${url}`);
      
      // 1. Update Firestore for persistence
      const settingsRef = doc(db, 'settings', 'siteSettings');
      await setDoc(settingsRef, { [key]: url }, { merge: true });
      
      // 2. Update Local State
      setSiteSettings((prev: any) => ({
        ...prev,
        [key]: url,
        lockedKeys: [...new Set([...(prev.lockedKeys || []), key])]
      }));
      
      console.log(`[Asset] Successfully updated ${key} in Firestore`);
    } catch (err) {
      console.error(`Failed to update asset URL for ${key}:`, err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const resetSiteAsset = async (key: string) => {
    setIsUploading(true);
    try {
      console.log(`[Asset] Resetting ${key} to default`);
      
      // 1. Remove from Firestore
      const settingsRef = doc(db, 'settings', 'siteSettings');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        delete data[key];
        await setDoc(settingsRef, data);
      }
      
      // 2. Remove from Local Storage / IndexedDB
      await removeAsset(key);
      
      // 3. Update State (let it revert to default)
      setSiteSettings((prev: any) => {
        const next = { ...prev };
        delete next[key];
        next.lockedKeys = next.lockedKeys?.filter((k: string) => k !== key) || [];
        return next;
      });
      
      console.log(`[Asset] Successfully reset ${key}`);
    } catch (err) {
      console.error(`Failed to reset asset ${key}:`, err);
    } finally {
      setIsUploading(false);
    }
  };

  const compressImage = async (file: File, maxWidth: number = 2560, quality: number = 0.92): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No canvas context');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Use jpeg for better predictability in size while maintaining high quality
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const uploadSiteAsset = async (key: string, file: File) => {
    setIsUploading(true);
    console.log(`[Asset] Starting upload for ${key} (${(file.size / 1024).toFixed(2)} KB)`);
    
    try {
      let finalUrl = '';

      // 1. Try Firebase Storage with a 30-second timeout
      try {
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
        const fileName = `siteAssets/${safeKey}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const fileRef = storageRef(storage, fileName);
        
        console.log(`[Asset] Firebase Storage Upload Attempt: ${fileName}`);
        
        const uploadPromise = uploadBytes(fileRef, file);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase upload timed out after 30s')), 30000)
        );

        await Promise.race([uploadPromise, timeoutPromise]);
        finalUrl = await getDownloadURL(fileRef);

        console.log(`[Asset] Firebase Storage Success: ${finalUrl}`);

        // 2. Sync to Firestore
        const settingsRef = doc(db, 'settings', 'siteSettings');
        await setDoc(settingsRef, { [key]: finalUrl }, { merge: true });
        console.log(`[Asset] Firestore Metadata Sync Success`);
      } catch (fbErr: any) {
        console.error(`[Asset] Firebase failed: ${fbErr.message || fbErr}`);
        
        // Fallback to local Data URI + IndexedDB without compression
        console.log(`[Asset] Falling back to local storage for ${key}`);
        await saveAsset(key, file);
        finalUrl = await fileToDataUri(file);
      }

      // Update state
      setSiteSettings((prev: any) => ({
        ...prev,
        [key]: finalUrl,
        lockedKeys: [...new Set([...(prev.lockedKeys || []), key])]
      }));
      
      console.log(`[Asset] Upload process complete for ${key}`);
      return finalUrl;
    } catch (err) {
      console.error(`[Asset] CRITICAL failure for ${key}:`, err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadUgcVideo = async (index: number, file: File) => {
    try {
      const key = `ugcVideo_${index}`;
      await saveAsset(key, file);
      const url = URL.createObjectURL(file);
      setSiteSettings(prev => {
        const nextVideos = [...prev.ugcVideos];
        nextVideos[index] = url;
        return { 
          ...prev, 
          ugcVideos: nextVideos,
          lockedKeys: [...new Set([...(prev.lockedKeys || []), key])]
        };
      });
      return url;
    } catch (err) {
      console.error(`Failed to upload video at index ${index}:`, err);
      throw err;
    }
  };

  const uploadCommunityImage = async (index: number, file: File) => {
    try {
      const key = `communityImage_${index}`;
      await saveAsset(key, file);
      const url = URL.createObjectURL(file);
      setCommunityImages(prev => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
      // Community images don't use siteSettings.lockedKeys, 
      // but let's add them to siteSettings anyway to track globally
      setSiteSettings(prev => ({
        ...prev,
        lockedKeys: [...new Set([...(prev.lockedKeys || []), key])]
      }));
      return url;
    } catch (err) {
      console.error(`Failed to upload community image at index ${index}:`, err);
      throw err;
    }
  };

  const uploadProductImage = async (productId: string, file: File) => {
    try {
      const key = `productImage_${productId}`;
      await saveAsset(key, file);
      const url = URL.createObjectURL(file);
      updateProduct(productId, { image: url });
      setSiteSettings(prev => ({
        ...prev,
        lockedKeys: [...new Set([...(prev.lockedKeys || []), key])]
      }));
      return url;
    } catch (err) {
      console.error(`Failed to upload product image for ${productId}:`, err);
      throw err;
    }
  };

  const [currentView, setCurrentView] = useState<ViewType>(() => {
    return (localStorage.getItem('currentView') as ViewType) || 'home';
  });
  
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const [collectionMeta, setCollectionMeta] = useState<CollectionMeta | null>(null);

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setShopifyProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const openQuickAdd = (product: Product) => {
    setQuickAddProduct(product);
    setIsQuickAddOpen(true);
  };

  const refreshProducts = async () => {
    setSyncKey(prev => prev + 1);
  };

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

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter(p => p.id !== productId));
  };

  const isProductInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
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

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        isProductInWishlist,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
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
        collectionMeta,
        setCollectionMeta,
        shopifyProducts,
        isLoading,
        connectionStatus,
        refreshProducts,
        updateProduct,
        fileToDataUri,
        siteSettings,
        setSiteSettings,
        uploadSiteAsset,
        uploadUgcVideo,
        communityImages,
        setCommunityImages,
        uploadCommunityImage,
        uploadProductImage,
        updateSiteAssetUrl,
        resetSiteAsset,
        isLocked,
        isUploading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        setUser,
        deliveryPincode,
        setDeliveryPincode,
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
