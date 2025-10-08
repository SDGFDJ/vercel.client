import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { valideURLConvert } from "../utils/valideURLConvert";
import { Helmet } from "react-helmet-async"; // ✅ SEO

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      const res = await Axios.get(SummaryApi.wishlist.get.url, { withCredentials: true });
      if (res.data.success) {
        setWishlist(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Toggle wishlist item
  const handleWishlistToggle = async (productId, inWishlist) => {
    try {
      if (!inWishlist) {
        await Axios.post(SummaryApi.wishlist.add.url, { productId }, { withCredentials: true });
        toast.success("Added to wishlist");
      } else {
        await Axios.post(SummaryApi.wishlist.remove.url, { productId }, { withCredentials: true });
        toast.success("Removed from wishlist");
      }
      fetchWishlist(); // Refresh wishlist
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (loading) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="p-4">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>My Wishlist | Binkeyit</title>
        <meta
          name="description"
          content="Check all your wishlist products on Nexebay. Add your favorite products to wishlist and shop anytime."
        />
        <meta
          name="keywords"
          content="wishlist, my wishlist, favorite products, Nexebay"
        />
      </Helmet>

      <h2 className="text-xl font-bold mb-4">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="border rounded-lg p-3 shadow-sm relative flex flex-col">
              {/* Product Image with wishlist heart */}
              <div className="relative">
                <Link to={`/product/${valideURLConvert(item.name)}-${item._id}`}>
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </Link>
                <button
                  onClick={() => handleWishlistToggle(item._id, true)}
                  className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow-md hover:scale-110 transition"
                >
                  <FaHeart size={20} />
                </button>
              </div>

              {/* Product Info */}
              <h3 className="font-semibold mt-2">{item.name}</h3>
              <p className="text-gray-700">
                {DisplayPriceInRupees(pricewithDiscount(item.price, item.discount))}
              </p>

              {/* Add to Cart Button */}
              {item.stock !== 0 && (
                <div className="mt-auto">
                  <AddToCartButton data={item} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
