import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0 });

  const fetchStats = async () => {
    try {
      const ordersRes = await Axios(SummaryApi.getAllOrders);
      const usersRes = await Axios(SummaryApi.getAllUsers);

      if (ordersRes.data.success && usersRes.data.success) {
        setStats({
          totalOrders: ordersRes.data.data.length,
          totalUsers: usersRes.data.data.length
        });
      }
    } catch (error) {
      toast.error("Failed to fetch stats");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-5">
        <div className="p-5 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-xl">{stats.totalOrders}</p>
        </div>
        <div className="p-5 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-xl">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
