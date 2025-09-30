import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NoData from '../components/NoData';
import { setOrder, updateOrderStatus } from '../redux/orderSlice';

const statusStages = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const timeAgo = (date) => {
  const now = new Date();
  const orderDate = new Date(date);
  const diff = now - orderDate;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
};

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order) || [];
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState('newPending');
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL1;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_URL}/order/order-list`, { withCredentials: true });
      if (data?.success) {
        dispatch(setOrder(data.data));
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      setLoadingOrderId(orderId);
      const { data } = await axios.post(`${API_URL}/order/cancel`, { orderId }, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        dispatch(updateOrderStatus({ orderId, status: "CANCELLED", payment_status: "CANCELLED" }));
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelling order');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setLoadingOrderId(orderId);
      const { data } = await axios.post(`${API_URL}/order/admin/update-status`, { orderId, status }, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);

        let payment_status = undefined;
        if (status === "DELIVERED") payment_status = "COMPLETED";
        if (status === "CANCELLED") payment_status = "CANCELLED";

        dispatch(updateOrderStatus({ orderId, status, payment_status }));
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    } finally {
      setLoadingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="text-gray-700 text-lg font-semibold animate-pulse flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"></path>
          </svg>
          Loading orders...
        </div>
      </div>
    );
  }

 // ✅ Filter logic updated for all tabs
const filteredOrders = orders.filter(order => {
  if (activeTab === 'newPending') return order.payment_status !== 'COMPLETED' && order.payment_status !== 'CANCELLED';
  if (activeTab === 'completed') return order.payment_status === 'COMPLETED';
  if (activeTab === 'cancelled') return order.payment_status === 'CANCELLED';
  return true;
});


  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          {user.role === 'ADMIN' ? 'Manage Orders' : 'Your Orders'}
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white rounded-full p-1.5 shadow-sm">
          {['newPending', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'newPending' ? 'New / Pending' : tab === 'completed' ? 'Delivered' : 'Cancelled'}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <NoData />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const productDetails = Array.isArray(order.product_details)
                ? order.product_details
                : [order.product_details].filter(Boolean);
              const currentStatusIndex = order.statusHistory
                ? Math.max(...order.statusHistory.map(s => statusStages.indexOf(s.status)), -1)
                : -1;

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-semibold">
                        Order #{order.orderId}
                      </h2>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.payment_status === 'CANCELLED'
                            ? 'bg-red-500/20 text-red-100'
                            : order.payment_status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-100'
                            : 'bg-blue-500/20 text-blue-100'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 mt-1">
                      {timeAgo(order.createdAt)} • {order.orderTimeFormatted}
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Customer:</span>{' '}
                            {order.delivery_address?.name || order.userId?.name || 'Unknown'}
                          </p>
                          <p>
                            <span className="font-medium">Address:</span>{' '}
                            {[order.delivery_address?.building, order.delivery_address?.street, order.delivery_address?.city, order.delivery_address?.postalCode]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          <p>
                            <span className="font-medium">Mobile:</span>{' '}
                            {order.delivery_address?.mobile || order.userId?.mobile || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-semibold text-gray-800 mb-2">Items</h3>
                        {productDetails.length > 0 ? (
                          productDetails.map((product, index) => (
                            <div key={index} className="flex gap-3 items-center mb-3">
                              {product.image?.length > 0 ? (
                                <img
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-contain rounded-md border border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 rounded-md border border-gray-200">
                                  No Image
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-800">
                                  {product.name || 'Unknown Product'}
                                </p>
                                <p className="text-xs text-gray-600">Qty: {product.quantity || 1}</p>
                                <p className="text-xs text-gray-600">₹{product.subTotalAmt || 0}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No products found</p>
                        )}
                        <p className="text-xs font-semibold text-gray-800">
                          Total: <span className="text-blue-600">₹{order.totalAmt}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-xs font-semibold text-gray-800 mb-2">Order Status</h3>
                      <div className="relative flex items-center">
                        {statusStages.map((stage, index) => (
                          <div key={stage} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                                order.statusHistory?.some(s => s.status === stage)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {index + 1}
                            </div>
                            <p className="text-[10px] text-gray-600 mt-1 text-center">{stage}</p>
                            {index < statusStages.length - 1 && (
                              <div
                                className={`absolute top-3 h-0.5 w-[calc(100%/${statusStages.length-1})] ${
                                  order.statusHistory?.some(s => s.status === statusStages[index + 1])
                                    ? 'bg-blue-500'
                                    : 'bg-gray-200'
                                }`}
                                style={{ left: `calc(${index} * 100% / ${statusStages.length - 1})` }}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      {/* User Cancel Button */}
                      {user.role !== 'ADMIN' && order.payment_status !== 'CANCELLED' && order.payment_status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={loadingOrderId === order.orderId}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 disabled:opacity-50 transition-all duration-300"
                        >
                          {loadingOrderId === order.orderId ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}

                      {/* Admin Status Buttons */}
                      {user.role === 'ADMIN' && (
                        <div className="flex gap-2 flex-wrap">
                          {statusStages
                            .filter((status, idx) => {
                              if (order.payment_status === 'COMPLETED' || order.payment_status === 'CANCELLED') return false;
                              return idx > currentStatusIndex; // सिर्फ आगे वाले दिखाएं
                            })
                            .map(status => (
                              <button
                                key={status}
                                onClick={() => handleUpdateStatus(order.orderId, status)}
                                disabled={loadingOrderId === order.orderId}
                                className="px-2 py-1 bg-blue-500 text-white rounded-full text-[10px] font-medium hover:bg-blue-600 disabled:opacity-50 transition-all duration-300"
                              >
                                {loadingOrderId === order.orderId ? 'Updating...' : `Set ${status}`}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
