import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const StatusMessage = ({ status = 'Cancelled', color = 'red' }) => {
  const { orderId } = useParams();
  const textColor = color === 'red' ? 'text-red-800' : 'text-green-800';
  const bgColor = color === 'red' ? 'bg-red-200' : 'bg-green-200';
  const borderColor = color === 'red' ? 'border-red-900' : 'border-green-900';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* SEO Tags */}
      <Helmet>
        <title>Order {orderId ? `#${orderId}` : ''} {status} - Nexebay</title>
        <meta
          name="description"
          content={`Your order ${orderId ? `#${orderId}` : ''} has been ${status.toLowerCase()}. Track your orders and manage them easily on Nexebay.`}
        />
        <meta name="keywords" content="Nexebay, order status, cancelled order, successful order, track order, e-commerce" />
        <link rel="canonical" href={`https://www.nexebay.com/order/${orderId}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Order",
            "orderNumber": orderId || "N/A",
            "orderStatus": status === "Cancelled" ? "http://schema.org/OrderCancelled" : "http://schema.org/OrderDelivered",
            "merchant": {
              "@type": "Organization",
              "name": "Nexebay",
              "url": "https://www.nexebay.com"
            }
          })}
        </script>
      </Helmet>

      <div className={`m-4 w-full max-w-md ${bgColor} p-6 rounded mx-auto flex flex-col justify-center items-center gap-6 shadow-md`}>
        <p className={`font-bold text-xl md:text-2xl text-center ${textColor}`}>
          Order {orderId ? `#${orderId}` : ''} {status}
        </p>
        <Link
          to="/"
          className={`border ${borderColor} ${textColor} hover:${bgColor.replace('200','900')} hover:text-white transition-all px-5 py-2 rounded`}
          aria-label="Return to homepage"
        >
          Go To Home
        </Link>
      </div>
    </>
  );
};

export default StatusMessage;
