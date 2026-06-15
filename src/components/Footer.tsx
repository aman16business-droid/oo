import { Facebook, Twitter, Instagram, Youtube, Eclipse, RefreshCw } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function Footer() {
  const { shopifyProducts, refreshProducts, isLoading } = useAppContext();
  return (
    <footer className="bg-[#111111] text-white py-20 px-8 text-sm pt-24 font-sans tracking-wide">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-8">
        
        {/* Column 1: Logo & Socials */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-10 group cursor-pointer">
            <Eclipse size={32} className="text-white group-hover:rotate-180 transition-transform duration-700" strokeWidth={2.5} />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-[-0.05em] uppercase italic">SHADOW</span>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Facebook size={14} fill="currentColor" /></a>
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Twitter size={14} fill="currentColor" /></a>
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Instagram size={14} /></a>
            <a href="#" className="hover:text-gray-400 transition bg-white text-black p-1.5 rounded-full"><Youtube size={14} fill="currentColor" /></a>
          </div>
          
          {/* Shopify Live Audit Feed */}
          <div className="mt-14 pt-8 border-t border-white/5 max-w-[200px]">
             <div className="flex items-center justify-between gap-2 mb-4">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-gray-400 gap-2 uppercase tracking-widest flex items-center">
                   {shopifyProducts.length > 0 ? (
                     <span className="text-green-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> LIVE SCAN: OK</span>
                   ) : (
                     <span className="text-amber-500 animate-pulse">SCANNING CATALOG...</span>
                   )}
                 </span>
               </div>
               <button 
                 onClick={() => refreshProducts()} 
                 disabled={isLoading}
                 className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30 flex items-center gap-1"
                 title="Force Resync"
               >
                 <RefreshCw size={10} className={isLoading ? 'animate-spin' : ''} />
               </button>
             </div>
           <div className="text-[9px] text-gray-600 mb-4 font-mono leading-tight">
               Store: {import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'Missing Domain'}<br/>
               Items: {shopifyProducts.length}<br/>
               {shopifyProducts.length === 0 && !isLoading && (
                 <span className="text-red-500 font-bold block mt-1">CATALOG EMPTY</span>
               )}
               {shopifyProducts.length === 0 && !isLoading && (
               <div className="text-[7.5px] text-gray-500 block mt-2 leading-[1.4]">
                    <span className="text-white font-bold">FIX:</span> Go to Settings. <br/>
                    1. Use Domain: <span className="text-amber-400">shadowshopp.myshopify.com</span><br/>
                    2. Use <span className="text-amber-400">Public access token</span> from "Storefront API" tab.<br/>
                    3. Do <span className="text-red-400 italic">NOT</span> use the "Client ID".
                </div>
               )}
           </div>
             <ul className="space-y-2">
               {shopifyProducts.slice(0, 6).map(p => (
                 <li key={p.id} className="text-[10px] text-gray-500 font-medium truncate border-l border-white/10 pl-3 leading-none py-1 group/item">
                   <span className="group-hover/item:text-white transition-colors">{p.title}</span>
                 </li>
               ))}
               {shopifyProducts.length === 0 && (
                 <li className="text-[10px] text-amber-500 font-bold italic tracking-tight">API returned 0 products...</li>
               )}
             </ul>
          </div>
        </div>

        {/* Column 2: SHOP */}
        <div className="col-span-1">
          <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">SHOP</h4>
          <ul className="space-y-4 text-gray-300">
            <li><a href="#" className="hover:text-white transition">BEST SELLERS</a></li>
            <li><a href="#" className="hover:text-white transition">Special Prices</a></li>
            <li><a href="#" className="hover:text-white transition uppercase">NEW ARRIVALS</a></li>
            <li><a href="#" className="hover:text-white transition">Signature</a></li>
          </ul>
        </div>

        {/* Column 3: TRENDING */}
        <div className="col-span-1">
          <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">TRENDING</h4>
          <ul className="space-y-4 text-gray-300">
            <li><a href="#" className="hover:text-white transition">ACOSTA Collection</a></li>
            <li><a href="#" className="hover:text-white transition">Anime Collection</a></li>
            <li><a href="#" className="hover:text-white transition">Oversized T-shirt</a></li>
            <li><a href="#" className="hover:text-white transition">Oversized Shirt</a></li>
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
            <h4 className="text-white font-bold tracking-widest text-xs uppercase mb-6">Explore</h4>
            <ul className="space-y-4 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Search</a></li>
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
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
                <ChevronRightIcon />
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

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
  );
}
