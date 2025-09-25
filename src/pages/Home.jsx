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
      return sub.category.some((c) => c._id === id);
    });
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    navigate(url);
  };

  const scrollToProducts = () => {
    document
      .getElementById("products-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      {/* HERO SECTION */}
      <div className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-green-200 via-white to-green-100">
        {/* Animated Floating Circles */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0], rotate: [0, 360, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute w-48 h-48 bg-green-300 rounded-full opacity-30 -top-20 -left-10"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -30, 0], rotate: [0, -360, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
          className="absolute w-72 h-72 bg-yellow-200 rounded-full opacity-20 bottom-0 right-0"
        />

        {/* Hero Text */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center px-4 md:px-0"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-green-800 drop-shadow-lg animate-fade-in">
            Ma Gayatri Store
          </h1>
          <p className="text-lg md:text-2xl mt-4 text-gray-700 animate-fade-in delay-200">
            Fresh groceries at your doorstep – Healthy, Fast & Affordable
          </p>
          <motion.button
            onClick={scrollToProducts}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 25px rgba(34,197,94,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-4 bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-green-700"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>

      {/* CATEGORIES GRID */}
      <div
        id="products-section"
        className="container mx-auto px-4 md:px-6 my-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6"
      >
        {loadingCategory
          ? new Array(10).fill(null).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 h-36 grid gap-2 shadow-lg animate-pulse"
              >
                <div className="bg-green-100 h-24 rounded-lg"></div>
                <div className="bg-green-100 h-6 rounded"></div>
              </div>
            ))
          : categoryData.map((cat) => (
              <motion.div
                key={cat._id}
                onClick={() =>
                  handleRedirectProductListpage(cat._id, cat.name)
                }
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0px 15px 30px rgba(34,197,94,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer bg-white rounded-xl p-4 flex flex-col items-center transition-all duration-300 hover:bg-green-50"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-20 h-20 object-contain mb-2"
                />
                <p className="text-sm font-semibold text-gray-700">{cat.name}</p>
              </motion.div>
            ))}
      </div>

      {/* CATEGORY-WISE PRODUCTS */}
      {categoryData?.map((c) => (
        <motion.div
          key={c?._id + "CategorywiseProduct"}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <CategoryWiseProductDisplay id={c?._id} name={c?.name} />
        </motion.div>
      ))}
    </section>
  );
};

export default Home;
