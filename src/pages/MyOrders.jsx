import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NoData from '../components/NoData';
import { setOrder, updateOrderStatus, removeOrder } from '../redux/orderSlice';

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

  const API_URL = import.meta.env.VITE_API_URL || 'https://vercel-server-umber.vercel.app/api';

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

  useEffect(() => { fetchOrders(); }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      setLoadingOrderId(orderId);
      const { data } = await axios.post(`${API_URL}/order/cancel`, { orderId }, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        dispatch(removeOrder(orderId));
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
        dispatch(updateOrderStatus({ orderId, status }));
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    } finally {
      setLoadingOrderId(null);
    }
  };

  if (isLoading) return <div className="text-center text-gray-600">Loading orders...</div>;

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'newPending') return order.payment_status !== 'COMPLETED' && order.payment_status !== 'CANCELLED';
    if (activeTab === 'completed') return order.payment_status === 'COMPLETED';
    if (activeTab === 'cancelled') return order.payment_status === 'CANCELLED';
    return true;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800"> {user.role === 'ADMIN' ? 'Admin Orders' : 'My Orders'} </h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('newPending')} className={`px-4 py-2 rounded ${activeTab === 'newPending' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}>New / Pending</button>
        <button onClick={() => setActiveTab('completed')} className={`px-4 py-2 rounded ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}>Completed / Delivered</button>
        <button onClick={() => setActiveTab('cancelled')} className={`px-4 py-2 rounded ${activeTab === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}>Cancelled</button>
      </div>

      {filteredOrders.length === 0 ? <NoData /> : (
        filteredOrders.map(order => {
          const productDetails = Array.isArray(order.product_details) ? order.product_details : [order.product_details].filter(Boolean);
          
          return (
            <div key={order.orderId} className="border rounded-lg bg-white shadow-md mb-6 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Order ID: <span className="font-normal">{order.orderId}</span></h2>
                <span className={`text-sm font-medium ${order.payment_status === 'CANCELLED' ? 'text-red-500' : order.payment_status === 'COMPLETED' ? 'text-green-600' : 'text-blue-600'}`}>{order.payment_status}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold">Customer: <span className="font-normal">{order.delivery_address?.name || order.userId?.name || 'Unknown'}</span></p>
                  <p className="text-sm font-semibold">Email: <span className="font-normal">{order.userId?.email || 'N/A'}</span></p>
                  <p className="text-sm font-semibold">Mobile: <span className="font-normal">{order.delivery_address?.mobile || order.userId?.mobile || 'N/A'}</span></p>

                  <p className="text-sm font-semibold mt-2">Delivery Address:</p>
                  <p className="text-sm font-normal">
                    {order.delivery_address?.name || order.userId?.name || ''}, 
                    {order.delivery_address?.building || ''}, 
                    {order.delivery_address?.street || ''}, 
                    {order.delivery_address?.district || ''}, 
                    {order.delivery_address?.city || ''}, 
                    {order.delivery_address?.postalCode || ''}, 
                    {order.delivery_address?.state || ''}, 
                    {order.delivery_address?.country || ''}, 
                    Mobile: {order.delivery_address?.mobile || order.userId?.mobile || 'N/A'}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    Order Date: <span className="font-normal">{order.orderTimeFormatted}</span>
                  </p>
                  <p className="text-sm text-gray-500">({timeAgo(order.createdAt)})</p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Products:</p>
                  {productDetails.length > 0 ? (
                    productDetails.map((product, index) => (
                      <div key={index} className="flex gap-4 items-center mb-4">
                        {product.image?.length > 0 ? (
                          <img src={product.image[0]} alt={product.name} className="w-24 h-24 object-contain border rounded" />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs border rounded">No Image</div>
                        )}
                        <div>
                          <p className="text-sm font-semibold">{product.name || 'Unknown Product'}</p>
                          <p className="text-sm">Qty: {product.quantity || 1}</p>
                          <p className="text-sm">Price: ₹{product.subTotalAmt || 0}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No products found</p>
                  )}
                  <p className="text-sm font-semibold">Total: <span className="font-normal">₹{order.totalAmt}</span></p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Order Status:</p>
                <div className="flex gap-2 flex-wrap">
                  {statusStages.map(stage => {
                    const done = order.statusHistory?.some(s => s.status === stage);
                    return (
                      <div key={stage} className={`flex-1 text-center py-1 text-sm border-b-2 ${done ? 'border-green-500 text-green-600 font-semibold' : 'border-gray-300 text-gray-500'}`}>
                        {stage}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                {user.role !== 'ADMIN' && order.payment_status !== 'CANCELLED' && (
                  <button onClick={() => handleCancelOrder(order.orderId)} disabled={loadingOrderId === order.orderId} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm">
                    {loadingOrderId === order.orderId ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}

                {user.role === 'ADMIN' && statusStages.map(status => (
                  <button key={status} onClick={() => handleUpdateStatus(order.orderId, status)} disabled={loadingOrderId === order.orderId || order.payment_status === 'COMPLETED' || order.payment_status === 'CANCELLED'} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm">
                    {loadingOrderId === order.orderId ? 'Updating...' : status}
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;