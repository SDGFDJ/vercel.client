import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProductData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section className="min-h-screen bg-gray-50 p-4">
      {/* Header with Search */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between gap-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Products</h2>
        <div className="w-full max-w-md bg-teal-50 border border-teal-200 rounded-lg flex items-center px-3 py-2 focus-within:ring-2 focus-within:ring-teal-300 transition">
          <IoSearchOutline size={20} className="text-teal-600" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full ml-2 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse h-auto max-h-96 rounded-lg"
              />
            ))}
          </div>
        ) : productData.length > 0 ? (
          <div className="min-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {productData.map((p, index) => (
                <div
                  key={p._id || index}
                  className="h-auto w-full max-h-96 flex flex-col justify-between"
                >
                  <ProductCardAdmin
                    data={p}
                    fetchProductData={fetchProductData}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No products found.
          </div>
        )}

        {/* Pagination */}
        {totalPageCount > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition disabled:opacity-50"
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm font-medium">
              Page {page} of {totalPageCount}
            </span>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition disabled:opacity-50"
              disabled={page === totalPageCount}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductAdmin;
