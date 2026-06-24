export default function PaymentPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-[90px] md:pt-[100px] text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 uppercase">Payment Policy</h1>
        
        <div className="space-y-12 text-sm leading-relaxed text-gray-700">
          <section>
            <p>We provide secure and transparent payment options to our customers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Prepaid Orders</h2>
            <p className="mb-4">We accept all major secure online payment methods, including:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Credit and Debit Cards</li>
              <li>UPI (Unified Payments Interface)</li>
              <li>Net Banking</li>
              <li>Popular Mobile Wallets</li>
            </ul>
            <p>All prepaid transactions are processed securely through certified payment gateways to ensure your data remains protected.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Cash on Delivery (COD)</h2>
            <p className="mb-4">We do <strong>not</strong> offer full Cash on Delivery.</p>
            <p className="mb-4">We offer <strong>Partial Payment Cash on Delivery (COD)</strong> on selected orders. To combat fraudulent orders and ensure high fulfillment rates, customers may be required to pay a small advance amount (e.g. shipping or flat fee) while placing the order.</p>
            <p>The remaining balance will be collected by our shipping partner strictly in cash at the time of delivery.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
