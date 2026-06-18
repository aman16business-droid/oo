import { Truck, Package, ShieldCheck, Shirt } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Truck size={32} strokeWidth={1.5} />,
      title: "SHIPPING WITHIN 48 HOURS",
      desc: "Your order will be shipped within 48 hours from the time since order is placed!",
      customIcon: (
        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><text x="14" y="12" className="text-[8px] font-bold" strokeWidth="0.5">48h</text>
        </svg>
      )
    },
    {
      icon: <Package size={32} strokeWidth={1.5} />,
      title: "5% OFF",
      desc: "5% OFF on Pre-paid orders.",
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: "MADE IN INDIA",
      desc: "Our products are 100% made in India. From raw fabric to the final product!",
    },
    {
      icon: <Shirt size={32} strokeWidth={1.5} />,
      title: "LUXURY FASHION MADE ACCESSIBLE",
      desc: "High-quality clothing at affordable prices",
    }
  ];

  return (
    <div className="bg-white border-t border-b border-gray-200 py-4 px-6 mt-2">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-[1.5px] border-gray-200 flex flex-col items-center justify-center mb-6 text-black">
              {feature.customIcon || feature.icon}
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-4 uppercase text-black">{feature.title}</h3>
            <p className="text-[#1a1a1a] text-sm leading-relaxed max-w-[280px]">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
