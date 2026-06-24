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
    const titleLower = collectionMeta.title.toLowerCase();
    const categoryLower = collectionMeta.category.toLowerCase();
    
    // Create base terms (handle simple plurals like "t-shirts" -> "t-shirt")
    const searchTerms = [
      titleLower,
      categoryLower,
      titleLower.endsWith('s') ? titleLower.slice(0, -1) : titleLower,
      categoryLower.endsWith('s') ? categoryLower.slice(0, -1) : categoryLower
    ];
    
    const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const matchesSearch = searchTerms.some(term => {
      const cleanTerm = cleanStr(term);
      return cleanStr(product.title).includes(cleanTerm) || 
             cleanStr(product.description).includes(cleanTerm) ||
             product.collections.some(c => cleanStr(c).includes(cleanTerm));
    });

    const matchesGender = collectionMeta.gender 
      ? product.collections.some(c => {
          const cClean = cleanStr(c);
          const genderClean = cleanStr(collectionMeta.gender!);
          const genderPluralClean = cleanStr(collectionMeta.gender! === 'women' ? "womens" : "mens");
          
          if (collectionMeta.gender === 'men') {
             return (cClean.includes('men') && !cClean.includes('women')) || cClean === 'men' || cClean === 'mens';
          }
          
          return cClean.includes(genderClean) || cClean.includes(genderPluralClean);
        }) ||
        (collectionMeta.gender === 'men' 
          ? (cleanStr(product.title).includes('men') && !cleanStr(product.title).includes('women'))
          : (cleanStr(product.title).includes(cleanStr(collectionMeta.gender!)) || cleanStr(product.title).includes(cleanStr(collectionMeta.gender! === 'women' ? "womens" : "mens")))
        )
      : true;

    return matchesSearch && matchesGender;
  });

  return (
    <div className="w-full bg-white pb-20">
      <div className="pt-32 pb-12 px-6 flex flex-col items-center text-center">
        {/* Breadcrumbs */}
        <div className="text-[11px] text-black font-bold flex gap-2 tracking-[0.2em] uppercase mb-6">
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
      </div>

      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-3 md:px-6 py-12">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
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
