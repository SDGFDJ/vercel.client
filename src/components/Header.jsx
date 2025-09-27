import React, { useState } from 'react'
import logo from '../assets/logo1.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const isSearchPage = location.pathname === "/search"
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const { totalPrice, totalQty } = useGlobalContext()
  const [openCartSection, setOpenCartSection] = useState(false)

  const redirectToLoginPage = () => {
    navigate("/login")
  }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login")
      return
    }
    navigate("/user")
  }

  return (
    <header className='h-24 lg:h-20 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-500'>
      {
        !(isSearchPage && isMobile) && (
          <div className='container mx-auto flex items-center px-4 justify-between'>

            {/* logo */}
            <div className='h-full'>
              <Link to={"/"} className='h-full flex justify-start items-center group'>
                <img
                  src={logo}
                  width={200}
                  height={60}
                  alt='logo'
                  className='transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]'
                />
              </Link>
            </div>

            {/* Search */}
            <div className='hidden lg:block w-full max-w-md'>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative">
                  <Search className="w-full rounded-lg border-2 border-gray-200 focus:border-blue-400 shadow-md transition duration-300" />
                </div>
              </div>
            </div>

            {/* login and my cart */}
            <div>
              {/* user icons display in only mobile version */}
              <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                <FaRegCircleUser size={28} className="hover:text-blue-600 transition-colors duration-300" />
              </button>

              {/* Desktop */}
              <div className='hidden lg:flex items-center gap-10'>
                {
                  user?._id ? (
                    <div className='relative'>
                      <div 
                        onClick={() => setOpenUserMenu(preve => !preve)} 
                        className='flex select-none items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors duration-300'
                      >
                        <p className="font-semibold">Account</p>
                        {
                          openUserMenu ? (
                            <GoTriangleUp size={22} />
                          ) : (
                            <GoTriangleDown size={22} />
                          )
                        }
                      </div>
                      {
                        openUserMenu && (
                          <div className='absolute right-0 top-12 animate-fadeIn'>
                            <div className='bg-white rounded-xl p-4 min-w-52 shadow-2xl border border-gray-100'>
                              <UserMenu close={handleCloseUserMenu} />
                            </div>
                          </div>
                        )
                      }
                    </div>
                  ) : (
                    <button
                      onClick={redirectToLoginPage}
                      className='relative px-6 py-2 text-white font-semibold rounded-lg 
                      bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
                      shadow-lg transform transition-all duration-500 
                      hover:scale-110 hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] overflow-hidden'
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg opacity-0 hover:opacity-100 transition duration-700"></span>
                      <span className="relative z-10">Login</span>
                    </button>
                  )
                }

                {/* cart */}
                <button 
                  onClick={() => setOpenCartSection(true)} 
                  className='flex items-center gap-2 bg-gradient-to-r from-green-600 via-teal-500 to-emerald-500 
                  hover:from-green-500 hover:via-teal-400 hover:to-emerald-400 
                  px-4 py-2 rounded-xl text-white font-medium shadow-lg 
                  transition transform hover:scale-110 hover:shadow-2xl'
                >
                  <div className='animate-bounce'>
                    <BsCart4 size={26} />
                  </div>
                  <div className='text-sm font-semibold'>
                    {
                      cartItem[0] ? (
                        <div>
                          <p>{totalQty} Items</p>
                          <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                      ) : (
                        <p>My Cart</p>
                      )
                    }
                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      }

      <div className='container mx-auto px-2 lg:hidden'>
        <Search />
      </div>

      {
        openCartSection && (
          <DisplayCartItem close={() => setOpenCartSection(false)} />
        )
      }
    </header>
  )
}

export default Header
