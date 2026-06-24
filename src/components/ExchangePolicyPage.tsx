export default function ExchangePolicyPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-[90px] md:pt-[100px] text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 uppercase">Exchange Policy</h1>
        
        <div className="space-y-12 text-sm leading-relaxed text-gray-700">
          <section>
            <p className="mb-4">While we do not offer returns on purchases, we want to ensure you get the perfect fit.</p>
            <p className="mb-4">If you face any issue with your order (such as sizing), we allow <strong>product exchange requests within 24 hours after delivery</strong>.</p>
            
            <h3 className="text-lg font-bold text-gray-900 tracking-wide mb-3 mt-6">How to request an exchange:</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Contact our support team within <strong>24 hours</strong> of receiving the order.</li>
              <li>Share clear product photos for verification (Front side, Back side, and Package photo).</li>
              <li>Your exchange request will be approved after our team reviews and verifies the issue.</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 tracking-wide mb-3">Important Exchange Rules:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Exchanges must be initiated strictly within 24 hours. After 24 hours, the window closes and requests will be automatically rejected.</li>
              <li>Size exchange is limited to <strong>one time only</strong> per order.</li>
              <li>If the newly requested size is out of stock, you will be given the option to pick another product or receive store credit. We do not have a waiting list.</li>
              <li>The item must be unused, unwashed, and have all original tags attached.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
