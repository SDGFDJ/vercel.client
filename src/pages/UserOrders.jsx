import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import { Helmet } from "react-helmet-async"; // ✅ SEO

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Page top se open hone ke liye
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await Axios.get("/api/orders"); // backend user orders route
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, []);

  return (
    <div className="p-6">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>My Orders | Binkeyit</title>
        <meta
          name="description"
          content="View all your orders, order details, and status in your Nexebay account."
        />
        <meta
          name="keywords"
          content="user orders, my orders, order status, Nexebay"
        />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">{order.totalAmt}</td>
                <td className="border p-2">{order.payment_status}</td>
                <td className="border p-2">
                  {order.product_details?.name || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrders;
