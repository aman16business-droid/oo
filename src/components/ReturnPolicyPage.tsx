export default function ReturnPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-[90px] md:pt-[100px] text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 uppercase">Return & Refund Policy</h1>
        
        <div className="space-y-12 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Return Policy</h2>
            <p className="mb-4 font-semibold text-red-600">Please note: We do not accept regular product returns.</p>
            <p>Our commitment is to deliver quality garments as described. As such, all standard purchases are final, and we do not accommodate returns for size issues, change of mind, personal preference, or any other reason.</p>
            <p className="mt-4">However, if you face any issue with your order sizing or fit, please refer to our Exchange Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Refund Policy</h2>
            <p className="mb-4">We offer refunds exclusively to ensure a smooth shopping experience for customers who receive defective items.</p>
            <p className="mb-4">If you receive a <strong>damaged product</strong>, you are eligible to request a full refund.</p>
            <p className="mb-2">To process a refund request:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Contact our support team within <strong>24 hours of delivery</strong>.</li>
              <li>Share clear photos of the damaged product.</li>
              <li>Our team will review and verify the issue.</li>
              <li>Once approved, the refund will be processed to your original payment method.</li>
            </ul>
            <p className="mb-4 font-semibold">Please note that refunds are only applicable if the delivered product is proven to be damaged or defective upon arrival.</p>
            <p>Refunds are <strong>not applicable for size issues, change of mind, personal preference, or any other reason apart from receiving a damaged product.</strong></p>
          </section>
        </div>
      </div>
    </div>
  );
}
