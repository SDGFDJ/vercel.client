import React, { useEffect } from "react";

const PrivacyPolicy = () => {
  // Scroll to top whenever this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-4xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-8 text-center">
          Privacy Policy
        </h1>

        {/* Intro */}
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          At <span className="font-semibold text-purple-600">Nexebay</span>, your privacy is our priority. 
          We collect and use your information solely to enhance your shopping experience and provide 
          better service.
        </p>

        {/* Information We Collect */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Name, email address, phone number.</li>
            <li>Shipping and billing information.</li>
            <li>Order history and preferences.</li>
          </ul>
        </div>

        {/* How We Use Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            How We Use Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your data helps us process orders, improve services, send updates, and personalize 
            your shopping experience. We never share your personal information with third parties 
            for marketing without your consent.
          </p>
        </div>

        {/* Cookies */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Our website uses cookies to enhance user experience. You can manage or disable cookies 
            through your browser settings if you prefer.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600">
            For any questions regarding this Privacy Policy, contact us at 
            <span className="text-purple-600 font-semibold"> support@nexebay.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
