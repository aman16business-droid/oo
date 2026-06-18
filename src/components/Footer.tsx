import { Facebook, Twitter, Instagram, Youtube, Eclipse, ChevronRight } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function Footer() {
  const { setViewedProduct, setCurrentView, setIsSearchOpen, setCollectionMeta } = useAppContext();
  
  return (
    <footer className="bg-[#111111] text-white py-12 px-8 text-sm pt-12 font-sans tracking-wide">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-8">
        
        {/* Column 1: Logo & Socials */}
        <div className="col-span-1">
          <div 
            className="flex items-center gap-2 mb-10 group cursor-pointer"
            onClick={() => { setCurrentView('home'); window.scrollTo(0, 0); }}
          >
            <div className="flex flex-col leading-none">
              <span className="text-3xl font-black tracking-[-0.05em] uppercase italic">SHADOW</span>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Facebook size={14} fill="currentColor" /></a>
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Twitter size={14} fill="currentColor" /></a>
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Instagram size={14} /></a>
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Youtube size={14} fill="currentColor" /></a>
          </div>
        </div>

        {/* Column 2: WOMEN */}
        <div className="col-span-1">
          <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">WOMEN</h4>
          <ul className="space-y-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {['OVERSIZED T-SHIRTS', 'BOTTOMS', 'JOGGERS', 'TOPS', 'HOODIES', 'SWEATSHIRTS'].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => {
                    setCollectionMeta({ title: item, category: item, gender: 'women' });
                    setCurrentView('collection');
                    window.scrollTo(0, 0);
                  }} 
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: MEN */}
        <div className="col-span-1">
          <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">MEN</h4>
          <ul className="space-y-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {['OVERSIZED T-SHIRTS', 'BOTTOMS', 'TANKS', 'CARGOS', 'JOGGERS', 'GYM WEAR', 'SHORTS', 'HOODIES', 'SWEATSHIRTS', 'JACKETS'].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => {
                    setCollectionMeta({ title: item, category: item, gender: 'men' });
                    setCurrentView('collection');
                    window.scrollTo(0, 0);
                  }} 
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: INFO */}
        <div className="col-span-1">
          <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">INFO</h4>
          <ul className="space-y-4 text-gray-300">
            <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white transition">FAQs</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Returns Policy</a></li>
          </ul>
        </div>

        {/* Column 5: Explore & Newsletter */}
        <div className="col-span-1 flex flex-col gap-12">
          <div>
            <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">EXPLORE</h4>
            <ul className="space-y-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <li><button onClick={() => { setCurrentView('new-arrivals'); window.scrollTo(0, 0); }} className="hover:text-white transition cursor-pointer">NEW ARRIVALS</button></li>
              <li><button onClick={() => { setCurrentView('best-sellers'); window.scrollTo(0, 0); }} className="hover:text-white transition cursor-pointer">BEST SELLERS</button></li>
              <li><button onClick={() => { setCurrentView('premium'); window.scrollTo(0, 0); }} className="hover:text-white transition cursor-pointer">PREMIUM</button></li>
              <li><button onClick={() => { setCurrentView('shop-all'); window.scrollTo(0, 0); }} className="hover:text-white transition cursor-pointer">SHOP ALL</button></li>
              <li><button onClick={() => { setIsSearchOpen(true); }} className="hover:text-white transition cursor-pointer">SEARCH</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">WE'VE GOT YOU COVERED:</h4>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              Be the first to know about new arrivals & exclusive drops.
            </p>
            <div className="relative border border-gray-600 rounded">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-transparent p-3 pr-10 outline-none text-white text-sm placeholder:text-gray-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-[1600px] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-500">
        <div className="flex items-center gap-2 text-center md:text-left">
            <span>© 2024 SHADOW STORE GLOBAL PVT. LTD.</span>
            <span className="hidden md:inline opacity-30">|</span>
            <span>All Rights Reserved</span>
        </div>
        <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition uppercase">Returns</a>
        </div>
      </div>
    </footer>
  );
}
