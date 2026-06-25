import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Ruler, ChevronRight, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function QuickAddDrawer() {
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen, 
    setIsCartOpen,
    quickAddProduct, 
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist
  } = useAppContext();

  const availableSizes = quickAddProduct?.variants ? [...new Set(quickAddProduct.variants.map((v: any) => {
    const sizeOpt = v.selectedOptions?.find((o: any) => o.name?.toLowerCase() === 'size' || o.name?.toLowerCase() === 'title');
    return sizeOpt ? sizeOpt.value : null;
  }).filter(Boolean))] : [];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (quickAddProduct) {
      setSelectedSize(null);
      setSelectedVariantId(quickAddProduct.variants?.[0]?.id);
      setQuantity(1);
    }
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  const isFavorite = isProductInWishlist(quickAddProduct.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const variantId = quickAddProduct.variants?.find((v: any) => 
      v.selectedOptions?.some((o: any) => o.value === selectedSize)
    )?.id || quickAddProduct.variants?.[0]?.id;

    addToCart({ ...quickAddProduct, size: selectedSize, quantity, variantId });
    setIsQuickAddOpen(false);
    setIsCartOpen(true);
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
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full md:max-w-[1050px] bg-white z-[101] shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Mobile Close */}
            <button 
              onClick={() => setIsQuickAddOpen(false)}
              className="absolute top-4 right-4 z-[110] md:hidden bg-white p-2 rounded-full shadow-lg"
            >
              <X size={20} />
            </button>

            {/* Left Image Section - Staggered Grid/Scroll */}
            <div className="w-full md:w-[60%] h-[45vh] md:h-full bg-white overflow-y-auto no-scrollbar md:border-r border-gray-100">
              <div className="flex flex-col gap-1">
                {quickAddProduct.images?.length > 0 ? (
                  quickAddProduct.images.map((img: string, idx: number) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`${quickAddProduct.title}-${idx}`}
                      className="w-full object-contain bg-white"
                    />
                  ))
                ) : (
                  <img 
                    src={quickAddProduct.image} 
                    alt={quickAddProduct.title}
                    className="w-full object-contain bg-white"
                  />
                )}
              </div>
            </div>

            {/* Right Details Section */}
            <div className="w-full md:w-[40%] flex flex-col h-full bg-white">
              {/* Header */}
              <div className="px-10 py-7 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-gray-500">Select Options</h2>
                <button 
                  onClick={() => setIsQuickAddOpen(false)}
                  className="hidden md:flex items-center justify-center p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-black"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 py-10">
                <div className="flex justify-between items-start gap-6 mb-6">
                  <h1 className="text-xl md:text-3xl font-bold text-black uppercase tracking-tight leading-[1.1] flex-1">
                    {quickAddProduct.title}
                  </h1>
                  <button 
                    onClick={() => isFavorite ? removeFromWishlist(quickAddProduct.id) : addToWishlist(quickAddProduct)}
                    className={`mt-1.5 transition-colors ${isFavorite ? 'text-[#df3333]' : 'text-gray-300 hover:text-black'}`}
                  >
                    <Heart size={26} fill={isFavorite ? "currentColor" : "none"} strokeWidth={1} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  {parseFloat(quickAddProduct.originalPrice) > parseFloat(quickAddProduct.salePrice) && (
                    <span className="text-gray-300 line-through text-lg font-medium">
                      Rs.{quickAddProduct.originalPrice}
                    </span>
                  )}
                  <span className="text-[#df3333] text-xl md:text-2xl font-bold">
                    Rs.{quickAddProduct.salePrice}
                  </span>
                  {parseFloat(quickAddProduct.originalPrice) > parseFloat(quickAddProduct.salePrice) && (
                    <span className="bg-[#df3333] text-white text-[10px] font-black px-2.5 py-1.5 rounded-sm uppercase tracking-wider">
                      SAVE {quickAddProduct.savePercentage}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-medium mb-10">
                  <span className="underline cursor-pointer">Shipping</span> calculated at checkout.
                </p>

                {/* Size Selection */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-black">SIZE: {selectedSize || 'Select'}</span>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-black transition uppercase tracking-widest">
                      <Ruler size={14} strokeWidth={2} />
                      <span className="border-b border-transparent hover:border-black transition-all">Sizing Guide</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                      const isAvailable = availableSizes.length === 0 || availableSizes.includes(size);
                      return (
                        <button 
                          key={size}
                          disabled={!isAvailable}
                          onClick={() => setSelectedSize(size)}
                          className={`h-14 flex items-center justify-center border text-[11px] font-bold transition-all ${!isAvailable ? 'opacity-30 cursor-not-allowed border-gray-100' : selectedSize === size ? 'border-black bg-white text-black ring-1 ring-black ring-inset' : 'border-gray-200 text-gray-900 hover:border-black'}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color/Style */}
                <div className="mb-10">
                   <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-black block mb-5">COLOR : </span>
                   <div className="flex gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i}
                          className={`w-16 h-20 border transition-all cursor-pointer p-0.5 ${i === 1 ? 'border-black opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                        >
                          <img 
                            src={quickAddProduct.image} 
                            alt={`color-${i}`} 
                            className="w-full h-full object-contain bg-white" 
                          />
                        </div>
                      ))}
                   </div>
                </div>

                {/* Quantity & Actions - Only visible after size selection */}
                <AnimatePresence mode="wait">
                  {selectedSize && (
                    <motion.div 
                      key="actions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 mb-14"
                    >
                      <div className="flex gap-3 h-14">
                        <div className="flex-none w-32 border border-black flex items-center justify-between px-5">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="text-gray-400 hover:text-black transition"
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <span className="font-bold text-sm">{quantity}</span>
                          <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="text-gray-400 hover:text-black transition"
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                        </div>

                        <button 
                          onClick={handleAddToCart}
                          className="flex-1 border border-black text-black font-bold text-[12px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Special Offers Banner - Removed per request */}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
