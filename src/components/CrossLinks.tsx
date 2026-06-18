import { useAppContext } from '../AppContext';

export default function CrossLinks() {
  const { setCurrentView } = useAppContext();

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-20 border-t border-gray-100 mt-10">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-11px font-black text-gray-300 uppercase tracking-[0.2em] text-center mb-4 leading-none">
          EXPLORE MORE
        </h2>
        <h3 className="text-3xl font-black text-black uppercase tracking-tight text-center leading-none">
          OTHER COLLECTIONS
        </h3>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { name: 'NEW ARRIVALS', view: 'new-arrivals' },
          { name: 'BEST SELLERS', view: 'best-sellers' },
          { name: 'PREMIUM', view: 'premium' },
          { name: 'MEN', view: 'men-wear' },
          { name: 'WOMEN', view: 'women-wear' },
          { name: 'SHOP ALL', view: 'shop-all' }
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setCurrentView(item.view as any);
              window.scrollTo(0, 0);
            }}
            className="px-8 py-4 border border-black text-black font-bold uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all min-w-[200px]"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
