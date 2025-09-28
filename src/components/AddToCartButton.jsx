import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa6';

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState();

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
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

    const response = await updateCartItem(cartItemDetails?._id, qty + 1);

    if (response.success) {
      toast.success('Item added');
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);

      if (response.success) {
        toast.success('Item removed');
      }
    }
  };

  return (
    <div className="w-full max-w-[200px] font-sans">
      {isAvailableCart ? (
        <div className="flex items-center rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Decrease Button */}
          <button
            onClick={decreaseQty}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-transform duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
            disabled={loading}
          >
            <FaMinus className="w-5 h-5" />
          </button>

          {/* Quantity Display */}
          <div
            className="flex-1 h-12 flex items-center justify-center text-lg font-bold text-gray-800 bg-gray-50 border-x border-gray-200"
            aria-live="polite"
          >
            {qty}
          </div>

          {/* Increase Button */}
          <button
            onClick={increaseQty}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-transform duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
            disabled={loading}
          >
            <FaPlus className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-semibold shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          aria-label="Add to cart"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loading />
              <span>Adding...</span>
            </div>
          ) : (
            'Add '
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;