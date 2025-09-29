import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';
import Divider from '../components/Divider';
import CardProduct from '../components/CardProduct';
import { IoChevronBack, IoChevronForward, IoStar, IoStarOutline, IoShareSocial, IoLogoTwitter, IoLogoFacebook, IoLogoWhatsapp, IoClose, IoHeartOutline, IoArrowUp } from 'react-icons/io5';
import Loading from '../components/Loading';

// Fallback for valideURLConvert if not imported
const valideURLConvert = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = useMemo(() => {
    if (!params?.product) return null;
    const parts = params.product.split('-');
    return parts.length > 0 ? parts[parts.length - 1] : null;
  }, [params]);

  const [data, setData] = useState({
    name: '',
    image: [],
    more_details: { rating: 0, reviews: 0 },
    description: '',
    category: [],
    subCategory: [],
    price: 0,
    discount: 0,
    stock: 0,
    unit: '',
    variants: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [otherCategoryProducts, setOtherCategoryProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [otherCategoryLoading, setOtherCategoryLoading] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [zoom, setZoom] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [pincode, setPincode] = useState('');
  const [availability, setAvailability] = useState(null);
  const imageContainer = useRef();
  const mainImageRef = useRef();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch product details with retry
  const fetchProductDetails = async (retryCount = 0) => {
    if (!productId) {
      setError('Invalid product ID.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await Axios({ ...SummaryApi.getProductDetails, data: { productId } });
      const { data: responseData } = response;
      if (responseData.success && responseData.data) {
        const productData = {
          ...responseData.data,
          name: responseData.data.name || 'Unnamed Product',
          image: Array.isArray(responseData.data.image) ? responseData.data.image : [],
          more_details: {
            rating: responseData.data.more_details?.rating ?? 0,
            reviews: responseData.data.more_details?.reviews ?? 0,
          },
          description: responseData.data.description || 'No description available.',
          price: responseData.data.price ?? 0,
          discount: responseData.data.discount ?? 0,
          stock: responseData.data.stock ?? 0,
          unit: responseData.data.unit || '',
          category: Array.isArray(responseData.data.category) ? responseData.data.category : [],
          subCategory: Array.isArray(responseData.data.subCategory) ? responseData.data.subCategory : [],
          variants: Array.isArray(responseData.data.variants) ? responseData.data.variants : [],
        };
        setData(productData);
        setSelectedVariant(productData.variants[0] || null);
        setRecentlyViewed((prev) => {
          const updated = [
            {
              _id: productData._id,
              name: productData.name,
              image: productData.image[0] || 'https://via.placeholder.com/150',
              price: productData.price,
              discount: productData.discount,
            },
            ...prev.filter((item) => item._id !== productData._id),
          ].slice(0, 4);
          return updated;
        });
        const categoryId = productData.category?.[0]?._id || '';
        const subCategoryId = productData.subCategory?.[0]?._id || '';
        fetchRelatedProducts(categoryId, subCategoryId, productData._id);
        fetchOtherCategoryProducts(categoryId);
      } else {
        setError('Failed to load product details.');
      }
    } catch (error) {
      if (retryCount < 2) {
        setTimeout(() => fetchProductDetails(retryCount + 1), 1000);
      } else {
        setError('Unable to fetch product details after multiple attempts.');
        AxiosToastError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (categoryId, subCategoryId, currentProductId) => {
    if (!categoryId || !subCategoryId) return;
    try {
      setRelatedLoading(true);
      const response = await Axios({
        method: 'post',
        url: '/api/product/get-related-products',
        data: { categoryId, subCategoryId, excludeProductId: currentProductId, limit: 8 },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setRelatedProducts(Array.isArray(responseData.data) ? responseData.data : []);
      }
    } catch (error) {
      setError('Failed to load related products.');
      AxiosToastError(error);
    } finally {
      setRelatedLoading(false);
    }
  };

  // Fetch products from other categories
  const fetchOtherCategoryProducts = async (currentCategoryId) => {
    if (!currentCategoryId) return;
    try {
      setOtherCategoryLoading(true);
      const response = await Axios({
        method: 'post',
        url: '/api/product/get-other-category-products',
        data: { currentCategoryId, limit: 8 },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setOtherCategoryProducts(Array.isArray(responseData.data) ? responseData.data : []);
      }
    } catch (error) {
      setError('Failed to load other category products.');
      AxiosToastError(error);
    } finally {
      setOtherCategoryLoading(false);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Image scroll handlers
  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 100;
    }
  };

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 100;
    }
  };

  // Quantity handler
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      return Math.max(1, Math.min(data.stock || 1, newQuantity));
    });
  };

  // Share handler
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${data.name} on Ma Gayatri Store!`;
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
  };

  // Variant handler
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setData((prev) => ({
      ...prev,
      price: variant.price || prev.price,
      stock: variant.stock || prev.stock,
      image: variant.image || prev.image,
    }));
    setImage(0); // Reset image index on variant change
  };

  // Wishlist handler (mock implementation)
  const handleAddToWishlist = () => {
    alert(`Added ${data.name} to wishlist!`); // Replace with actual wishlist API call
  };

  // Pincode availability checker (mock implementation)
  const checkAvailability = async () => {
    if (!pincode || pincode.length < 6) {
      setAvailability('Please enter a valid 6-digit pincode.');
      return;
    }
    try {
      // Mock API call
      setAvailability('Checking...');
      // Replace with actual API call to check stock by pincode
      setTimeout(() => {
        setAvailability(`Product available for delivery at ${pincode}!`);
      }, 1000);
    } catch (error) {
      setAvailability('Unable to check availability. Please try again.');
    }
  };

  // Countdown timer for offer
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (data.discount > 0) {
      const endTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;
        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft(null);
          return;
        }
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data.discount]);

  // Quick view handler
  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-lg flex items-center gap-4">
          <span>{error}</span>
          <button
            onClick={() => fetchProductDetails()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Image */}
        <motion.div
          ref={mainImageRef}
          className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className="relative"
            animate={{ scale: zoom ? 1.5 : 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              setZoom((prev) => !prev);
            }}
          >
            <img
              src={data.image[image] || 'https://via.placeholder.com/600'}
              alt={data.name || 'Product Image'}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-contain cursor-zoom-in"
              loading="lazy"
            />
          </motion.div>

          {/* Thumbnails */}
          <AnimatePresence>
            {showThumbnails && data.image.length > 1 && (
              <motion.div
                ref={imageContainer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 py-3 px-4 snap-x snap-mandatory bg-white"
              >
                {data.image.map((img, index) => (
                  <motion.div
                    key={img + index}
                    className={`w-16 h-16 cursor-pointer rounded-lg shadow-md overflow-hidden border-2 ${
                      image === index ? 'border-green-500' : 'border-transparent'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(index);
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll Arrows */}
          {data.image.length > 4 && showThumbnails && (
            <div className="absolute w-full top-1/2 transform -translate-y-1/2 flex justify-between px-4">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrollLeft();
                }}
                className="bg-white p-2 rounded-full shadow-lg text-green-500 hover:bg-green-500 hover:text-white transition duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Scroll thumbnails left"
              >
                <IoChevronBack size={20} />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrollRight();
                }}
                className="bg-white p-2 rounded-full shadow-lg text-green-500 hover:bg-green-500 hover:text-white transition duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Scroll thumbnails right"
              >
                <IoChevronForward size={20} />
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Breadcrumb */}
        <motion.nav
          className="text-sm text-gray-600 mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="hover:text-green-600 transition">
            Home
          </Link>{' '}
          &gt;{' '}
          {data.category?.[0]?.name && (
            <>
              <Link
                to={`/category/${valideURLConvert(data.category[0].name)}-${data.category[0]._id}`}
                className="hover:text-green-600 transition"
              >
                {data.category[0].name}
              </Link>{' '}
              &gt;{' '}
            </>
          )}
          {data.subCategory?.[0]?.name && (
            <>
              <Link
                to={`/subcategory/${valideURLConvert(data.subCategory[0].name)}-${data.subCategory[0]._id}`}
                className="hover:text-green-600 transition"
              >
                {data.subCategory[0].name}
              </Link>{' '}
              &gt;{' '}
            </>
          )}
          <span className="text-gray-800 font-medium">{data.name}</span>
        </motion.nav>

        {/* Product Details and Description */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Product Details */}
          <div className="space-y-6">
            <motion.div
              className="flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                10 Min Delivery
              </span>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(data.more_details.rating) ? (
                        <IoStar size={18} />
                      ) : (
                        <IoStarOutline size={18} />
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({data.more_details.reviews} reviews)</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {data.name}
            </motion.h1>
            <p className="text-base text-gray-600">{data.unit}</p>
            <Divider />

            {/* Offer Countdown Timer */}
            {timeLeft && data.discount > 0 && (
              <motion.div
                className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Limited Offer! Ends in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </motion.div>
            )}

            <motion.div
              className="flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-green-600">
                  {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                </span>
                {data.discount > 0 && (
                  <>
                    <span className="line-through text-gray-400 text-base">
                      {DisplayPriceInRupees(data.price)}
                    </span>
                    <span className="text-red-500 font-semibold">{data.discount}% OFF</span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Pincode Availability Checker */}
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode"
                  className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={6}
                  aria-label="Enter pincode to check availability"
                />
                <button
                  onClick={checkAvailability}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                  aria-label="Check availability"
                >
                  Check
                </button>
              </div>
              {availability && (
                <p className={`text-sm ${availability.includes('available') ? 'text-green-600' : 'text-red-600'}`}>
                  {availability}
                </p>
              )}
            </motion.div>

            {/* Variant Selector */}
            {data.variants?.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <span className="text-base font-semibold text-gray-600">Variants:</span>
                {data.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleVariantChange(variant)}
                    className={`px-3 py-1 rounded-lg border-2 ${
                      selectedVariant === variant
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600'
                    } hover:bg-green-50 transition duration-200`}
                    aria-label={`Select ${variant.name} variant`}
                  >
                    {variant.name}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Quantity Selector, Add to Cart, and Wishlist */}
            {data.stock > 0 ? (
              <motion.div
                className="flex items-center gap-4 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 bg-white text-gray-700 rounded-full hover:bg-green-100 hover:text-green-600 transition duration-200 disabled:opacity-50"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= data.stock) setQuantity(value);
                    }}
                    className="w-12 text-center text-base font-semibold bg-transparent focus:outline-none"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 bg-white text-gray-700 rounded-full hover:bg-green-100 hover:text-green-600 transition duration-200 disabled:opacity-50"
                    disabled={quantity >= data.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <AddToCartButton
                  data={{ ...data, quantity, variant: selectedVariant }}
                  label="Add to Cart"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                />
                <button
                  onClick={handleAddToWishlist}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
                  aria-label="Add to wishlist"
                >
                  <IoHeartOutline size={20} />
                  Wishlist
                </button>
                <p className="text-sm text-gray-600">Available: {data.stock} units</p>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <p className="text-red-600 font-bold text-base">Out of Stock</p>
              </motion.div>
            )}

            {/* Sticky View Cart Button (Mobile Only) */}
            {data.stock > 0 && (
              <motion.div
                className="fixed bottom-4 left-0 right-0 px-4 lg:hidden z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
               
              </motion.div>
            )}

            {/* Share Buttons */}
            <motion.div
              className="flex gap-3 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <p className="text-base font-semibold text-gray-600 flex items-center gap-2">
                <IoShareSocial size={20} /> Share:
              </p>
              <button
                onClick={() => handleShare('twitter')}
                className="text-blue-400 hover:text-blue-600 transition"
                aria-label="Share on Twitter"
              >
                <IoLogoTwitter size={24} />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="text-blue-600 hover:text-blue-800 transition"
                aria-label="Share on Facebook"
              >
                <IoLogoFacebook size={24} />
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="text-green-500 hover:text-green-700 transition"
                aria-label="Share on WhatsApp"
              >
                <IoLogoWhatsapp size={24} />
              </button>
            </motion.div>
          </div>

          {/* Product Description and Why Shop */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <h2 className="font-bold text-xl text-gray-900 mb-4">Product Description</h2>
              <div className="text-gray-600 text-base leading-relaxed">
                <p className="mb-4">{data.description}</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <IoStar size={20} className="text-green-500 mt-1" />
                    <span>Premium quality, hand-selected for freshness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IoStar size={20} className="text-green-500 mt-1" />
                    <span>Sourced from trusted, sustainable farms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IoStar size={20} className="text-green-500 mt-1" />
                    <span>100% organic, free from harmful chemicals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IoStar size={20} className="text-green-500 mt-1" />
                    <span>Eco-friendly packaging for minimal environmental impact</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <h2 className="font-bold text-xl text-gray-900 mb-4">Why Shop with Us?</h2>
              <div className="grid gap-4">
                {[
                  {
                    icon: <IoChevronForward size={24} />,
                    title: 'Superfast Delivery',
                    desc: 'Delivered to your door in under 10 minutes.',
                  },
                  {
                    icon: <IoChevronForward size={24} />,
                    title: 'Best Prices & Offers',
                    desc: 'Unbeatable prices with exclusive discounts.',
                  },
                  {
                    icon: <IoChevronForward size={24} />,
                    title: 'Wide Assortment',
                    desc: 'Over 5,000 products across all categories.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <span className="text-green-500">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-base text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <motion.div
            className="mt-12 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyViewed.map((product, index) => (
                <motion.div
                  key={product._id + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/product/${valideURLConvert(product.name)}-${product._id}`} onClick={scrollToTop}>
                    <CardProduct data={product} />
                  </Link>
                  <button
                    onClick={() => openQuickView(product)}
                    className="mt-2 w-full bg-gray-200 text-gray-700 py-1 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                    aria-label={`Quick view ${product.name}`}
                  >
                    Quick View
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        <motion.div
          className="mt-12 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">You May Also Like</h2>
          {relatedLoading ? (
            <div className="text-center text-gray-600 text-base">
              <Loading />
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product._id + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/product/${valideURLConvert(product.name)}-${product._id}`} onClick={scrollToTop}>
                    <CardProduct data={product} />
                  </Link>
                  <button
                    onClick={() => openQuickView(product)}
                    className="mt-2 w-full bg-gray-200 text-gray-700 py-1 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                    aria-label={`Quick view ${product.name}`}
                  >
                    Quick View
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base">No related products found.</p>
          )}
        </motion.div>

        {/* Other Category Products */}
        <motion.div
          className="mt-12 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Other Categories</h2>
          {otherCategoryLoading ? (
            <div className="text-center text-gray-600 text-base">
              <Loading />
            </div>
          ) : otherCategoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherCategoryProducts.map((product, index) => (
                <motion.div
                  key={product._id + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/product/${valideURLConvert(product.name)}-${product._id}`} onClick={scrollToTop}>
                    <CardProduct data={product} />
                  </Link>
                  <button
                    onClick={() => openQuickView(product)}
                    className="mt-2 w-full bg-gray-200 text-gray-700 py-1 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                    aria-label={`Quick view ${product.name}`}
                  >
                    Quick View
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base">No products from other categories found.</p>
          )}
        </motion.div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{quickViewProduct.name}</h2>
                <button
                  onClick={closeQuickView}
                  className="text-gray-600 hover:text-gray-800 transition"
                  aria-label="Close quick view"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <img
                src={quickViewProduct.image[0] || 'https://via.placeholder.com/300'}
                alt={quickViewProduct.name}
                className="w-full h-48 object-contain mb-4"
                loading="lazy"
              />
              <p className="text-base text-gray-600 mb-4">
                {quickViewProduct.description || 'No description available.'}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-green-600">
                  {DisplayPriceInRupees(pricewithDiscount(quickViewProduct.price, quickViewProduct.discount))}
                </span>
                {quickViewProduct.discount > 0 && (
                  <>
                    <span className="line-through text-gray-400 text-sm">
                      {DisplayPriceInRupees(quickViewProduct.price)}
                    </span>
                    <span className="text-red-500 font-semibold text-sm">{quickViewProduct.discount}% OFF</span>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <AddToCartButton
                  data={{ ...quickViewProduct, quantity: 1 }}
                  label="Add to Cart"
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                />
                <Link
                  to={`/product/${valideURLConvert(quickViewProduct.name)}-${quickViewProduct._id}`}
                  onClick={scrollToTop}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition duration-200 text-center"
                >
                  View Full Details
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Back to Top Button */}
        <motion.button
          className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-200 lg:bottom-4"
          onClick={scrollToTop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          aria-label="Back to top"
        >
          <IoArrowUp size={24} />
        </motion.button>
      </div>
    </section>
  );
};

export default ProductDisplayPage;