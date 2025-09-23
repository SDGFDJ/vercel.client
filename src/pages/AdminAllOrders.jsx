import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";

const statusStages = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await Axios.get("/api/order/order-list"); // direct API call
      if (res.data.success) {
        setOrders(res.data.data || []);
      } else {
        toast.error(res.data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      setLoadingOrderId(orderId);
      const { data } = await Axios.post("/api/order/update-status", { orderId, status });
      if (data.success) {
        toast.success(data.message);
        fetchOrders(); // refresh orders
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">All Users Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Order ID</th>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-2 py-1">{order.orderId || "N/A"}</td>
                <td className="border px-2 py-1">{order.userId?.name || "Unknown User"}</td>
                <td className="border px-2 py-1">{order.product_details?.name || "Unknown Product"}</td>
                <td className="border px-2 py-1">{order.quantity || 1}</td>
                <td className="border px-2 py-1">{order.totalAmt || 0}</td>
                <td className="border px-2 py-1">{order.delivery_address?.address || "N/A"}</td>
                <td className="border px-2 py-1">{order.payment_status || "Pending"}</td>
                <td className="border px-2 py-1 flex gap-1 flex-wrap">
                  {statusStages.map((status) => (
                    <button
                      key={status}
                      disabled={
                        order.payment_status === "DELIVERED" ||
                        order.payment_status === "CANCELLED" ||
                        loadingOrderId === order._id
                      }
                      onClick={() => handleUpdateStatus(order._id, status)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {loadingOrderId === order._id ? "Updating..." : status}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAllOrders;
