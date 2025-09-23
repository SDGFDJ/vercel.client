import React, { useEffect, useState } from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { io } from "socket.io-client"

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  useEffect(() => {
    if (!user.role || user.role !== "ADMIN") return

    // Socket.io connection
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080"
    const socket = io(SOCKET_URL)

    socket.on("connect", () => console.log("Socket connected"))

    socket.on("new-order", (data) => {
      console.log("New order received in Dashboard:", data)
      
      // Increase badge count
      setNewOrdersCount(prev => prev + 1)

      // ---------------- BROWSER NOTIFICATION ----------------
      if (Notification.permission === "granted") {
        new Notification("🛒 New Order Received", {
          body: `Order ID: ${data.orderId}\nTotal Amount: ₹${data.totalAmt}`,
          icon: "/logo.png" // optional: site logo
        })
      }
    })

    // Request permission on mount
    if (Notification.permission !== "granted") {
      Notification.requestPermission()
    }

    return () => socket.disconnect()
  }, [user.role])

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

      <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr]'>
        <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
          <UserMenu />
        </div>

        <div className='bg-white min-h-[75vh]'>
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default Dashboard
