import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Eclipse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, favorites, setIsCartOpen, setIsFavOpen, setIsSearchOpen, setViewedProduct, viewedProduct, currentView, setCurrentView, connectionStatus } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWhiteHeader = viewedProduct !== null || currentView === 'new-arrivals' || currentView === 'shop-all' || currentView === 'men-wear' || currentView === 'women-wear';
  const headerBgClass = isWhiteHeader 
    ? 'bg-white text-black border-b border-gray-200/50 shadow-sm' 
    : (isScrolled ? 'bg-black/30 backdrop-blur-md border-b border-white/10 text-white' : 'bg-transparent text-white');

  return (
    <header className={`fixed top-0 left-0 w-full z-50 font-sans transition-all duration-300 ${headerBgClass}`}>
      {/* Announcement Bar */}
      <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
        <div className="bg-gradient-to-r from-neutral-900 via-black to-neutral-900 text-white py-2 flex text-[10px] sm:text-[11px] leading-tight border-b border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
          <div className="flex whitespace-nowrap uppercase tracking-[0.2em] font-semibold animate-marquee w-max relative z-10">
            <div className="flex gap-10 items-center px-5">
            <span>FREE DELIVERY ON ALL ORDERS</span>
            <span className="text-gray-500">•</span>
            <span>EXTRA 10% OFF | USE CODE: WEED10</span>
            <span className="text-gray-500">•</span>
            <span>FREE DELIVERY ON ALL ORDERS</span>
            <span className="text-gray-500">•</span>
            <span>EXTRA 10% OFF | USE CODE: WEED10</span>
            <span className="text-gray-500">•</span>
            <span>FREE DELIVERY ON ALL ORDERS</span>
            <span className="text-gray-500">•</span>
            <span>EXTRA 10% OFF | USE CODE: WEED10</span>
            <span className="text-gray-500">•</span>
          </div>
          <div className="flex gap-10 items-center px-5" aria-hidden="true">
            <span>FREE DELIVERY ON ALL ORDERS</span>
            <span className="text-gray-500">•</span>
            <span>EXTRA 10% OFF | USE CODE: WEED10</span>
            <span className="text-gray-500">•</span>
            <span>FREE DELIVERY ON ALL ORDERS</span>
            <span className="text-gray-500">•</span>
            <span>EXTRA 10% OFF | USE CODE: WEED10</span>
            <span className="text-gray-500">•</span>
            <span>FREE DELIVERY ON ALL ORDERS</span>
            <span className="text-gray-500">•</span>
            <span>EXTRA 10% OFF | USE CODE: WEED10</span>
            <span className="text-gray-500">•</span>
          </div>
        </div>
      </div>
      </div>

        {/* Main Nav */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between transition-all">
        {/* Left Links - Mobile Menu Toggle */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1 hover:opacity-70 transition"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-semibold tracking-widest">
            <a href="#" className="flex items-center gap-1.5 hover:opacity-70 transition">
              WOMEN <span className="text-[8px] opacity-70">▼</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:opacity-70 transition">
              MEN <span className="text-[8px] opacity-70">▼</span>
            </a>
          </nav>
        </div>

        {/* Center Logo */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setViewedProduct(null);
              setCurrentView('old-home');
            }}
          >
            <div className="relative flex items-center justify-center">
              <Eclipse size={28} className="text-current group-hover:rotate-180 transition-transform duration-700 ease-in-out" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 blur-md rounded-full transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl md:text-2xl font-black tracking-[-0.05em] uppercase italic">SHADOW</span>
            </div>
          </div>
          
          {/* Shopify Audit Dot */}
          <div className="relative group/status flex items-center mb-1">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-colors duration-500 ${
              connectionStatus === 'connected' ? 'bg-green-500 shadow-green-500/50' : 
              connectionStatus === 'loading' ? 'bg-amber-400 animate-pulse' : 'bg-red-500 shadow-red-500/50'
            }`} />
            <div className="absolute left-full ml-2 hidden group-hover/status:block whitespace-nowrap bg-black text-white text-[8px] font-black tracking-[0.2em] uppercase px-2 py-1 rounded shadow-xl border border-white/10 z-[100]">
              Shopify: {connectionStatus === 'connected' ? 'Live' : connectionStatus.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Right Actions & Search */}
        <div className="flex items-center gap-3 sm:gap-5 justify-end flex-1">
          <Search onClick={() => setIsSearchOpen(true)} size={22} className="cursor-pointer hover:opacity-80 transition" strokeWidth={1.5} />
          <User size={22} className="hidden sm:block cursor-pointer hover:opacity-80 transition" strokeWidth={1.5} />
          <div className="relative cursor-pointer hover:opacity-80 transition" onClick={() => setIsFavOpen(true)}>
            <Heart size={22} strokeWidth={1.5} />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#e33535] text-white text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </div>
          <div className="relative cursor-pointer hover:opacity-80 transition" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className={`absolute -top-1.5 -right-2.5 text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold ${isWhiteHeader ? 'bg-black text-white' : 'bg-white text-black'}`}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[200]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-full max-w-[300px] bg-white text-black shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Eclipse size={24} strokeWidth={2.5} />
                    <span className="font-black tracking-[-0.05em] text-xl italic">SHADOW</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                    <h4 className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Categories</h4>
                    <a href="#" className="text-2xl font-black tracking-tight hover:text-gray-500 transition">WOMEN</a>
                    <a href="#" className="text-2xl font-black tracking-tight hover:text-gray-500 transition">MEN</a>
                    <a href="#" className="text-2xl font-black tracking-tight hover:text-gray-500 transition">ACCESSORIES</a>
                    <a href="#" onClick={() => { setIsMobileMenuOpen(false); setCurrentView('new-arrivals'); }} className="text-2xl font-black tracking-tight text-[#e33535] hover:opacity-80 transition">NEW IN</a>
                </div>
                <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-8">
                    <div className="flex items-center gap-3 text-sm font-bold opacity-70">
                        <User size={20} />
                        Account / Login
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
