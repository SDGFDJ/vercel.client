import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import { Helmet } from 'react-helmet-async';

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);

  const fetchProductData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  return (
    <section className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Products - Nexebay</title>
        <meta name="description" content="Explore a wide range of products including fashion, electronics, and more on Nexebay." />
        <meta name="keywords" content="Nexebay, Products, Fashion, Electronics, Online Shopping" />
        <link rel="canonical" href="https://www.nexebay.com/products" />
        <meta property="og:title" content="Products - Nexebay" />
        <meta property="og:description" content="Explore a wide range of products including fashion, electronics, and more on Nexebay." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.nexebay.com/products" />
      </Helmet>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        Products
      </h1>

      {productData.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productData.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
              <img
                src={product.image?.[0] || '/placeholder.png'}
                alt={product.name}
                className="w-full h-40 object-contain mb-2"
              />
              <h2 className="font-semibold text-gray-800">{product.name}</h2>
              <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Example */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <span className="px-3 py-1 bg-gray-100 rounded">{page}</span>
        <button
          onClick={() => setPage(prev => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Product;
