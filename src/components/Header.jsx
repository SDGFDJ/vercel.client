import React, { useState, useEffect } from "react";
import logo from "../assets/logo3.jpeg";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import useMobile from "../hooks/useMobile";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();

  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();

  const [openCartSection, setOpenCartSection] = useState(false);
  const [openUserDrawer, setOpenUserDrawer] = useState(false);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const redirectToLoginPage = () => navigate("/login");

  const handleMobileUser = () => {
    if (!user._id) {
      showToast("Login required!");
      return navigate("/login");
    }
    setOpenUserDrawer(true);
  };

  const goToWishlist = () => navigate("/dashboard/mywishlist");

  const showToast = (msg, duration = 2500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), duration);
  };

  useEffect(() => {
    if (user?._id) {
      showToast("Login successful!", 2000);
    } else if (!user?._id && toastMessage === "") {
      showToast("Logout successful!", 2000);
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg shadow z-50 text-sm">
          {toastMessage}
        </div>
      )}

    {/* Top Section */}
{!(isSearchPage && isMobile) && (
  <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
    
    {/* Logo - Fix Left */}
    <Link to={"/"} className="flex items-center gap-2 mr-auto">
      <img
        src={logo}
        alt="logo"
        className="h-12 w-auto transition-transform duration-300 hover:scale-105"
      />
      <div className="hidden sm:flex flex-col">
        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Trendify
        </span>
        <span className="text-xs text-gray-500 -mt-1">Fashion & More</span>
      </div>
    </Link>

    {/* Search bar in middle */}
    <div className="hidden lg:block flex-1 mx-6">
      <Search className="w-full rounded-full border border-gray-200 shadow-sm px-3 py-2" />
    </div>

    {/* Right side icons */}
    <div className="flex items-center gap-4 lg:gap-6 ml-auto">
      <button
        onClick={goToWishlist}
        className="p-2 rounded-full hover:bg-gray-100 text-red-500"
        aria-label="Wishlist"
      >
        <FaHeart size={22} />
      </button>

            {/* Desktop User & Cart */}
            <div className="hidden lg:flex items-center gap-4">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserDropdown((p) => !p)}
                    className="flex items-center gap-1 cursor-pointer px-3 py-1 rounded-full bg-gray-50 border hover:bg-gray-100 transition"
                  >
                    <img
                      src={user?.avatar || "https://via.placeholder.com/40"}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold">
                      {user?.username || "Account"}
                    </span>
                  </div>
                  {openUserDropdown && (
                    <div className="absolute right-0 top-12 w-56 bg-white shadow-xl rounded-xl p-4 border border-gray-100 z-50">
                      <UserMenu close={() => setOpenUserDropdown(false)} />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="px-5 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow hover:scale-105 transition"
                >
                  Login
                </button>
              )}

              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium shadow hover:scale-105 transition"
              >
                <BsCart4 size={22} />
                <div className="text-sm">
                  {cartItem[0] ? (
                    <>
                      <p>{totalQty} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>

            {/* Mobile User */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-700"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={24} />
            </button>

          
          </div>
        </div>
      )}

      {/* Mobile Search */}
      <div className="container mx-auto px-3 lg:hidden">
        <Search />
      </div>

      {/* Mobile Cart Drawer */}
      {openCartSection && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpenCartSection(false)}
          />

          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={() => setOpenCartSection(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <IoClose size={24} />
              </button>
              <h2 className="font-semibold text-lg">My Cart</h2>
              <div className="w-5"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <DisplayCartItem close={() => setOpenCartSection(false)} />
            </div>
          </div>
        </>
      )}

      {/* Mobile User Drawer */}
      {openUserDrawer && (
        <>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={() => setOpenUserDrawer(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <IoClose size={24} />
              </button>
              <h2 className="font-semibold text-lg">My Account</h2>
              <div className="w-5"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <UserMenu close={() => setOpenUserDrawer(false)} />
            </div>
          </div>

          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpenUserDrawer(false)}
          />
        </>
      )}
    </header>
  );
};

export default Header;
