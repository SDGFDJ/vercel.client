import React, { useState, useEffect } from "react";
import logo from "../assets/logo6.jpg";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const handleUserClick = () => {
    if (!user._id) {
      showToast("Login required!");
      return navigate("/login");
    }
    if (isMobile) setOpenUserDrawer(true);
    else setOpenUserDropdown((prev) => !prev);
  };

  const goToWishlist = () => navigate("/dashboard/mywishlist");

  const showToast = (msg, duration = 2500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), duration);
  };

  useEffect(() => {
    if (user?._id) showToast("Login successful!", 2000);
    else if (!user?._id && toastMessage === "") showToast("Logout successful!", 2000);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg shadow text-sm z-50">
          {toastMessage}
        </div>
      )}

      {/* Top Section */}
      {!(isSearchPage && isMobile) && (
        <div className="flex items-center justify-between w-full max-w-full mx-auto px-2 sm:px-4 py-2 gap-2 lg:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <img
              src={logo}
              alt="logo"
              className="h-10 sm:h-12 w-auto transition-transform duration-300 hover:scale-105"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 truncate">
                Nexebay
              </span>
              <span className="text-xs text-gray-500 -mt-0.5 truncate">Fashion & More</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 mx-2 hidden lg:flex min-w-0">
            <Search className="w-full rounded-full border border-gray-200 shadow-sm px-3 py-2 min-w-0" />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
            {/* Wishlist */}
            <button
              onClick={goToWishlist}
              className="p-2 rounded-full hover:bg-gray-100 text-red-500 flex-shrink-0"
            >
              <FaHeart size={22} />
            </button>

            {/* User Avatar */}
            <div className="relative flex-shrink-0 min-w-0">
              <button
                onClick={handleUserClick}
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-50 border hover:bg-gray-100 transition max-w-[140px] sm:max-w-[160px] truncate"
              >
                <img
                  src={user?.avatar || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <span className="text-sm font-medium truncate hidden lg:inline">
                  {user?.username || "Account"}
                </span>
              </button>

              {/* Desktop Dropdown */}
              {openUserDropdown && !isMobile && (
                <div className="absolute right-0 top-12 w-56 bg-white shadow-xl rounded-xl p-4 border border-gray-100 z-50">
                  <UserMenu close={() => setOpenUserDropdown(false)} />
                </div>
              )}
            </div>

            {/* Cart (only desktop) */}
            {!isMobile && (
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium shadow hover:scale-105 transition flex-shrink-0 min-w-0"
              >
                <BsCart4 size={22} />
                <div className="text-sm flex flex-col min-w-0">
                  {cartItem[0] ? (
                    <>
                      <p className="truncate">{totalQty} Items</p>
                      <p className="truncate">{DisplayPriceInRupees(totalPrice)}</p>
                    </>
                  ) : (
                    <p className="truncate">My Cart</p>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search */}
      <div className="px-2 sm:px-3 lg:hidden py-2">
        <Search />
      </div>

      {/* Mobile Cart Drawer */}
      {openCartSection && (
        <>
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
