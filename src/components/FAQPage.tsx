export default function FAQPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-[90px] md:pt-[100px] text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 uppercase text-red-600">Refund Related FAQ</h1>
        
        <div className="space-y-10 text-sm leading-relaxed text-gray-700 mb-16">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Do you offer refunds?</h2>
            <p className="mb-4">Yes, we offer refunds if the product delivered to you is <strong>damaged</strong>.</p>
            <p className="mb-4">To claim a refund, please contact our support team within <strong>24 hours of delivery</strong> and share product photos for verification.</p>
            <p>Please note that refunds are <strong>not applicable for size issues, change of mind, or any other reason apart from damaged products.</strong></p>
          </section>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 uppercase mt-16">Frequently Asked Questions (FAQs)</h1>
        
        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Do you accept returns?</h2>
            <p>No. We do not accept returns.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Can I exchange my product?</h2>
            <p>Yes. Exchange requests are accepted within <strong>24 hours after delivery</strong>, subject to approval.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Do you offer refunds?</h2>
            <p className="mb-4">Refunds are <strong>only provided if the delivered product is damaged</strong> and verified by our support team.</p>
            <p>Refunds are <strong>not provided for size issues, change of mind, or personal preference.</strong></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Is Cash on Delivery available?</h2>
            <p>We offer <strong>Partial Payment COD only</strong>. Full COD is not available.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">How long does delivery take?</h2>
            <p>Orders usually arrive within <strong>4–7 business days</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">How can I contact support?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>WhatsApp</li>
              <li>Instagram</li>
              <li>Email</li>
              <li>Phone Support</li>
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
