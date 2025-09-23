import React, { useState } from 'react';
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
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {addressList.map((address, index) => {
              if (!address.status) return null;
              return (
                <label key={index} htmlFor={"address" + index} className='cursor-pointer'>
                  <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                    <input
                      id={"address" + index}
                      type='radio'
                      value={index}
                      checked={selectAddress === index}
                      onChange={() => setSelectAddress(index)}
                      name='address'
                    />
                    <div className='ml-2'>
                      <p><strong>Name:</strong> {address.name}</p>
                      <p><strong>Building/House No:</strong> {address.building}</p>
                      <p><strong>Address:</strong> {address.address_line}</p>
                      <p><strong>District:</strong> {address.district}</p>
                      <p><strong>City:</strong> {address.city}</p>
                      <p><strong>State:</strong> {address.state}</p>
                      <p><strong>Country:</strong> {address.country}</p>
                      <p><strong>Pincode:</strong> {address.pincode}</p>
                      <p><strong>Mobile:</strong> {address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>
        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>
          <h3 className='text-lg font-semibold'>Order Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Cart Items</h3>
            {cartItemsList.map((item, index) => (
              <div key={index} className='flex gap-4 items-center mb-4 border-b pb-2'>
                {item.productId?.image?.length > 0 ? (
                  <img src={item.productId.image[0]} alt={item.productId.name} className='w-16 h-16 object-contain border rounded' />
                ) : (
                  <div className='w-16 h-16 bg-gray-200 flex items-center justify-center text-xs border rounded'>No Image</div>
                )}
                <div>
                  <p className='font-semibold'>{item.productId?.name || 'Unknown Product'}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: {DisplayPriceInRupees(item.subTotalAmt || 0)}</p>
                </div>
              </div>
            ))}
            <h3 className='font-semibold mt-4'>Bill Details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'>
                <span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span>{DisplayPriceInRupees(totalAmt)}</span>
              </p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quantity total</p>
              <p>{totalQty} item{totalQty !== 1 ? 's' : ''}</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalAmt)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4 mt-4'>
            <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' onClick={handleOnlinePayment}>
              Online Payment
            </button>
            <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;