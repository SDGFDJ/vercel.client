
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import { valideURLConvert } from '../utils/valideURLConvert';
import { FaSearch, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Using Font Awesome icons
import Loading from '../components/Loading';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-lg flex items-center gap-4">
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

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user || {});
  const loadingCategory = useSelector((state) => state.product?.loadingCategory || false);
  const categoryData = useSelector((state) => state.product?.allCategory || []);
  const subCategoryData = useSelector((state) => state.product?.allSubCategory || []);
  const cartItems = useSelector((state) => state.cart?.items || []); // Assuming cart is in Redux
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Banners / Offers
  const banners = [
    {
      text: 'Festive Season Sale - Up to 50% Off!',
      bg: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      image: 'https://via.placeholder.com/1200x400?text=Festive+Sale',
      redirect: '/offers/festive-sale',
    },
    {
      text: 'Fresh Groceries at Unbeatable Prices!',
      bg: 'bg-gradient-to-r from-green-400 to-teal-500 text-white',
      image: 'https://via.placeholder.com/1200x400?text=Fresh+Groceries',
      redirect: '/category/groceries',
    },
    {
      text: 'Exclusive Deals Just for You!',
      bg: 'bg-gradient-to-r from-pink-400 to-red-500 text-white',
      image: 'https://via.placeholder.com/1200x400?text=Exclusive+Deals',
      redirect: '/offers/exclusive',
    },
  ];

  // Banner auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle banner navigation
  const handleBannerChange = (index) => {
    setCurrentBanner(index);
  };

  // Handle category redirect
  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category?.some((c) => c._id === id)
    );
    if (!subcategory) {
      console.warn('No subcategory found for category:', id);
      return;
    }
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  // Scroll to products section
  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear search input after submission
    }
  };

  // Handle newsletter signup
  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    // Mock API call for newsletter signup
    setTimeout(() => {
      alert('Subscribed successfully!');
      setEmail('');
    }, 1000);
  };

  // Filter categories
  const filteredCategories = selectedCategory
    ? categoryData.filter((cat) => cat._id === selectedCategory)
    : categoryData;

  return (
    <ErrorBoundary>
      <section className="bg-gray-50 min-h-screen">
     {/* Hero Section */}
<div className="relative w-full h-[25vh] sm:h-[30vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 via-white to-teal-100">
  {/* Animated Background Elements (Optional, smaller size for mobile) */}
  <motion.div
    animate={{ x: [0, 30, 0], y: [0, 20, 0], rotate: [0, 360, 0] }}
    transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
    className="absolute w-40 h-40 bg-green-200 rounded-full opacity-20 -top-12 -left-8"
  />
  <motion.div
    animate={{ x: [0, -40, 0], y: [0, -30, 0], rotate: [0, -360, 0] }}
    transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
    className="absolute w-60 h-60 bg-yellow-200 rounded-full opacity-20 bottom-0 right-0"
  />

  {/* Hero Content */}
  <motion.div
    initial={{ y: -30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="relative z-10 text-center px-4 md:px-8 max-w-3xl"
  >
    <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 drop-shadow-md">
      Welcome, {user?.username || 'Back Sir '}!
    </h1>
    <p className="text-sm sm:text-base mt-2 text-gray-700">
      Discover fresh groceries, unbeatable prices, and exclusive offers.
    </p>
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
      <motion.button
        onClick={scrollToProducts}
        whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(34,197,94,0.3)' }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 sm:px-8 sm:py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all duration-300"
      >
        Shop Now
      </motion.button>
    </div>
  </motion.div>
</div>

{/* Offer Banners Carousel (Click does nothing) */}
<div className="relative container mx-auto px-4 py-4 sm:py-6">
  <AnimatePresence mode="wait">
    <motion.div
      key={currentBanner}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-xl overflow-hidden shadow-md cursor-default`}
    >
      <img
        src={banners[currentBanner].image}
        alt={banners[currentBanner].text}
        className="w-full h-36 sm:h-48 object-cover opacity-80"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-base sm:text-lg font-semibold text-center px-2">
          {banners[currentBanner].text}
        </h2>
      </div>
    </motion.div>
  </AnimatePresence>

  {/* Navigation Dots */}
  <div className="flex justify-center mt-2 gap-2">
    {banners.map((_, index) => (
      <button
        key={index}
        onClick={() => handleBannerChange(index)}
        className={`w-2.5 h-2.5 rounded-full ${currentBanner === index ? 'bg-green-600' : 'bg-gray-300'} transition`}
        aria-label={`Go to banner ${index + 1}`}
      />
    ))}
  </div>
</div>


        {/* Category Filter */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categoryData.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div
          id="products-section"
          className="container mx-auto px-4 md:px-6 my-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6"
        >
          {loadingCategory
            ? new Array(10).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 h-36 grid gap-2 shadow-lg animate-pulse"
                >
                  <div className="bg-green-100 h-24 rounded-lg"></div>
                  <div className="bg-green-100 h-6 rounded"></div>
                </div>
              ))
            : filteredCategories.map((cat) => (
                <motion.div
                  key={cat._id}
                  onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  whileHover={{ scale: 1.1, boxShadow: '0px 15px 30px rgba(34,197,94,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer bg-white rounded-xl p-4 flex flex-col items-center transition-all duration-300 hover:bg-green-50"
                >
                  <img
                    src={cat.image || 'https://via.placeholder.com/80'}
                    alt={cat.name}
                    className="w-20 h-20 object-contain mb-2"
                    loading="lazy"
                  />
                  <p className="text-sm font-semibold text-gray-700 text-center">{cat.name}</p>
                </motion.div>
              ))}
        </div>


        {/* Category-Wise Products */}
        {filteredCategories.map((c) => (
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

        {/* Newsletter Signup */}
        <div className="container mx-auto px-4 py-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Our Offers!</h2>
            <p className="text-lg mb-6">Subscribe to our newsletter for exclusive deals and updates.</p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row justify-center gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-80"
                aria-label="Enter your email for newsletter"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default Home;
