import { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingBag, Menu, X, Eclipse, Heart, ChevronRight, Store, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import { saveAsset, getAsset } from '../lib/db';

type Category = 'Women' | 'Men';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('Women');
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [shopName, setShopName] = useState<string>('');
  
  const { cart, setIsCartOpen, setIsSearchOpen, setViewedProduct, viewedProduct, currentView, setCurrentView, connectionStatus, shopifyProducts, wishlist, setIsWishlistOpen, setCollectionMeta, user, setIsAuthModalOpen } = useAppContext();

  useEffect(() => {
    if (connectionStatus === 'connected') {
      import('../lib/shopify').then(m => m.getShop()).then(s => {
        if (s) setShopName(s.name);
      });
    }
  }, [connectionStatus]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparentView = currentView === 'home' && viewedProduct === null;
  const headerBgClass = isTransparentView 
    ? `bg-transparent text-black ${isScrolled ? 'border-b border-black/5' : ''}`
    : 'bg-white text-black border-b border-gray-100 shadow-sm';

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] font-sans transition-all duration-300 ${headerBgClass}`}>
      {/* Announcement Bar */}
      <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
        <div className="bg-black text-white text-[9px] sm:text-[10px] py-2 flex leading-tight relative overflow-hidden font-medium">
          <div className="flex whitespace-nowrap uppercase tracking-[0.2em] animate-marquee w-max text-white/90">
            <div className="flex gap-8 items-center px-4">
              <span>RS 100 OFF ON PREPAID ORDERS</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>FREE SHIPPING</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>RS 100 OFF ON PREPAID ORDERS</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>FREE SHIPPING</span>
              <span className="text-[6px] opacity-50">✦</span>
            </div>
            <div className="flex gap-8 items-center px-4" aria-hidden="true">
              <span>RS 100 OFF ON PREPAID ORDERS</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>FREE SHIPPING</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>RS 100 OFF ON PREPAID ORDERS</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>FREE SHIPPING</span>
              <span className="text-[6px] opacity-50">✦</span>
            </div>
            <div className="flex gap-8 items-center px-4" aria-hidden="true">
              <span>RS 100 OFF ON PREPAID ORDERS</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>FREE SHIPPING</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>RS 100 OFF ON PREPAID ORDERS</span>
              <span className="text-[6px] opacity-50">✦</span>
              <span>FREE SHIPPING</span>
              <span className="text-[6px] opacity-50">✦</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto h-16 sm:h-20 px-6 md:px-12 flex items-center justify-between relative">
        {/* Left Side: Navigation */}
        <div className="flex items-center gap-8 flex-1">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1 text-current cursor-pointer"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          <nav 
            className="hidden md:flex items-center gap-10 text-[11px] font-bold tracking-widest h-full"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button 
              onMouseEnter={() => setHoveredCategory('Women')}
              onClick={() => {
                setViewedProduct(null);
                setCurrentView('women-wear');
              }}
              className="flex items-center gap-1.5 hover:opacity-60 transition cursor-pointer uppercase h-full"
            >
              WOMEN
            </button>
            <button 
              onMouseEnter={() => setHoveredCategory('Men')}
              onClick={() => {
                setViewedProduct(null);
                setCurrentView('men-wear');
              }}
              className="flex items-center gap-1.5 hover:opacity-60 transition cursor-pointer uppercase h-full"
            >
              MEN
            </button>
          </nav>
        </div>

        {/* Center Logo */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setViewedProduct(null);
              setCurrentView('home');
            }}
          >
            {/* Typography */}
            <div className="flex flex-col leading-none">
              <span className="text-2xl md:text-3xl font-black tracking-[-0.05em] uppercase italic leading-none">SHADOW</span>
            </div>
          </div>
        </div>

        {/* Right Actions & Search */}
        <div className="flex items-center gap-1 sm:gap-3.5 justify-end flex-1">
          <button onClick={() => setIsSearchOpen(true)} className="p-2.5 cursor-pointer hover:opacity-60 transition" aria-label="Search">
            <Search size={22} strokeWidth={1.5} />
          </button>
          <button 
            className="hidden sm:block p-2.5 cursor-pointer hover:opacity-60 transition" 
            aria-label="Account"
            onClick={() => {
              if (user) {
                setCurrentView('account' as any);
                setViewedProduct(null);
              } else {
                setIsAuthModalOpen(true);
              }
            }}
          >
            <User size={22} strokeWidth={1.5} />
          </button>
          <button 
            className="hidden sm:block p-2.5 cursor-pointer hover:opacity-60 transition relative" 
            aria-label="Wishlist"
            onClick={() => setIsWishlistOpen(true)}
          >
            <Heart size={22} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className={`absolute top-1 right-1 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black ${!isTransparentView ? 'bg-[#df3333] text-white' : 'bg-[#df3333] text-white'} shadow-sm`}>
                {wishlist.length}
              </span>
            )}
          </button>
          <div className="relative p-2.5 cursor-pointer hover:opacity-60 transition" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className={`absolute top-1 right-1 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black ${(isTransparentView) ? 'bg-black text-white' : 'bg-black text-white'} shadow-sm`}>
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
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 bottom-0 w-full bg-white text-black shadow-2xl flex flex-col"
            >
              {/* Mobile Menu Top Bar */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={28} />
                </button>
                <div 
                  className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase cursor-pointer"
                  onClick={() => {
                    if (user) {
                      setCurrentView('account' as any);
                      setIsMobileMenuOpen(false);
                    } else {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <User size={18} strokeWidth={2} />
                  {user ? 'ACCOUNT' : 'LOGIN'}
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Store size={26} strokeWidth={1.5} />
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex border-b border-gray-100">
                {(['Women', 'Men'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 py-5 text-[13px] font-bold tracking-wider relative transition-colors ${activeCategory === cat ? 'text-black' : 'text-gray-400'}`}
                  >
                    {cat}
                    {activeCategory === cat && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-1.5 bg-black"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex flex-col">
                  {activeCategory === 'Women' && (
                    <>
                      <button 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setCurrentView('women-wear');
                        }}
                        className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] text-left hover:text-black transition-colors"
                      >
                        WOMENS NEW ARRIVALS
                      </button>
                      <hr className="border-gray-50" />
                      <button className="px-6 py-5 flex items-center justify-between text-[13px] font-bold text-gray-800 uppercase tracking-wider text-left border-b border-gray-50">
                        COLLECTION
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                      <button className="px-6 py-5 flex items-center justify-between text-[13px] font-bold text-gray-800 uppercase tracking-wider text-left border-b border-gray-50">
                        COLLABORATIONS
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                      {['OVERSIZED T-SHIRTS', 'BOTTOMS', 'JOGGERS', 'TOPS', 'HOODIES', 'SWEATSHIRTS'].map((item) => (
                        <button 
                          key={item}
                          onClick={() => {
                            setCollectionMeta({
                              title: item,
                              category: item,
                              gender: 'women'
                            });
                            setIsMobileMenuOpen(false);
                            setCurrentView('collection');
                          }}
                          className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-wider text-left border-b border-gray-50 active:bg-gray-50"
                        >
                          {item}
                        </button>
                      ))}
                    </>
                  )}

                  {activeCategory === 'Men' && (
                    <>
                      <button 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setCurrentView('men-wear');
                        }}
                        className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] text-left hover:text-black transition-colors"
                      >
                        MENS NEW ARRIVALS
                      </button>
                      <hr className="border-gray-50" />
                      <button className="px-6 py-5 flex items-center justify-between text-[13px] font-bold text-gray-800 uppercase tracking-wider text-left border-b border-gray-50">
                        COLLECTION
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                      <button className="px-6 py-5 flex items-center justify-between text-[13px] font-bold text-gray-800 uppercase tracking-wider text-left border-b border-gray-50">
                        COLLABORATIONS
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                      {['OVERSIZED T-SHIRTS', 'BOTTOMS', 'TANKS', 'CARGOS', 'JOGGERS', 'GYM WEAR', 'SHORTS', 'HOODIES', 'SWEATSHIRTS', 'JACKETS'].map((item) => (
                        <button 
                          key={item}
                          onClick={() => {
                            setCollectionMeta({
                              title: item,
                              category: item,
                              gender: 'men'
                            });
                            setIsMobileMenuOpen(false);
                            setCurrentView('collection');
                          }}
                          className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-wider text-left border-b border-gray-50 active:bg-gray-50"
                        >
                          {item}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              {/* Bottom Support Section */}
              <div className="p-6 border-t border-gray-100 flex flex-wrap gap-x-8 gap-y-4">
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">About</button>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Shipping</button>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Returns</button>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">FAQ</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Mega Menu */}
      <AnimatePresence>
        {hoveredCategory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block absolute top-[100%] left-0 w-full bg-white border-t border-gray-100 shadow-2xl overflow-hidden"
            onMouseEnter={() => setHoveredCategory(hoveredCategory)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="w-full flex border-t border-gray-100">
              {/* Left Side: Navigation Links */}
              <div className="w-[300px] lg:w-[450px] px-12 py-16 bg-white shrink-0">
                <button 
                  onClick={() => {
                    setCurrentView(hoveredCategory === 'Women' ? 'women-wear' : 'men-wear');
                    setHoveredCategory(null);
                  }}
                  className="text-[12px] font-black text-black mb-10 block hover:opacity-50 transition uppercase tracking-[0.2em] border-b border-black pb-2 inline-block leading-none"
                >
                  {hoveredCategory === 'Women' ? 'WOMENS' : 'MENS'} NEW ARRIVALS
                </button>
                <div className="flex flex-col gap-6">
                  {(hoveredCategory === 'Women' 
                    ? ['OVERSIZED T-SHIRTS', 'BOTTOMS', 'JOGGERS', 'TOPS', 'HOODIES', 'SWEATSHIRTS']
                    : ['OVERSIZED T-SHIRTS', 'BOTTOMS', 'TANKS', 'CARGOS', 'JOGGERS', 'GYM WEAR', 'SHORTS', 'HOODIES', 'SWEATSHIRTS', 'JACKETS']
                  ).map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCollectionMeta({ title: cat, category: cat, gender: hoveredCategory.toLowerCase() as any });
                        setCurrentView('collection');
                        setHoveredCategory(null);
                      }}
                      className="text-[11px] font-bold text-gray-500 hover:text-black text-left transition uppercase tracking-[0.1em]"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
