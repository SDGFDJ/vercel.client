import React, { useEffect } from 'react';
import UserMenu from '../components/UserMenu';
import { IoClose } from "react-icons/io5";
import { Helmet } from 'react-helmet-async'; // ✅ SEO

const UserMenuMobile = () => {
  
  // ✅ Page top se open hone ke liye
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className='bg-white h-full w-full py-2'>
      {/* ✅ SEO */}
      <Helmet>
        <title>User Menu | Nexebay</title>
        <meta name="description" content="Access your account settings, orders, and preferences using the mobile user menu." />
        <meta name="keywords" content="user menu, account settings, mobile menu, Nexebay" />
      </Helmet>

      <button onClick={()=>window.history.back()} className='text-neutral-800 block w-fit ml-auto'>
        <IoClose size={25}/>
      </button>
      <div className='container mx-auto px-3 pb-8'>
         <UserMenu/>
      </div>
    </section>
  )
}

export default UserMenuMobile;
