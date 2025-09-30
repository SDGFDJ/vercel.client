import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState();
  const navigate = useNavigate();

  // Add to Cart
  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user._id) {
      toast.error("Please login first to add products!");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addTocart,
        data: { productId: data?._id },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkingitem = cartItem.some((item) => item.productId._id === data._id);
    setIsAvailableCart(checkingitem);

    const product = cartItem.find((item) => item.productId._id === data._id);
    setQty(product?.quantity || 0);
    setCartItemsDetails(product);
  }, [data, cartItem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user._id) {
      toast.error("Please login first to update cart!");
      navigate("/login");
      return;
    }

    const response = await updateCartItem(cartItemDetails?._id, qty + 1);
    if (response.success) toast.success("Item added");
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user._id) {
      toast.error("Please login first to update cart!");
      navigate("/login");
      return;
    }

    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);
      if (response.success) toast.success("Item removed");
    }
  };

  return (
    <div className="w-full max-w-[160px]">
      {isAvailableCart ? (
        <div className="flex items-center rounded-full bg-white shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <button
            onClick={decreaseQty}
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-transform hover:scale-105 active:scale-95"
            disabled={loading}
          >
            <FaMinus className="w-4 h-4" />
          </button>

          <div className="flex-1 h-8 flex items-center justify-center text-sm font-semibold text-gray-800 bg-gray-50 border-x border-gray-200">
            {qty}
          </div>

          <button
            onClick={increaseQty}
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-transform hover:scale-105 active:scale-95"
            disabled={loading}
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold shadow hover:from-purple-700 hover:to-pink-600 transition-all hover:scale-[1.05] active:scale-95"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loading />
              <span>Adding...</span>
            </div>
          ) : (
            "Add"
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
