import React from 'react';
import DisplayCartItem from '../components/DisplayCartItem';
import { Helmet } from 'react-helmet-async';

const CartMobile = () => {
  return (
    <>
      {/* SEO Tags */}
      <Helmet>
        <title>My Cart - Nexebay</title>
        <meta
          name="description"
          content="View and manage items in your shopping cart at Nexebay. Update quantities, remove items, and proceed to secure checkout."
        />
        <meta
          name="keywords"
          content="Nexebay, shopping cart, cart items, checkout, online shopping, manage cart"
        />
        <link rel="canonical" href="https://www.nexebay.com/cart" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ShoppingCart",
            "name": "User Shopping Cart",
            "url": "https://www.nexebay.com/cart",
            "description": "Items added by the user to their cart at Nexebay for checkout.",
          })}
        </script>
      </Helmet>

      {/* Main Cart Component */}
      <DisplayCartItem />
    </>
  );
};

export default CartMobile;
