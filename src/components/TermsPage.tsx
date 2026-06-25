import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-[90px] md:pt-[100px] text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 uppercase">Terms & Conditions</h1>
        
        <div className="space-y-12 text-sm leading-relaxed text-gray-700">
          <section>
            <p>Welcome to our store. By accessing our website and placing an order, you agree to the following terms and conditions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Terms of Use</h2>
            <p className="mb-4">By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
            <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Orders</h2>
            <p>All orders placed on our website are subject to confirmation and product availability. We reserve the right to cancel any order if required, in which case a full refund will be initiated if payment was pre-made.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Product Descriptions and Pricing</h2>
            <p className="mb-4">We attempt to be as accurate as possible in our product descriptions, pricing, and availability. However, we do not warrant that product descriptions or other content is completely accurate, complete, reliable, current, or error-free.</p>
            <p>Prices for our products are subject to change without notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Policy Updates</h2>
            <p>We reserve the right to update or modify these policies at any time without prior notice. It is your responsibility to check our website periodically for changes.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

