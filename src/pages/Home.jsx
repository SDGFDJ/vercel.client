import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import { valideURLConvert } from '../utils/valideURLConvert';

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <span>Something went wrong: {this.state.error?.message || 'Unknown error'}</span>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// HeroSection with new floating shapes and animation
const HeroSection = ({ user, scrollToProducts }) => {
  const messages = [
    `Welcome, ${user?.username || 'Fashion Lover'}!`,
    'Discover the latest trends!',
    'Exclusive collections just for you!',
    'Unbeatable fashion deals await!',
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 100;
    const pauseTime = 2000;

    const handleTyping = () => {
      const fullText = messages[currentMessage];
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, typingIndex + 1));
        setTypingIndex((prev) => prev + 1);
        if (typingIndex + 1 === fullText.length) setTimeout(() => setIsDeleting(true), pauseTime);
      } else {
        setDisplayText(fullText.substring(0, typingIndex - 1));
        setTypingIndex((prev) => prev - 1);
        if (typingIndex - 1 === 0) {
          setIsDeleting(false);
          setCurrentMessage((prev) => (prev + 1) % messages.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typingIndex, isDeleting, currentMessage, messages]);

  return (
    <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-white to-purple-100">
      {/* Floating shapes */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 30, 0], rotate: [0, 360, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
        className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-20 -top-20 -left-10"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, -50, 0], rotate: [0, -360, 0] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'easeInOut' }}
        className="absolute w-72 h-72 bg-purple-300 rounded-full opacity-20 bottom-0 right-0"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
        transition={{ repeat: Infinity, duration: 35, ease: 'easeInOut' }}
        className="absolute w-36 h-36 bg-yellow-300 rounded-full opacity-25 top-10 right-20"
      />

      {/* Hero Text */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4 md:px-8 max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-900 drop-shadow-md mb-4">
          Trendify Spotlight
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 min-h-[2.5rem]">
          {displayText}
          <span className="border-r-2 border-purple-900 animate-pulse ml-1"></span>
        </p>
        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={scrollToProducts}
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(128,0,128,0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300"
          >
            Shop Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const categoryData = useSelector((state) => state.product?.allCategory || []);
  const subCategoryData = useSelector((state) => state.product?.allSubCategory || []);
  const loadingCategory = useSelector((state) => state.product?.loadingCategory || false);

  const [currentBanner, setCurrentBanner] = useState(0);
  const [email, setEmail] = useState('');
  const [showTopBtn, setShowTopBtn] = useState(false);

  const banners = [
    { text: 'Trendify Exclusive Fashion Sale!', image: 'https://via.placeholder.com/1200x500?text=Fashion+Sale' },
    { text: 'New Arrivals in Trendy Styles', image: 'https://via.placeholder.com/1200x500?text=New+Arrivals' },
    { text: 'Limited Time Fashion Deals', image: 'https://via.placeholder.com/1200x500?text=Limited+Deals' },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentBanner((prev) => (prev + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    setTimeout(() => {
      alert('Subscribed successfully!');
      setEmail('');
    }, 1000);
  };

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) => sub.category?.some((c) => c._id === id));
    if (!subcategory) return;
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  return (
    <ErrorBoundary>
      <section className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <HeroSection user={user} scrollToProducts={scrollToProducts} />

        {/* Banner Carousel */}
        <div className="container mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-xl overflow-hidden shadow-md cursor-default"
            >
              <img
                src={banners[currentBanner].image}
                alt={banners[currentBanner].text}
                className="w-full h-52 md:h-64 object-cover opacity-95"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <h2 className="text-lg md:text-xl font-semibold text-white text-center px-4">
                  {banners[currentBanner].text}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center mt-3 gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full ${currentBanner === index ? 'bg-purple-600' : 'bg-gray-300'} transition`}
              />
            ))}
          </div>
        </div>

        {/* Shop by Category */}
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="flex overflow-x-auto gap-4 pb-2">
            {categoryData.map((cat) => (
              <motion.div
                key={cat._id}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className="min-w-[140px] bg-white rounded-xl p-4 flex flex-col items-center shadow-md cursor-pointer hover:bg-purple-50 transition"
              >
                <img
                  src={cat.image || 'https://via.placeholder.com/80'}
                  alt={cat.name}
                  className="w-20 h-20 object-contain mb-2"
                />
                <p className="text-sm font-semibold text-gray-700 text-center">{cat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category-wise Product Sliders */}
        <div id="products-section">
          {categoryData.map((c) => (
            <motion.div
              key={c?._id + 'CategorywiseProduct'}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <CategoryWiseProductDisplay id={c?._id} name={c?.name} />
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="container mx-auto px-4 py-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white mt-16 relative overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Trendy with Trendify!</h2>
            <p className="text-lg mb-6">Subscribe to our newsletter for exclusive fashion updates.</p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row justify-center gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-80"
              />
              <button type="submit" className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Back to Top Button */}
        {showTopBtn && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
            whileHover={{ scale: 1.1 }}
          >
            ↑
          </motion.button>
        )}
      </section>
    </ErrorBoundary>
  );
};

export default Home;
