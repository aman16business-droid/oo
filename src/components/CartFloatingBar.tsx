import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function CartFloatingBar() {
  const { cart, isCartBarVisible, setIsCartBarVisible, lastAddedItem, setIsCartOpen, isCartOpen, isSearchOpen, isWishlistOpen, viewedProduct } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isAnyDrawerOpen = isCartOpen || isSearchOpen || isWishlistOpen;
  
  // Do not show the cart floating bar on the product page on mobile, as it conflicts with the mobile floating add to cart bar
  const shouldHideOnMobile = viewedProduct !== null;

  useEffect(() => {
    if (cart.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cart.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [cart.length]);

  // Reset index when cart changes significantly
  useEffect(() => {
    if (currentIndex >= cart.length) {
      setCurrentIndex(0);
    }
  }, [cart.length, currentIndex]);

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.salePrice.replace(/[^0-9.]/g, ''));
    return acc + price * item.quantity;
  }, 0);

  // If there's an item specifically last added, we might want to prioritize it initially, 
  // but for rotating through "all product", we use the index.
  const displayItem = cart[currentIndex];

  if (!displayItem || cart.length === 0) return null;

  return (
    <AnimatePresence>
      {(isCartBarVisible && cart.length > 0 && !isAnyDrawerOpen) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed bottom-0 md:bottom-6 left-0 md:left-1/2 md:-translate-x-1/2 z-[100] w-full md:w-[calc(100%-32px)] md:max-w-[1000px] ${shouldHideOnMobile ? 'hidden md:block' : ''}`}
        >
          <div className="bg-white md:rounded-xl shadow-[0_-8px_25px_rgba(0,0,0,0.1)] md:shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-t md:border border-gray-100 overflow-hidden flex items-center py-1.5 md:py-2 px-4 md:px-6 gap-3 md:gap-6 backdrop-blur-2xl bg-white">
            {/* Product Info */}
            <div className="flex-1 min-w-0 h-9 md:h-14 relative overflow-hidden">
                <AnimatePresence initial={false}>
                    <motion.div 
                        key={currentIndex}
                        initial={{ y: 25, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -25, opacity: 0 }}
                        transition={{ 
                          type: 'spring', 
                          damping: 25, 
                          stiffness: 200,
                          opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex items-center gap-3 md:gap-4 w-full"
                    >
                        <div className="w-8 h-9 md:w-11 md:h-12 bg-gray-50 rounded md:rounded-md overflow-hidden shrink-0 border border-gray-100">
                            <img 
                                src={displayItem.image} 
                                alt={displayItem.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <span className="bg-black text-white text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest whitespace-nowrap">
                                    {cart.length > 1 ? `${currentIndex + 1}/${cart.length}` : 'ADDED'}
                                </span>
                                <span className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest hidden sm:inline">Size: {displayItem.size}</span>
                            </div>
                            <h3 className="text-[10px] md:text-sm font-black text-gray-900 uppercase tracking-tight truncate leading-tight mt-0.5">
                                {displayItem.title}
                            </h3>
                            <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                                <span className="text-[10px] md:text-[12px] font-black text-black">₹{displayItem.salePrice}</span>
                                <span className="bg-[#e33535] text-white text-[7px] font-black px-1 py-0.5 rounded uppercase tracking-tighter shrink-0">-{displayItem.savePercentage}%</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Total & Checkout */}
            <div className="flex items-center gap-2 md:gap-6 group">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Cart Total</span>
                <span className="text-lg font-black text-black">₹{cartTotal.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-1.5 md:gap-2">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="bg-black text-white px-5 md:px-8 h-10 md:h-[48px] rounded-lg md:rounded-xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span className="text-[13px] md:text-base capitalize font-semibold tracking-normal">Buy Now</span>
                  <div className="flex -space-x-1.5 items-center">
                     <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center z-10 border border-gray-200">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-1.5" />
                     </div>
                     <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center z-20 border border-white shadow-sm">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="GPay" className="h-3" />
                     </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setIsCartBarVisible(false)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100 shrink-0"
                >
                  <X size={16} md:size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
