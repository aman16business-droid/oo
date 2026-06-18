import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function Hero() {
  const { setCurrentView, siteSettings, uploadSiteAsset, isLocked } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadSiteAsset('heroBanner', file);
      } catch (err) {
        console.error("Failed to upload hero banner", err);
      }
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden group">
      <img 
        src={siteSettings.heroBanner} 
        alt="Summer Society Collection" 
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover object-[center_30%]" 
      />
      
      {/* Upload Button Overlay - Fixed at bottom right */}
      <div className="absolute bottom-10 right-10 z-50 transition-all">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="group/btn relative bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 text-[11px] font-black tracking-widest uppercase border-2 border-white/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          <Upload size={18} className="relative z-10" />
          <span className="relative z-10">Upload Hero Banner</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          onClick={(e) => e.stopPropagation()}
          className="hidden" 
          accept="image/*"
        />
      </div>
      
      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-end pb-20 sm:pb-32 px-6">
        <h3 className="text-white uppercase tracking-[0.2em] text-[9px] sm:text-[11px] font-semibold mb-3 drop-shadow-md text-center opacity-80">
          new arrivals
        </h3>
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.15em] mb-8 drop-shadow-lg text-center uppercase italic">
          SUMMER SOCIETY
        </h1>
        <button 
          onClick={() => setCurrentView('new-arrivals')}
          className="bg-white text-black px-10 py-3.5 rounded-sm font-bold text-[10px] transition-all shadow-xl hover:-translate-y-0.5 tracking-[0.25em] uppercase italic"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
