import { useAppContext } from '../AppContext';
import { ProductCard } from './ProductSections';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import RecentlyViewed from './RecentlyViewed';

export default function CollectionPage() {
  const { 
    shopifyProducts, 
    setCurrentView, 
    setViewedProduct, 
    setCollectionMeta,
    collectionMeta,
    openQuickAdd 
  } = useAppContext();

  if (!collectionMeta) return null;

  // Filter products based on collectionMeta
  // For now, we search in titles/descriptions or collections handles if available
  const displayProducts = shopifyProducts.filter(product => {
    const searchTerms = [
      collectionMeta.title.toLowerCase(),
      collectionMeta.category.toLowerCase()
    ];
    
    const matchesSearch = searchTerms.some(term => 
      product.title.toLowerCase().includes(term) || 
      product.description.toLowerCase().includes(term) ||
      product.collections.some(c => c.toLowerCase().includes(term))
    );

    const matchesGender = collectionMeta.gender 
      ? product.collections.some(c => c.toLowerCase().includes(collectionMeta.gender!)) ||
        product.title.toLowerCase().includes(collectionMeta.gender!)
      : true;

    return matchesSearch && matchesGender;
  });

  return (
    <div className="w-full bg-white pb-20">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center bg-[#bdbdbd] overflow-hidden">
        {/* Breadcrumbs */}
        <div className="absolute top-10 left-10 text-[11px] text-white font-bold z-20 flex gap-2 tracking-[0.2em] uppercase">
          <button 
            onClick={() => {
              setViewedProduct(null);
              setCurrentView('old-home');
            }} 
            className="hover:opacity-60 transition-opacity"
          >
            Home
          </button> 
          <span className="opacity-40">/</span> 
          <button onClick={() => setCurrentView('shop-all')} className="hover:opacity-60 transition-opacity">Shop</button> 
          <span className="opacity-40">/</span> 
          <span className="opacity-60 cursor-default">{collectionMeta.title}</span>
        </div>

        {/* Hero Content */}
        <div className="relative flex items-center justify-center w-full px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-[100px] font-black uppercase tracking-tighter text-white select-none leading-none opacity-95"
          >
            {collectionMeta.title}
          </motion.h1>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
            {displayProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={openQuickAdd}
                onViewProduct={setViewedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <ChevronDown size={24} className="opacity-40 animate-bounce" />
             </div>
            <p className="text-sm font-medium tracking-widest uppercase">CATALOG EMPTY</p>
          </div>
        )}
      </div>

      <RecentlyViewed />
    </div>
  );
}
