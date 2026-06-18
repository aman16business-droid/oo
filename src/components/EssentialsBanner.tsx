import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Eye, Upload } from 'lucide-react';
import { useAppContext } from '../AppContext';

const INITIAL_UGC_DATA = [
  {
    id: 1,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-a-street-wear-outfit-34533-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    productId: 1,
    productThumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop",
    username: "@styledbyjulia"
  },
  {
    id: 2,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-walking-wearing-a-red-stretchy-beanie-and-white-t-shirt-34535-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop",
    productId: 2,
    productThumb: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=200&auto=format&fit=crop",
    username: "@marcus_vibe"
  },
  {
    id: 3,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-with-a-yellow-jacket-walking-in-the-city-34531-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    productId: 3,
    productThumb: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=200&auto=format&fit=crop",
    username: "@urban_explorer"
  },
  {
    id: 4,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-shot-of-a-woman-in-a-red-beret-34529-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1539109132354-d2984cd16327?q=80&w=1000&auto=format&fit=crop",
    productId: 4,
    productThumb: "https://images.unsplash.com/photo-1539109132354-d2984cd16327?q=80&w=200&auto=format&fit=crop",
    username: "@chloe_clout"
  },
  {
    id: 5,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-sunglasses-34527-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop",
    productId: 5,
    productThumb: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=200&auto=format&fit=crop",
    username: "@alex_street"
  }
];

export default function EssentialsBanner() {
  const { setViewedProduct, shopifyProducts, siteSettings, uploadUgcVideo } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  
  // Merge global video URLs into UGC data
  const ugcData = useMemo(() => {
    return INITIAL_UGC_DATA.map((item, index) => ({
      ...item,
      videoUrl: siteSettings.ugcVideos[index] || item.videoUrl
    }));
  }, [siteSettings.ugcVideos]);

  const handleView = (productId: number) => {
    const product = shopifyProducts.find(p => p.id === productId);
    if (product) {
      setViewedProduct(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const index = ugcData.findIndex(item => item.id === id);
        if (index !== -1) {
          await uploadUgcVideo(index, file);
        }
      } catch (err) {
        console.error("Failed to upload video", err);
      }
    }
  };

  // Auto-swipe for mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ugcData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [ugcData.length]);

  // Helper for mobile swiping
  const getMobileItems = () => {
    const items = [];
    for (let i = 0; i < 2; i++) {
        items.push(ugcData[(currentIndex + i) % ugcData.length]);
    }
    return items;
  };

  return (
    <section className="relative w-full py-4 md:py-6 bg-white overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6">
        
        {/* Mobile View - 2 item Carousel with Auto-swipe */}
        <div className="md:hidden relative h-[380px]">
           <AnimatePresence mode="popLayout" initial={false}>
              <div className="flex gap-3 h-full">
                 {getMobileItems().map((item, idx) => (
                   <motion.div 
                     key={`${item.id}-${currentIndex}-${idx}`}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.6, ease: "circOut" }}
                     className="flex-1 aspect-[9/16] relative rounded-[20px] overflow-hidden bg-gray-100 group"
                   >
                      <video 
                         src={item.videoUrl} 
                         loop muted autoPlay playsInline 
                         className="absolute inset-0 w-full h-full object-cover grayscale" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Upload Button */}
                      {!item.videoUrl.startsWith('blob:') && (
                        <div className="absolute top-3 left-3 z-50">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               fileInputRefs.current[item.id]?.click();
                             }}
                             className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-2xl border border-white/20"
                           >
                              <Upload size={14} />
                           </button>
                           <input 
                             type="file" 
                             ref={el => fileInputRefs.current[item.id] = el}
                             onChange={(e) => handleUpload(e, item.id)}
                             onClick={(e) => e.stopPropagation()}
                             className="hidden"
                             accept="video/*"
                           />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-3">
                         <div className="bg-white/95 backdrop-blur-md p-2 rounded-[18px] flex items-center justify-between shadow-2xl">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-8 h-8 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                 <img src={item.productThumb} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="overflow-hidden">
                                 <p className="text-[7px] font-black uppercase text-black leading-tight">Shop</p>
                                 <p className="text-[9px] font-bold text-gray-400 truncate italic">Look</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleView(item.productId)}
                              className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center"
                            >
                               <Eye size={12} strokeWidth={2.5} />
                            </button>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </AnimatePresence>
        </div>

        {/* Desktop View - Static Grid */}
        <div className="hidden md:grid grid-cols-5 gap-5">
           {ugcData.map((item, index) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="aspect-[9/16] relative group rounded-[32px] overflow-hidden bg-gray-100"
             >
                <video 
                   src={item.videoUrl} 
                   loop muted autoPlay playsInline 
                   className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Upload Button */}
                {!item.videoUrl.startsWith('blob:') && (
                  <div className="absolute top-4 left-4 z-50 transition-all">
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRefs.current[item.id]?.click();
                        }}
                        className="bg-black text-white p-2.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-[9px] font-black tracking-widest uppercase border border-white/20"
                     >
                       <Upload size={14} />
                       <span>Upload Video</span>
                     </button>
                     <input 
                        type="file" 
                        ref={el => fileInputRefs.current[item.id] = el}
                        onChange={(e) => handleUpload(e, item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="hidden"
                        accept="video/*"
                     />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-4">
                   <div className="bg-white/95 backdrop-blur-md p-2 rounded-[18px] flex items-center justify-between shadow-2xl transition-all duration-500">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                           <img src={item.productThumb} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[8px] font-black uppercase text-black leading-tight mb-0.5">Shop</p>
                           <p className="text-[10px] font-bold text-gray-400 truncate italic">The look</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleView(item.productId)}
                        className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center hover:bg-[#df3333] transition-colors shadow-lg shadow-black/10"
                      >
                         <Eye size={14} strokeWidth={2.5} />
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
