import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function CategorySplit() {
  const { setCurrentView, siteSettings, uploadSiteAsset } = useAppContext();
  const menInputRef = useRef<HTMLInputElement>(null);
  const womenInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'menBanner' | 'womenBanner') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadSiteAsset(key, file);
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Mens */}
      <div 
        className="relative h-screen group overflow-hidden cursor-pointer"
        onClick={() => setCurrentView('men-wear')}
      >
        <img 
          src={siteSettings.menBanner} 
          alt="Shop Mens" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out brightness-[0.9]" 
        />
        
        {/* Upload Button Overlay */}
        {!siteSettings.menBanner?.startsWith('blob:') && (
          <div className="absolute bottom-40 left-10 z-50 transition-all">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                menInputRef.current?.click();
              }}
              className="bg-black text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-[9px] font-black tracking-widest uppercase border border-white/20"
            >
              <Upload size={14} />
              <span>Upload Men Banner</span>
            </button>
            <input 
              type="file" 
              ref={menInputRef} 
              onChange={(e) => handleUpload(e, 'menBanner')} 
              onClick={(e) => e.stopPropagation()}
              className="hidden" 
              accept="image/*"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12 pb-16">
          <h2 className="text-white text-xl md:text-2xl font-bold mb-5 tracking-widest leading-none drop-shadow-sm">SHOP MENS</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('men-wear');
            }}
            className="text-white border border-white/40 px-8 py-3 rounded-full uppercase text-[10px] font-bold w-max hover:bg-white hover:text-black transition-all duration-300 tracking-widest"
          >
            Explore
          </button>
        </div>
      </div>
      {/* Womens */}
      <div 
        className="relative h-screen group overflow-hidden cursor-pointer border-l border-white/5"
        onClick={() => setCurrentView('women-wear')}
      >
        <img 
          src={siteSettings.womenBanner} 
          alt="Shop Womens" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out brightness-[0.9]" 
        />

        {/* Upload Button Overlay */}
        {!siteSettings.womenBanner?.startsWith('blob:') && (
          <div className="absolute bottom-40 right-10 z-50 transition-all text-right">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                womenInputRef.current?.click();
              }}
              className="bg-black text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-[9px] font-black tracking-widest uppercase ml-auto border border-white/20"
            >
              <Upload size={14} />
              <span>Upload Women Banner</span>
            </button>
            <input 
              type="file" 
              ref={womenInputRef} 
              onChange={(e) => handleUpload(e, 'womenBanner')} 
              onClick={(e) => e.stopPropagation()}
              className="hidden" 
              accept="image/*"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12 pb-16">
          <h2 className="text-white text-xl md:text-2xl font-bold mb-5 tracking-widest leading-none drop-shadow-sm text-right">SHOP WOMENS</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('women-wear');
            }}
            className="text-white border border-white/40 px-8 py-3 rounded-full uppercase text-[10px] font-bold w-max hover:bg-white hover:text-black transition-all duration-300 tracking-widest ml-auto"
          >
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}
