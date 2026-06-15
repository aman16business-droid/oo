import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Ruler, ChevronRight, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function QuickAddDrawer() {
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen, 
    quickAddProduct, 
    setQuickAddProduct,
    addToCart,
    favorites,
    toggleFavorite
  } = useAppContext();

  const availableSizes = quickAddProduct?.variants ? [...new Set(quickAddProduct.variants.map((v: any) => {
    const sizeOpt = v.selectedOptions.find((o: any) => o.name.toLowerCase() === 'size' || o.name.toLowerCase() === 'title');
    return sizeOpt ? sizeOpt.value : null;
  }).filter(Boolean))] : [];

  const [selectedSize, setSelectedSize] = useState('OS');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (quickAddProduct) {
      const sizes = quickAddProduct.variants ? [...new Set(quickAddProduct.variants.map((v: any) => {
        const sizeOpt = v.selectedOptions.find((o: any) => o.name.toLowerCase() === 'size' || o.name.toLowerCase() === 'title');
        return sizeOpt ? sizeOpt.value : null;
      }).filter(Boolean))] : [];
      
      setSelectedSize(sizes[0] || 'OS');
      setSelectedVariantId(quickAddProduct.variants?.[0]?.id);
      setQuantity(1);
    }
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  const isFavorite = favorites.some((p) => p.id === quickAddProduct.id);

  const handleAddToCart = () => {
    addToCart({ ...quickAddProduct, size: selectedSize, quantity, variantId: selectedVariantId });
    setIsQuickAddOpen(false);
  };

  return (
    <AnimatePresence>
      {isQuickAddOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQuickAddOpen(false)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:max-w-[1000px] bg-white z-[101] shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Mobile Close */}
            <button 
              onClick={() => setIsQuickAddOpen(false)}
              className="absolute top-4 right-4 z-[110] md:hidden bg-white/80 p-2 rounded-full shadow-md"
            >
              <X size={20} />
            </button>

            {/* Left Image Section */}
            <div className="w-full md:w-[55%] h-[40vh] md:h-full bg-[#f9f9f9] overflow-y-auto no-scrollbar">
              <img 
                src={quickAddProduct.image} 
                alt={quickAddProduct.title}
                className="w-full h-full object-cover"
              />
              {/* Optional: Add more images if available in your data, but for now we follow the user prompt which shows the main image */}
            </div>

            {/* Right Details Section */}
            <div className="w-full md:w-[45%] flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-500">Select Options</h2>
                <button 
                  onClick={() => setIsQuickAddOpen(false)}
                  className="hidden md:flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="flex justify-between items-start gap-4">
                  <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">
                    {quickAddProduct.title}
                  </h1>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(quickAddProduct)}
                    className={`p-2 transition ${isFavorite ? 'text-[#e33535]' : 'text-gray-400 hover:text-black'}`}
                  >
                    <Heart size={24} fill={isFavorite ? "currentColor" : "none"} strokeWidth={1.5} />
                  </motion.button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xl font-bold text-[#e33535]">{quickAddProduct.salePrice}</span>
                  <span className="text-base text-gray-400 line-through font-medium">{quickAddProduct.originalPrice}</span>
                  <span className="bg-[#e33535] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Save {quickAddProduct.savePercentage}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 uppercase tracking-wide">Shipping calculated at checkout.</p>

                {/* Size Selection */}
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Size: {selectedSize}</span>
                    <button className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-black transition uppercase tracking-widest">
                      <Ruler size={14} />
                      Sizing Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.length > 0 ? (
                      availableSizes.map((size) => (
                        <motion.button 
                          key={size}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedSize(size);
                            const variant = quickAddProduct.variants.find((v: any) => v.selectedOptions.some((o: any) => o.value === size));
                            if (variant) setSelectedVariantId(variant.id);
                          }}
                          className={`min-w-[50px] px-3 h-12 flex items-center justify-center border text-[12px] font-bold tracking-widest uppercase rounded-sm transition-all ${selectedSize === size ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 text-gray-900 hover:border-gray-400'}`}
                        >
                          {size}
                        </motion.button>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs tracking-widest">No sizes available</span>
                    )}
                  </div>
                </div>

                {/* Color/Style - Placeholder based on image */}
                <div className="mt-8">
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 block mb-4">Color : </span>
                   <div className="flex gap-3">
                      <div className="w-16 h-20 border-2 border-black p-0.5 cursor-pointer">
                        <img src={quickAddProduct.image} alt="color-1" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-16 h-20 border border-gray-200 p-0.5 cursor-pointer opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition">
                        <img src={quickAddProduct.image} alt="color-2" className="w-full h-full object-cover" />
                      </div>
                   </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="mt-10 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-32 h-14 border border-gray-200 flex items-center px-4 rounded-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-gray-400 hover:text-black flex-1 text-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="flex-1 text-center font-bold">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-gray-400 hover:text-black flex-1 text-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-white border border-gray-900 text-black h-14 font-black text-[12px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center rounded-sm"
                    >
                      Add to Cart
                    </motion.button>
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-black text-white h-14 font-black text-[12px] tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:bg-gray-900 rounded-sm"
                  >
                    Buy It Now
                  </motion.button>
                </div>

                {/* Special Offers Banner - Matching image */}
                <div className="mt-8 border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Special Offers</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-400">Powered by</span>
                      <img src="https://gokwik.co/logos/gokwik_black.svg" alt="Gokwik" className="h-2 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:border-gray-300 transition">
                     <div className="absolute top-0 left-4 px-2 py-0.5 bg-gray-200 rounded-b text-[8px] font-bold uppercase tracking-tight text-gray-600">Prepaid Discounts</div>
                     <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shrink-0">
                        <div className="text-[10px] font-black">%</div>
                     </div>
                     <div className="flex-1">
                        <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">Get ₹50 Off on UPI</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">5+ Discounts Available</p>
                     </div>
                     <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition">
                        <ChevronRight size={14} />
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
