import React, { useEffect } from "react";

const ReturnPolicy = () => {
  // Scroll to top whenever this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-4xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-8 text-center">
          Return Policy
        </h1>

        {/* Intro */}
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          At <span className="font-semibold text-purple-600">Nexebay</span>, your satisfaction is our priority. 
          If you are not completely happy with your purchase, we offer a hassle-free return process within 7 days of delivery.
        </p>

        {/* Conditions for Returns */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            Conditions for Returns
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Products must be unused and in their original packaging.</li>
            <li>Include all tags, manuals, and accessories.</li>
            <li>Proof of purchase (invoice) must be provided.</li>
            <li>Products damaged due to misuse are not eligible for return.</li>
          </ul>
        </div>

        {/* Refund Process */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            Refund Process
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Once we receive your returned product and verify its condition, 
            a refund will be processed within 5-7 business days to your original payment method. 
            You will receive an email notification once your refund is initiated.
          </p>
        </div>

        {/* Exchange Policy */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            Exchange Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you wish to exchange an item, please contact our support team. 
            Exchanges are subject to product availability and must meet the return conditions mentioned above.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600">
            For any questions regarding returns or exchanges, contact us at 
            <span className="text-purple-600 font-semibold"> support@nexebay.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
