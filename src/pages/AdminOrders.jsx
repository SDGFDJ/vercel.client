import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const statusStages = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await Axios(SummaryApi.getAllOrders);
      if (res.data.success) setOrders(res.data.data);
      else toast.error("Failed to fetch orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching orders");
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setLoadingOrderId(orderId);
      const res = await Axios.post(SummaryApi.updateOrderStatus, { orderId, status });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchOrders(); // Refresh list
      } else toast.error(res.data.message || "Failed to update status");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Orders (Admin)</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.orderId} className="border rounded-lg p-6 bg-white shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Order ID: <span className="font-normal">{order.orderId}</span></p>
                  <p className="text-sm font-semibold text-gray-700">Customer: <span className="font-normal">{order.userId?.name || 'Unknown'}</span></p>
                  <p className="text-sm font-semibold text-gray-700">Email: <span className="font-normal">{order.userId?.email || 'N/A'}</span></p>
                  <p className="text-sm font-semibold text-gray-700">Mobile: <span className="font-normal">{order.userId?.mobile || 'N/A'}</span></p>
                  <p className="text-sm font-semibold text-gray-700">Address: <span className="font-normal">
                    {order.delivery_address ? 
                      `${order.delivery_address.street}, ${order.delivery_address.city}, ${order.delivery_address.state} ${order.delivery_address.postalCode}` : 
                      'N/A'}
                  </span></p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Product: <span className="font-normal">{order.product_details?.name || 'Unknown Product'}</span></p>
                  <p className="text-sm font-semibold text-gray-700">Quantity: <span className="font-normal">{order.quantity || 1}</span></p>
                  <p className="text-sm font-semibold text-gray-700">Price: <span className="font-normal">₹{order.totalAmt || 0}</span></p>
                  <p className="text-sm font-semibold text-gray-700">Status: 
                    <span className={`ml-2 font-normal ${order.payment_status === 'CANCELLED' ? 'text-red-500' : order.payment_status === 'COMPLETED' ? 'text-green-600' : 'text-blue-600'}`}>
                      {order.payment_status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Status History:</p>
                <div className="flex gap-2 flex-wrap">
                  {statusStages.map(status => {
                    const done = order.statusHistory?.some(s => s.status === status);
                    return (
                      <div
                        key={status}
                        className={`flex-1 text-center py-1 text-sm border-b-2 ${done ? 'border-green-500 text-green-600 font-semibold' : 'border-gray-300 text-gray-500'}`}
                      >
                        {status}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                {statusStages.map(status => (
                  <button
                    key={status}
                    disabled={loadingOrderId === order.orderId || order.payment_status === "COMPLETED" || order.payment_status === "CANCELLED"}
                    className={`px-3 py-1 text-sm rounded transition-colors ${loadingOrderId === order.orderId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50`}
                    onClick={() => handleUpdateStatus(order.orderId, status)}
                  >
                    {loadingOrderId === order.orderId ? "Updating..." : status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;