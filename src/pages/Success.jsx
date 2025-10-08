import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // ✅ SEO

const Success = () => {
  const location = useLocation();

  useEffect(() => {
    // Page top se open ho
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const successText = Boolean(location?.state?.text) ? location.state.text : "Payment";

  return (
    <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      
      {/* ✅ SEO */}
      <Helmet>
        <title>{successText} Success | Binkeyit</title>
        <meta name="description" content={`Your ${successText} was completed successfully. Thank you for choosing Nexebay.`} />
        <meta name="keywords" content="success, payment, Nexebay, order confirmation" />
      </Helmet>

      <p className='text-green-800 font-bold text-lg text-center'>{successText} Successfully</p>
      <Link to="/" className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">
        Go To Home
      </Link>
    </div>
  )
}

export default Success;
