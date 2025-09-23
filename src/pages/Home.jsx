import React from "react";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import { motion } from "framer-motion";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => c._id == id);
      return filterData ? true : null;
    });
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    navigate(url);
  };

  // Scroll to Products
  const scrollToProducts = () => {
    document
      .getElementById("products-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      {/* HERO BANNER */}
      <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-green-100 via-white to-green-100">
        {/* Background Animated Circles */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 2 }}
          className="absolute w-72 h-72 bg-green-300 rounded-full opacity-20 -top-10 -left-10"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute w-96 h-96 bg-yellow-200 rounded-full opacity-20 bottom-0 right-0"
        />

        {/* Banner Content */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 drop-shadow-lg">
            Ma Gayatri Store
          </h1>
          <p className="text-lg md:text-xl mt-4 text-gray-700">
            Fresh groceries at your doorstep – Healthy, Fast & Affordable
          </p>
          <motion.button
            onClick={scrollToProducts}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>

      {/* CATEGORIES GRID */}
      <div
        id="products-section"
        className="container mx-auto px-4 my-6 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4"
      >
        {loadingCategory
          ? new Array(10).fill(null).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 h-36 grid gap-2 shadow animate-pulse"
              >
                <div className="bg-green-100 h-24 rounded"></div>
                <div className="bg-green-100 h-6 rounded"></div>
              </div>
            ))
          : categoryData.map((cat) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={cat._id}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg p-3 flex flex-col items-center transition"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <p className="text-sm font-semibold text-gray-700">
                  {cat.name}
                </p>
              </motion.div>
            ))}
      </div>

      {/* CATEGORY-WISE PRODUCTS */}
      {categoryData?.map((c) => (
        <CategoryWiseProductDisplay
          key={c?._id + "CategorywiseProduct"}
          id={c?._id}
          name={c?.name}
        />
      ))}
    </section>
  );
};

export default Home;
