import { useAppContext } from '../AppContext';

export default function Hero() {
  const { setCurrentView } = useAppContext();

  return (
    <section className="relative w-full h-[85vh] md:h-screen overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1528991435120-e73e05a58897?q=80&w=2000&auto=format&fit=crop" 
        alt="Summer Society Collection" 
        className="w-full h-full object-cover object-[center_30%]" 
      />
      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-end pb-20 sm:pb-32 px-6">
        <h3 className="text-white uppercase tracking-[0.25em] text-[10px] sm:text-sm font-semibold mb-3 drop-shadow-md text-center">
          Summer's Hot, So Is Our Collection
        </h3>
        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 drop-shadow-lg text-center">
          SUMMER SOCIETY
        </h1>
        <button 
          onClick={() => setCurrentView('new-arrivals')}
          className="bg-gradient-to-b from-white to-gray-100 text-black px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-[12px] sm:text-sm transition-all shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 border border-white/80 ring-1 ring-black/5 tracking-widest relative overflow-hidden group"
        >
          <span className="relative z-10">SHOP NOW</span>
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </button>
      </div>
    </section>
  );
}
