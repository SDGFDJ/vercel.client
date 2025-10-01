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
      if (data?.success) dispatch(setOrder(data.data));
      else toast.error('Failed to fetch orders');
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
      } else toast.error(data.message || 'Failed to cancel order');
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
        let payment_status;
        if (status === "DELIVERED") payment_status = "COMPLETED";
        if (status === "CANCELLED") payment_status = "CANCELLED";
        dispatch(updateOrderStatus({ orderId, status, payment_status }));
      } else toast.error(data.message || 'Failed to update status');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    } finally {
      setLoadingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'newPending') return order.payment_status !== 'COMPLETED' && order.payment_status !== 'CANCELLED';
    if (activeTab === 'completed') return order.payment_status === 'COMPLETED';
    if (activeTab === 'cancelled') return order.payment_status === 'CANCELLED';
    return true;
  });

  return (
    <section className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
          {user.role === 'ADMIN' ? 'Manage Orders' : 'Your Orders'}
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-full p-1.5 shadow-sm">
          {['newPending', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 px-3 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'newPending' ? 'New / Pending' : tab === 'completed' ? 'Delivered' : 'Cancelled'}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? <NoData /> : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const productDetails = Array.isArray(order.product_details) ? order.product_details : [order.product_details].filter(Boolean);
              const currentStatusIndex = order.statusHistory
                ? Math.max(...order.statusHistory.map(s => statusStages.indexOf(s.status)), -1)
                : -1;

              return (
                <div key={order.orderId} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">

                  {/* Header */}
                  <div className="bg-blue-600 text-white px-3 py-2 flex justify-between items-center text-sm">
                    <div>
                      <h2 className="font-medium">Order #{order.orderId}</h2>
                      <p className="text-[10px]">{new Date(order.createdAt).toLocaleString()} ({timeAgo(order.createdAt)})</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_status === 'CANCELLED'
                        ? 'bg-red-500/20 text-red-100'
                        : order.payment_status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-100'
                        : 'bg-blue-500/20 text-blue-100'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>

                  {/* Customer & Items */}
                  <div className="p-3 text-xs text-gray-700 space-y-2">
                    <p><span className="font-medium">Customer:</span> {order.delivery_address?.name || order.userId?.name || 'Unknown'}</p>
                    <p><span className="font-medium">Address:</span> {[order.delivery_address?.building, order.delivery_address?.street, order.delivery_address?.city, order.delivery_address?.postalCode].filter(Boolean).join(', ')}</p>
                    <p><span className="font-medium">Mobile:</span> {order.delivery_address?.mobile || order.userId?.mobile || 'N/A'}</p>

                    <h3 className="font-semibold mt-2">Items:</h3>
                    {productDetails.length > 0 ? (
                      productDetails.map((product, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          {product.image?.length > 0 ? (
                            <img src={product.image[0]} alt={product.name} className="w-10 h-10 object-contain rounded border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 rounded border border-gray-200">No Image</div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{product.name || 'Unknown Product'}</p>
                            <p>Qty: {product.quantity || 1}</p>
                            <p>₹{product.subTotalAmt || 0}</p>
                          </div>
                        </div>
                      ))
                    ) : <p>No products found</p>}
                    <p className="font-semibold">Total: <span className="text-blue-600">₹{order.totalAmt}</span></p>
                  </div>

                  {/* Status Progress */}
                  <div className="px-3 pb-3">
                    <h3 className="font-semibold text-gray-800 text-xs mb-2">Order Progress</h3>
                    <div className="flex items-center justify-between relative">
                      {statusStages.map((stage, index) => {
                        const statusObj = order.statusHistory?.find(s => s.status === stage);
                        let isCompleted = !!statusObj;
                        let bgColor = isCompleted ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500';

                        return (
                          <div key={stage} className="flex-1 flex flex-col items-center relative">
                            {/* Circle */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${bgColor} z-10`}>
                              {index + 1}
                            </div>

                            {/* Line */}
                            {index < statusStages.length - 1 && (
                              <div className={`absolute top-3 left-1/2 w-full h-1 -translate-x-1/2 ${order.statusHistory?.some(s => statusStages.indexOf(s.status) > index) ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                            )}

                            {/* Stage Name */}
                            <span className="mt-1 text-[9px] text-center">{stage}</span>

                            {/* Timestamp */}
                            {statusObj && (
                              <span className="mt-0.5 text-[8px] text-gray-500">
                                {new Date(statusObj.updatedAt).toLocaleString()} ({timeAgo(statusObj.updatedAt)})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-3 pb-3 flex flex-wrap gap-2">
                    {user.role !== 'ADMIN' && order.payment_status !== 'CANCELLED' && order.payment_status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={loadingOrderId === order.orderId}
                        className="px-2 py-1 bg-red-500 text-white rounded-full text-[10px] font-medium hover:bg-red-600 disabled:opacity-50"
                      >
                        {loadingOrderId === order.orderId ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}

                    {user.role === 'ADMIN' && statusStages
                      .filter((status, idx) => {
                        if (order.payment_status === 'COMPLETED' || order.payment_status === 'CANCELLED') return false;
                        return idx > currentStatusIndex;
                      })
                      .map(status => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(order.orderId, status)}
                          disabled={loadingOrderId === order.orderId}
                          className="px-2 py-1 bg-blue-500 text-white rounded-full text-[10px] font-medium hover:bg-blue-600 disabled:opacity-50"
                        >
                          {loadingOrderId === order.orderId ? 'Updating...' : status}
                        </button>
                      ))
                    }
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
