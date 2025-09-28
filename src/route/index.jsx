import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";

// User Dashboard Pages
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import MyWishlist from "../pages/Wishlist"; // ✅ Import MyWishlist

// Admin Pages
import AdminAllOrders from "../pages/AdminAllOrders";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";

// Product Pages
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public Routes
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verification-otp", element: <OtpVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "user", element: <UserMenuMobile /> },

      // User Dashboard
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "myorders", element: <MyOrders /> },
          { path: "address", element: <Address /> },

          // ✅ My Wishlist for both user & admin
          { path: "mywishlist", element: <MyWishlist /> },

          // Admin-only routes
          { path: "AdminAllOrders", element: <AdminAllOrders /> },
          { path: "category", element: <CategoryPage /> },
          { path: "subcategory", element: <SubCategoryPage /> },
          { path: "upload-product", element: <UploadProduct /> },
          { path: "product", element: <ProductAdmin /> },
        ]
      },

      // Dynamic category/subcategory route (should be LAST)
      {
        path: ":category",
        children: [
          { path: ":subCategory", element: <ProductListPage /> }
        ]
      },

      // Other routes
      { path: "product/:product", element: <ProductDisplayPage /> },
      { path: "cart", element: <CartMobile /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "success", element: <Success /> },
      { path: "cancel", element: <Cancel /> },
    ]
  }
]);

export default router;
