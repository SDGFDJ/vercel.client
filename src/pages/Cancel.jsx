import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const StatusMessage = ({ status = 'Cancelled', color = 'red' }) => {
  const { orderId } = useParams();
  const textColor = color === 'red' ? 'text-red-800' : 'text-green-800';
  const bgColor = color === 'red' ? 'bg-red-200' : 'bg-green-200';
  const borderColor = color === 'red' ? 'border-red-900' : 'border-green-900';

  // ✅ Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={`m-2 w-full max-w-md ${bgColor} p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5`}>
      <p className={`font-bold text-lg text-center ${textColor}`}>
        Order {orderId ? `#${orderId}` : ''} {status}
      </p>
      <Link
        to="/"
        className={`border ${borderColor} ${textColor} hover:${bgColor.replace('200','900')} hover:text-white transition-all px-4 py-1`}
        aria-label="Return to homepage"
      >
        Go To Home
      </Link>
    </div>
  );
};

export default StatusMessage;
