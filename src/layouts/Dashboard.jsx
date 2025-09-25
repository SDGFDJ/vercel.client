import React, { useEffect, useState } from 'react';
import UserMenu from '../components/UserMenu';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { socket } from '../utils/socket';

const Dashboard = () => {
  const user = useSelector(state => state.user);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    if (!user.role || user.role !== "ADMIN") return;

    // Request notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Listen for new order events
    socket.on("new-order", (data) => {
      console.log("New order received:", data);

      // Update badge count
      setNewOrdersCount(prev => prev + 1);

      // Browser notification
      if (Notification.permission === "granted") {
        new Notification("🛒 New Order Received", {
          body: `Order ID: ${data.orderId}\nTotal Amount: ₹${data.totalAmt}`,
          icon: "/logo192.png"
        });
      }
    });

    return () => socket.off("new-order");
  }, [user.role]);

  return (
    <section className='bg-white'>
      <div className='flex justify-between items-center p-3 border-b'>
        <h2 className='font-bold text-lg'>Dashboard</h2>
        {user.role === "ADMIN" && newOrdersCount > 0 && (
          <div className='bg-red-600 text-white px-3 py-1 rounded-full text-sm'>
            New Orders: {newOrdersCount}
          </div>
        )}
      </div>

      <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr] gap-4'>
        {/* Sidebar */}
        <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
          <UserMenu />
        </div>

        {/* Main Content */}
        <div className='bg-white min-h-[75vh]'>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
