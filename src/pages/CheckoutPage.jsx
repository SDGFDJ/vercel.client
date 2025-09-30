import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector(state => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector(state => state.cartItem.cart);
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate totalAmt as sum of subTotalAmt from cartItemsList
  const totalAmt = cartItemsList.reduce((sum, item) => sum + (item.subTotalAmt || 0), 0).toFixed(2);

  const getSelectedAddress = () => addressList[selectAddress] || {};

  const handleCashOnDelivery = async () => {
    const selectedAddress = getSelectedAddress();
    if (!selectedAddress?._id) return toast.error("Please select a delivery address");

    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          totalAmt: Number(totalAmt),
          address: {
            name: selectedAddress.name || "Unknown",
            building: selectedAddress.building || "",
            address_line: selectedAddress.address_line || "",
            district: selectedAddress.district || "",
            city: selectedAddress.city || "",
            state: selectedAddress.state || "",
            country: selectedAddress.country || "",
            pincode: selectedAddress.pincode || "",
            mobile: selectedAddress.mobile || ""
          }
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCartItem && fetchCartItem();
        fetchOrder && fetchOrder();
        navigate('/success', { state: { text: "Order" } });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    const selectedAddress = getSelectedAddress();
    if (!selectedAddress?._id) return toast.error("Please select a delivery address");

    try {
      toast.loading("Loading...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: selectedAddress._id,
          subTotalAmt: Number(totalAmt),
          totalAmt: Number(totalAmt)
        }
      });

      const { data: responseData } = response;
      await stripePromise.redirectToCheckout({ sessionId: responseData.id });

      fetchCartItem && fetchCartItem();
      fetchOrder && fetchOrder();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Address Selection */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
            <div className="grid gap-4">
              {addressList.map((address, index) => {
                if (!address.status) return null;
                return (
                  <label
                    key={index}
                    htmlFor={`address${index}`}
                    className="cursor-pointer"
                  >
                    <div
                      className={`border rounded-lg p-4 flex gap-4 transition-all duration-200 ${
                        selectAddress === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        id={`address${index}`}
                        type="radio"
                        value={index}
                        checked={selectAddress === index}
                        onChange={() => setSelectAddress(index)}
                        name="address"
                        className="mt-1"
                      />
                      <div className="text-gray-700">
                        <p className="font-medium">{address.name}</p>
                        <p>{address.building}</p>
                        <p>{address.address_line}</p>
                        <p>
                          {address.city}, {address.district}, {address.state},{' '}
                          {address.country} - {address.pincode}
                        </p>
                        <p>Mobile: {address.mobile}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
              <div
                onClick={() => setOpenAddress(true)}
                className="h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="text-blue-600 font-medium">+ Add New Address</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-200">
              {cartItemsList.map((item, index) => (
                <div key={index} className="flex gap-4 items-center py-4">
                  {item.productId?.image?.length > 0 ? (
                    <img
                      src={item.productId.image[0]}
                      alt={item.productId.name}
                      className="w-16 h-16 object-contain rounded border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded border border-gray-200">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.productId?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      Price: {DisplayPriceInRupees(item.subTotalAmt || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Bill Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-400">
                      {DisplayPriceInRupees(notDiscountTotalPrice)}
                    </span>
                    <span>{DisplayPriceInRupees(totalAmt)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Quantity Total</span>
                  <span>{totalQty} item{totalQty !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span>{DisplayPriceInRupees(totalAmt)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={handleOnlinePayment}
              >
                Pay Online
              </button>
              <button
                className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                onClick={handleCashOnDelivery}
              >
                Cash on Delivery
              </button>
            </div>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;