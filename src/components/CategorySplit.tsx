import { useAppContext } from '../AppContext';

export default function CategorySplit() {
  const { setCurrentView } = useAppContext();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Mens */}
      <div 
        className="relative h-[85vh] md:h-[100vh] group overflow-hidden cursor-pointer"
        onClick={() => setCurrentView('men-wear')}
      >
        <img 
          src="https://images.unsplash.com/photo-1507680434267-325ea75ce866?q=80&w=1200&auto=format&fit=crop" 
          alt="Shop Mens" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out brightness-[0.85]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-12">
          <h2 className="text-white text-3xl md:text-[2.5rem] font-black mb-6 tracking-tight drop-shadow-md leading-none">SHOP MENS</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('men-wear');
            }}
            className="text-white border border-white/80 px-6 sm:px-8 py-2 md:py-2.5 rounded-full uppercase text-[12px] sm:text-sm font-bold w-max hover:bg-white hover:text-black transition-colors duration-300"
          >
            Explore
          </button>
        </div>
      </div>
      
      {/* Womens */}
      <div 
        className="relative h-[85vh] md:h-[100vh] group overflow-hidden cursor-pointer"
        onClick={() => setCurrentView('women-wear')}
      >
        <img 
          src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1200&auto=format&fit=crop" 
          alt="Shop Womens" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out brightness-[0.85]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-12">
          <h2 className="text-white text-3xl md:text-[2.5rem] font-black mb-6 tracking-tight drop-shadow-md leading-none">SHOP WOMENS</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('women-wear');
            }}
            className="text-white border border-white/80 px-6 sm:px-8 py-2 md:py-2.5 rounded-full uppercase text-[12px] sm:text-sm font-bold w-max hover:bg-white hover:text-black transition-colors duration-300"
          >
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}
