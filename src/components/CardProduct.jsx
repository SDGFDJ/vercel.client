import React, { useState, useEffect } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await Axios.get(SummaryApi.wishlist.get.url, {
          withCredentials: true,
        });
        if (res.data.success) {
          const wishlistIds = res.data.data.map((item) => item._id);
          setInWishlist(wishlistIds.includes(data._id));
        }
      } catch (error) {
        console.log("Error fetching wishlist:", error);
      }
    };
    checkWishlist();
  }, [data._id]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await Axios.get(`/api/review/${data._id}?limit=0`);
        if (res.data.success) {
          setRatingData({
            averageRating: parseFloat(res.data.averageRating) || 0,
            totalReviews: res.data.totalReviews || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching product rating:", error);
      }
    };
    if (data._id) fetchRating();
  }, [data._id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!inWishlist) {
        await Axios.post(
          SummaryApi.wishlist.add.url,
          { productId: data._id },
          { withCredentials: true }
        );
        setInWishlist(true);
      } else {
        await Axios.post(
          SummaryApi.wishlist.remove.url,
          { productId: data._id },
          { withCredentials: true }
        );
        setInWishlist(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const rating = ratingData.averageRating || 0;
  const percentage = (rating / 5) * 100;

  return (
    <Link
      to={url}
      className="border py-2 lg:p-4 grid gap-2 lg:gap-3 rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md transition relative"
    >
      {/* Image */}
      <div className="w-full h-40 lg:h-52 rounded-md overflow-hidden flex items-center justify-center bg-gray-50 relative">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-contain"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={loading}
          className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow-md hover:scale-110 transition"
        >
          {inWishlist ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>

        {/* Discount Tag - Overlay Top-Left */}
        {data.discount && (
          <div
            className={`absolute top-2 left-2 text-white font-bold px-3 py-1 text-sm lg:text-base rounded shadow-lg ${
              data.discount >= 50 ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}
          >
            {data.discount}% OFF
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 px-2 lg:px-0">
        {/* In Stock Tag */}
        {data.stock > 0 ? (
          <div className="rounded text-xs lg:text-sm font-bold w-fit px-2 py-1 text-white bg-green-600">
            In Stock
          </div>
        ) : (
          <div className="rounded text-xs lg:text-sm font-bold w-fit px-2 py-1 text-white bg-red-500">
            Out of Stock
          </div>
        )}
      </div>

      {/* Name */}
      <div className="px-2 lg:px-0 font-medium text-sm lg:text-base line-clamp-2 text-gray-800">
        {data.name}
      </div>

      {/* Rating Circle */}
      <div className="px-2 lg:px-0 flex items-center gap-2 mt-1">
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="transparent"
            />
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="#facc15"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="113"
              strokeDashoffset={113 - (113 * percentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-yellow-600">
            {rating.toFixed(1)}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {ratingData.totalReviews > 0
            ? `${ratingData.totalReviews} reviews`
            : "No reviews yet"}
        </p>
      </div>

      {/* Unit */}
      <div className="px-2 lg:px-0 text-sm lg:text-base text-gray-600">
        {data.unit}
      </div>

      {/* Price */}
      <div className="px-2 lg:px-0 flex items-center justify-between gap-2">
        <div className="font-semibold text-gray-900 text-sm lg:text-base">
          {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
        </div>
        <div>
          {data.stock === 0 ? (
            <p className="text-red-500 text-xs lg:text-sm text-center">
              Out of stock
            </p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;

