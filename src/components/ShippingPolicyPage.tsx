export default function ShippingPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-[90px] md:pt-[100px] text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 uppercase">Shipping Policy</h1>
        
        <div className="space-y-12 text-sm leading-relaxed text-gray-700">
          <section>
            <p>We are delighted to bring Shadow directly to your doorstep. Here are the details regarding our shipping practices to ensure a smooth delivery experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Coverage & Timelines</h2>
            <p>We ship products across India. Orders are usually processed and dispatched within <strong>1-2 business days</strong>.</p>
            <p className="mt-4">Once dispatched, orders are usually delivered within <strong>4–7 business days</strong>, depending on your location and logistics availability.</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Metro Cities: Typically delivered within 4-5 business days.</li>
              <li>Other Cities: Typically delivered within 5-7 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Delivery Charges</h2>
            <p>We offer <strong>FREE shipping</strong> on all prepaid orders across India to make your shopping experience more seamless. Keep an eye out for special free shipping promotions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Order Tracking</h2>
            <p>Once your order has been dispatched from our warehouse, you will receive a tracking link via email or SMS. You can use this link to check the real-time location and status of your package.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
