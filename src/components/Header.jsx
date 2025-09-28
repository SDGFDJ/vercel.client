import React, { useState, useEffect } from 'react';
import logo from '../assets/logo1.png';
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { FaHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import UserMenu from './UserMenu';
import { IoClose } from "react-icons/io5";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const cartItem = useSelector(state => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();

  // States
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
    setOpenUserDrawer(true); // सिर्फ click पर open
  };

  const goToWishlist = () => navigate("/dashboard/mywishlist");

  // Toast function
  const showToast = (msg, duration = 2500) => {
    setToastMessage(msg);
    // Auto hide after duration
    setTimeout(() => setToastMessage(""), duration);
  };

  // Example: login/logout trigger
  useEffect(() => {
    // अगर user login हो गया, toast show
    if (user?._id) {
      showToast("Login successful!", 2000);
    } else if (!user?._id && toastMessage === "") {
      showToast("Logout successful!", 2000);
    }
    // eslint-disable-next-line
  }, [user]); // user state change होने पर trigger

  return (
    <header className='h-24 lg:h-20 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-500'>
      
      {/* Header */}
      {!(isSearchPage && isMobile) && (
        <div className='container mx-auto flex items-center px-4 justify-between'>
          {/* Logo */}
          <Link to={"/"} className='h-full flex items-center group'>
            <img src={logo} width={200} height={60} alt='logo'
              className='transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]' />
          </Link>

          {/* Desktop Search */}
          <div className='hidden lg:block w-full max-w-md'>
            <Search className="w-full rounded-lg border-2 border-gray-200 focus:border-blue-400 shadow-md transition duration-300" />
          </div>

          {/* Icons */}
          <div className='flex items-center gap-4 lg:gap-10'>
            {/* Mobile User */}
            <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
              <FaRegCircleUser size={28} className="hover:text-blue-600 transition-colors duration-300" />
            </button>

            {/* Wishlist */}
            <button onClick={goToWishlist} className='flex items-center text-red-500 hover:text-red-600 transition-colors duration-300'>
              <FaHeart size={26} />
            </button>

            {/* Desktop Account & Cart */}
            <div className='hidden lg:flex items-center gap-6 relative'>
              {user?._id ? (
                <div className='relative'>
                  <div onClick={() => setOpenUserDropdown(prev => !prev)}
                    className='flex items-center gap-1 cursor-pointer font-semibold hover:text-purple-600 transition-colors duration-300 select-none'>
                    Account
                  </div>
                  {openUserDropdown && (
                    <div className='absolute right-0 top-10 w-56 bg-white shadow-xl rounded-xl p-4 border border-gray-100 z-50'>
                      <UserMenu close={() => setOpenUserDropdown(false)} />
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage}
                  className='px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg hover:scale-110'>
                  Login
                </button>
              )}

              <button onClick={() => setOpenCartSection(true)}
                className='flex items-center gap-2 bg-gradient-to-r from-green-600 via-teal-500 to-emerald-500 px-4 py-2 rounded-xl text-white font-medium shadow-lg hover:scale-110'>
                <BsCart4 size={26} />
                <div className='text-sm font-semibold'>
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : <p>My Cart</p>}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search */}
      <div className='container mx-auto px-2 lg:hidden'><Search /></div>

      {/* Cart Drawer */}
      {openCartSection && <DisplayCartItem close={() => setOpenCartSection(false)} />}

      {/* Mobile User Drawer */}
      {openUserDrawer && (
        <>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button onClick={() => setOpenUserDrawer(false)} className="text-gray-600 hover:text-gray-800">
                <IoClose size={24} />
              </button>
              <h2 className="font-semibold text-lg">My Account</h2>
              <div className="w-5"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <UserMenu close={() => setOpenUserDrawer(false)} />
            </div>
          </div>

          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpenUserDrawer(false)}></div>
        </>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeInOut">
            {toastMessage}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
