import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-[90px] md:pt-[100px] text-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 uppercase">Privacy Policy</h1>
        
        <div className="space-y-12 text-sm leading-relaxed text-gray-700">
          <section>
            <p>We value your privacy and are committed to protecting your personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Information We Collect</h2>
            <p className="mb-2">When you place an order, we may collect:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Email Address</li>
              <li>Shipping Address</li>
              <li>Payment Information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">How We Use Your Information</h2>
            <p className="mb-2">We use customer information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and confirm orders</li>
              <li>Deliver products successfully</li>
              <li>Provide customer support</li>
              <li>Send order updates and notifications</li>
              <li>Improve customer experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Marketing Communication</h2>
            <p>We may use your email address or phone number to send promotional offers, discounts, updates, and important announcements related to our brand.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Data Protection</h2>
            <p>We take reasonable security measures to protect customer information and prevent unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Third-Party Services</h2>
            <p>We may use trusted third-party payment providers, shipping partners, and service providers to complete orders and improve our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Refund & Exchange Verification</h2>
            <p>For exchange or refund requests, customers may be required to share product photos for verification purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Customer Support</h2>
            <p className="mb-2">Customers can contact us through:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>WhatsApp</li>
              <li>Instagram</li>
              <li>Email</li>
              <li>Phone Support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Policy Changes</h2>
            <p>We may update this Privacy Policy from time to time without prior notice.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
