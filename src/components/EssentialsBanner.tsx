export default function EssentialsBanner() {
  return (
    <section className="relative w-full h-[80vh]">
      <img 
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop" 
        alt="Everyday Essentials" 
        className="w-full h-full object-cover object-top" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col items-center justify-end pb-16 sm:pb-24 px-6">
        <h3 className="text-white uppercase tracking-[0.25em] text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 drop-shadow-md text-center">
          PREMIUM FABRICS, DESIGNED TO LAST
        </h3>
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-8 drop-shadow-md text-center">
          EVERYDAY ESSENTIALS
        </h1>
        <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition tracking-wider shadow-lg">
          SHOP NOW
        </button>
        <div className="flex gap-2.5 mt-10">
          <div className="w-2 h-2 rounded-full border border-white bg-transparent opacity-80 cursor-pointer"></div>
          <div className="w-2 h-2 rounded-full bg-white cursor-pointer shadow-sm"></div>
          <div className="w-2 h-2 rounded-full bg-white opacity-40 cursor-pointer"></div>
        </div>
      </div>
    </section>
  );
}
