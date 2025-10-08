import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Nexebay</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your one-stop destination for quality products and excellent service.  
            We deliver happiness at your doorstep!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/shop" className="hover:text-white transition">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link to="/faqs" className="hover:text-white transition">FAQs</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-white transition">Return Policy</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Support</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-primary-100" /> 
              <a href="tel:+918830930200" className="hover:text-white transition">+91 88309 30200</a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-primary-100" /> 
              <a href="mailto:support@nexebay.com" className="hover:text-white transition">support@nexebay.com</a>
            </li>
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-primary-100 mt-1" /> 
              <span>Latif Compound, Nadi Naka, Shelar, Bhiwandi, Thane, Maharashtra, India</span>
            </li>
            <li className="flex items-center gap-2">
              <FaClock className="text-primary-100" /> 
              <span>24/7 Customer Service</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <a href="https://www.facebook.com/nexebay" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition"><FaFacebook /></a>
            <a href="https://www.instagram.com/nexebay.web" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition"><FaInstagram /></a>
            <a href="https://www.linkedin.com/company/nexebay" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} All Rights Reserved | Developed by <span className="text-white font-semibold">Gaurav Yadav</span>
      </div>
    </footer>
  );
};

export default Footer;
