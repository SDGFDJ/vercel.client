import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { motion } from 'framer-motion';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';
import Divider from '../components/Divider';
import CardProduct from '../components/CardProduct';

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
    more_details: { rating: 0, reviews: 0 },
    description: "",
    category: [],
    subCategory: [],
    price: 0,
    discount: 0,
    stock: 0,
    unit: "",
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [otherCategoryProducts, setOtherCategoryProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [otherCategoryLoading, setOtherCategoryLoading] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const imageContainer = useRef();
  const mainImageRef = useRef();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getProductDetails, data: { productId } });
      const { data: responseData } = response;
      if (responseData.success) {
        setData({
          ...responseData.data,
          more_details: {
            rating: responseData.data.more_details?.rating ?? 0,
            reviews: responseData.data.more_details?.reviews ?? 0,
          },
          description: responseData.data.description ?? "No description available.",
          price: responseData.data.price ?? 0,
          discount: responseData.data.discount ?? 0,
          stock: responseData.data.stock ?? 0,
          unit: responseData.data.unit ?? "",
          category: responseData.data.category ?? [],
          subCategory: responseData.data.subCategory ?? [],
        });

        const categoryId = responseData.data.category?.[0]?._id || "";
        const subCategoryId = responseData.data.subCategory?.[0]?._id || "";
        fetchRelatedProducts(categoryId, subCategoryId, responseData.data._id);
        fetchOtherCategoryProducts(categoryId);
      }
    } catch (error) {
      AxiosToastError(error);
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
        setRelatedProducts(responseData.data);
      }
    } catch (error) {
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
        setOtherCategoryProducts(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setOtherCategoryLoading(false);
    }
  };

  // Scroll to top of product image
  const scrollToTop = () => {
    if (mainImageRef.current) {
      mainImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  // Image scroll handlers
  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  // 3D hover effect handlers
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShowThumbnails(false);
  };

  const handleMouseEnter = () => {
    setShowThumbnails(true);
  };

  // Toggle thumbnails on mobile tap
  const handleImageClick = () => {
    setShowThumbnails((prev) => !prev);
  };

  // Quantity handler
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(data.stock, prev + delta)));
  };

  // Share handler
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${data.name} on Ma Gayatri Store!`;
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-3xl font-bold text-gray-600 animate-pulse">Loading...</div>
    </div>
  );

  return (
    <section className="container mx-auto px-8 py-16 bg-offwhite min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Image */}
        <motion.div
          ref={mainImageRef}
          className="relative bg-white rounded-2xl shadow-xl overflow-hidden perspective-1000 border border-gray-200 group"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
        >
         <motion.img
    src={data.image[image] || "https://via.placeholder.com/600"}
  alt={data.name}
className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-contain"
  animate={{ rotateX: rotate.x, rotateY: rotate.y, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 600, damping: 25 }}
/>

          {/* Thumbnails (shown on hover or click) */}
          <div
            ref={imageContainer}
            className={`flex gap-4 overflow-x-auto scrollbar-none py-3 snap-x snap-mandatory transition-opacity duration-300 ${showThumbnails ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {data.image.map((img, index) => (
              <motion.div
                key={img + index}
                className={`w-20 h-20 cursor-pointer rounded-lg shadow-md overflow-hidden border-2 ${image === index ? 'border-teal-500' : 'border-transparent'}`}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(index);
                }}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
          {/* Scroll Arrows (shown with thumbnails) */}
          {data.image.length > 4 && showThumbnails && (
            <div className="absolute w-full top-[calc(40vh-4rem)] transform -translate-y-1/2 flex justify-between px-4">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrollLeft();
                }}
                className="bg-white p-3 rounded-full shadow-lg text-teal-500 hover:bg-teal-500 hover:text-white transition duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-angle-left text-xl"></i>
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrollRight();
                }}
                className="bg-white p-3 rounded-full shadow-lg text-teal-500 hover:bg-teal-500 hover:text-white transition duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-angle-right text-xl"></i>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Breadcrumb */}
        <motion.nav
          className="text-base text-gray-500 mt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="hover:text-teal-600 transition">Home</Link> &gt;{" "}
          {data.category?.[0]?.name && (
            <Link to={`/category/${data.category[0].name}`} className="hover:text-teal-600 transition">
              {data.category[0].name}
            </Link>
          )}{" "}
          &gt;{" "}
          {data.subCategory?.[0]?.name && (
            <Link to={`/subcategory/${data.subCategory[0].name}`} className="hover:text-teal-600 transition">
              {data.subCategory[0].name}
            </Link>
          )}{" "}
          &gt; <span className="text-gray-700 font-medium">{data.name}</span>
        </motion.nav>

        {/* Product Details and Description (Horizontal) */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Product Details */}
          <div className="space-y-6">
            <motion.div
              className="flex items-center gap-6 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="bg-teal-500 text-white px-5 py-2 rounded-full text-base font-semibold tracking-wide">
                10 Min Delivery
              </span>
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < Math.floor(data.more_details.rating) ? '' : 'text-gray-300'}`}
                    ></i>
                  ))}
                </div>
                <span className="text-base text-gray-500 font-medium">({data.more_details.reviews} reviews)</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {data.name}
            </motion.h1>
            <p className="text-lg text-gray-600 font-medium">{data.unit}</p>
            <Divider />

            <motion.div
              className="flex items-center gap-6 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
             <div className="flex items-center gap-3">
  <span className="text-3xl font-bold text-teal-600">
    {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
  </span>
  {data.discount > 0 && (
    <span className="line-through text-gray-400 text-lg">
      {DisplayPriceInRupees(data.price)}
    </span>
  )}
  <span className="text-red-500 font-semibold">{data.discount}% OFF</span>
</div>

            </motion.div>

            {/* Quantity Selector and Add Button */}
            {data.stock > 0 ? (
              <motion.div
                className="flex items-center gap-6 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full hover:bg-teal-100 hover:text-teal-600 transition duration-200"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full hover:bg-teal-100 hover:text-teal-600 transition duration-200"
                    disabled={quantity >= data.stock}
                  >
                    +
                  </button>
                  <AddToCartButton
                    data={{ ...data, quantity }}
                    label="Add"
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                  />
                </div>
                <p className="text-base text-gray-500 font-medium">Available: {data.stock} units</p>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <p className="text-coral-600 font-bold text-lg">Out of Stock</p>
              </motion.div>
            )}

            {/* Share Buttons */}
            <motion.div
              className="flex gap-4 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <p className="text-base font-semibold text-gray-600">Share:</p>
              <button
                onClick={() => handleShare("twitter")}
                className="text-teal-400 hover:text-teal-600 transition"
              >
                <i className="fab fa-twitter text-xl"></i>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="text-teal-600 hover:text-teal-800 transition"
              >
                <i className="fab fa-facebook text-xl"></i>
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="text-coral-500 hover:text-coral-700 transition"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </button>
            </motion.div>
          </div>

          {/* Product Description and Why Shop */}
          <div className="space-y-6">
            {/* Product Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <h2 className="font-bold text-2xl text-gray-900 mb-6">Product Description</h2>
              <div className="text-gray-600 text-base leading-relaxed">
                <p className="mb-6 font-semibold">{data.description}</p>
                <ul className="space-y-3 list-none">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-teal-500 mt-1 text-lg"></i>
                    <span className="font-medium">Premium quality, hand-selected for freshness</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-teal-500 mt-1 text-lg"></i>
                    <span className="font-medium">Sourced from trusted, sustainable farms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-teal-500 mt-1 text-lg"></i>
                    <span className="font-medium">100% organic, free from harmful chemicals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-check-circle text-teal-500 mt-1 text-lg"></i>
                    <span className="font-medium">Eco-friendly packaging for minimal environmental impact</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Why Shop with Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <h2 className="font-bold text-2xl text-gray-900 mb-6">Why Shop with Us?</h2>
              <div className="grid gap-4">
                {[
                  {
                    icon: "fas fa-truck-fast",
                    title: "Superfast Delivery",
                    desc: "Delivered to your door in under 10 minutes.",
                  },
                  {
                    icon: "fas fa-tags",
                    title: "Best Prices & Offers",
                    desc: "Unbeatable prices with exclusive discounts.",
                  },
                  {
                    icon: "fas fa-store",
                    title: "Wide Assortment",
                    desc: "Over 5,000 products across all categories.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <i className={`${item.icon} text-2xl text-teal-500`}></i>
                    <div>
                      <p className="font-bold text-lg text-gray-800">{item.title}</p>
                      <p className="text-base text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          className="mt-16 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          {relatedLoading ? (
            <div className="text-center text-gray-600 text-base animate-pulse">Loading related products...</div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product._id + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={scrollToTop}
                >
                  <Link to={`/product/${product.name}-${product._id}`}>
                    <CardProduct data={product} />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base font-medium">No related products found.</p>
          )}
        </motion.div>

        {/* Other Category Products */}
        <motion.div
          className="mt-16 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Categories</h2>
          {otherCategoryLoading ? (
            <div className="text-center text-gray-600 text-base animate-pulse">Loading other products...</div>
          ) : otherCategoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherCategoryProducts.map((product, index) => (
                <motion.div
                  key={product._id + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={scrollToTop}
                >
                  <Link to={`/product/${product.name}-${product._id}`}>
                    <CardProduct data={product} />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-base font-medium">No products from other categories found.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;