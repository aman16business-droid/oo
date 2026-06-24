import React from 'react';
import { useAppContext } from '../AppContext';

export default function Hero() {
  const { setCurrentView, siteSettings } = useAppContext();

  return (
    <section className="relative w-full h-[100dvh] md:h-screen overflow-hidden group">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-900">
        {siteSettings.heroBanner && !siteSettings.heroBanner.includes('new_hero_banner') && (
          <img 
            src={siteSettings.heroBanner} 
            alt="Summer Society Collection" 
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover" 
            style={{ objectPosition: 'center' }}
          />
        )}
      </div>
      
      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-end pb-20 sm:pb-32 px-6 pointer-events-none">
        <h3 className="text-white uppercase tracking-[0.2em] text-[9px] sm:text-[11px] font-semibold mb-3 drop-shadow-md text-center opacity-80">
          new arrivals
        </h3>
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.15em] mb-8 drop-shadow-lg text-center uppercase italic">
          SUMMER SOCIETY
        </h1>
        <button 
          onClick={() => setCurrentView('new-arrivals')}
          className="bg-white text-black px-10 py-3.5 rounded-sm font-bold text-[10px] transition-all shadow-xl hover:-translate-y-0.5 tracking-[0.25em] uppercase italic pointer-events-auto"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
