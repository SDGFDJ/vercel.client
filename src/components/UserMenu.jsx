import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      if (response.data.success) {
        if (close) close()
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) close()
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-4 w-56 transition-all duration-300">
      {/* Header */}
      <div className="font-semibold text-lg border-b border-gray-700 pb-2 mb-2">My Account</div>
      
      {/* User Info */}
      <div className="text-sm flex items-center gap-2 mb-3">
        <span className="max-w-40 truncate">{user.name || user.mobile} 
          <span className="text-red-400 font-medium">
            {user.role === "ADMIN" ? " (Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="hover:text-blue-400 transition-colors duration-300"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      {/* Menu Links */}
      <div className="text-sm grid gap-1">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subcategory"}
            className="px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-500 transition-all duration-300"
          >
            Sub Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-product"}
            className="px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-green-600 hover:to-teal-500 transition-all duration-300"
          >
            Upload Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className="px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-500 transition-all duration-300"
          >
            Product
          </Link>
        )}
    {/* ✅ My Wishlist Link Added */}
        <Link
          onClick={handleClose}
          to={"/dashboard/mywishlist"}
          className="px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 transition-all duration-300"
        >
          My Wishlist
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/myorders"}
          className="px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-500 transition-all duration-300"
        >
          My Orders
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className="px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-500 transition-all duration-300"
        >
          Save Address
        </Link>

        <button
          onClick={handleLogout}
          className="text-left px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 transition-all duration-300"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}

export default UserMenu
