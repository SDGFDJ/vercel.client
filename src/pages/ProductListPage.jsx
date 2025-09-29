import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { IoClose, IoFilter } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState("");

  // Drawer state
  const [showFilter, setShowFilter] = useState(false);

  const params = useParams();
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  // Fetch products
  const fetchProductdata = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 12,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => [...prev, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      } else {
        setError("Failed to load products.");
      }
    } catch (error) {
      setError("An error occurred while fetching products.");
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params, page]);

  // Filter subcategories based on category
  useEffect(() => {
    const sub = allSubCategory.filter((s) =>
      s.category.some((el) => el._id === categoryId)
    );
    setDisplaySubCategory(sub);
  }, [params, allSubCategory]);

  // Apply Filters
  useEffect(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock === true);
    }

    // Sorting
    if (sortOption === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredData(filtered);
  }, [searchTerm, minPrice, maxPrice, inStockOnly, sortOption, data]);

  // Reset filters
  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortOption("");
    setSearchTerm("");
  };

  // Handle drawer toggle
  const toggleFilterDrawer = () => setShowFilter(!showFilter);

  return (
    <section className="container mx-auto px-4 py-6 sticky top-16 lg:top-20">
      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block bg-white shadow-lg rounded-xl p-6 min-h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <h4 className="font-bold text-lg mb-4 text-gray-800">Sub Categories</h4>
          {displaySubCategory.map((s) => {
            const link = `/${valideURLConvert(
              s?.category[0]?.name
            )}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`;
            return (
              <Link
                key={s._id}
                to={link}
                className={`flex items-center justify-between p-3 mb-2 rounded-lg hover:bg-green-50 transition-colors duration-300 ${
                  subCategoryId === s._id ? "bg-green-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-12 h-12 object-contain rounded-full"
                  />
                  <span className="text-base font-medium text-gray-700">
                    {s.name}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Filters (Desktop) */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-bold text-lg mb-4 text-gray-800">Filters</h4>
            <div className="flex gap-3 mb-4">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-5 w-5 text-green-500 focus:ring-green-500"
              />
              <span className="text-gray-700">In Stock Only</span>
            </label>

            <button
              onClick={clearFilters}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          {/* Header: Search + Filter button */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h3 className="font-bold text-xl md:text-2xl text-gray-800">
              {subCategoryName}
            </h3>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <IoClose size={20} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={toggleFilterDrawer}
                className="lg:hidden px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center gap-2"
              >
                <IoFilter size={20} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Products */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((p, index) => (
                  <motion.div
                    key={p._id + "productSubCategory" + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CardProduct data={p} />
                  </motion.div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500 text-lg">
                  No products found.
                </p>
              )}
            </div>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
                <Loading />
              </div>
            )}
          </div>

          {data.length < totalPage && !loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer (Mobile Only) */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-start"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white w-4/5 sm:w-3/5 md:hidden p-6 rounded-r-xl shadow-xl max-w-[400px]"
            >
              {/* Mobile Drawer Header */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-xl text-gray-800">Filters</h4>
                <button
                  onClick={toggleFilterDrawer}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <IoClose size={28} />
                </button>
              </div>

              {/* Filters inside Drawer */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sort By</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-5 w-5 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-gray-700">In Stock Only</span>
                </label>

                <button
                  onClick={clearFilters}
                  className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
            <div
              className="flex-1"
              onClick={toggleFilterDrawer}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductListPage;