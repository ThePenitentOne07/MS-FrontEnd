import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import BlankLayout from "../layouts/BlankLayout";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import DetailPage from "../pages/DetailPage";
import Cart from "../pages/Cart";
import EditCustomerAccount from "../pages/EditCusAcc";
import PurchaseHistory from "../pages/PurchaseHistory";
import FinnishRegistration from "../pages/FinnishRegistration";
import ChangePassword from "../pages/ChangePassword";
import OrderList from "../pages/OrderList";
import AdminLayout from "../layouts/AdminLayout";
import WelcomeAdmin from "../adminPages/WelcomeAdmin";
import DashboardPage from "../adminPages/DashboardPage";
import StaffManagement from "../adminPages/StaffManagement";
import CustomerManagement from "../adminPages/CustomerManagement";
import StaffLayout from "../layouts/StaffLayout";
import WelcomeStaff from "../staffPages/WelcomeStaff";
import StaffProductList from "../staffPages/StaffProductList";
import { AuthProvider } from "../contexts/AuthContext";
import NoBubbleLayout from "../layouts/NoBubbleLayout";
import PostPage from "../pages/PostPage";
import PostCard from "../components/PostCard";
import PostStaff from "../staffPages/PostStaff";
import Error from "../pages/Error";
import Checkout from "../pages/Checkout";
import OrderListStaff from "../staffPages/OrderListStaff";
import OrderStatus from "../components/OrderStatus";
import ProductForm from "../staffPages/ProductForm";
import OTP from "../pages/OTP";
import AddStaff from "../adminPages/AddStaff";
import { FormContext2 } from "../components/form/FormContext";
// import PrivateRoute from "../contexts/PrivateRoute";
import TrasactionStatus from "../pages/TrasactionStatus";
// import CreatePost from '../staffPages/EditorComponent';
import EditorComponent from "../staffPages/EditorComponent";
import SearchPage from "../pages/SearchPage";
import CategoryPage from "../pages/CategoryPage";
import Article from "../pages/Article";
import RefundPage from "../pages/RefundPage";
import ListRefundPage from "../pages/ListRefundPage";
import RefundRequest from "../staffPages/RefundRequest";
import AddressManagement from "../pages/AddressManagement";
import ScrollToTop from "../components/ScrollToTop";
import Article2 from "../pages/Article2";
import Article3 from "../pages/Article3";
import CategoryManagement from "../staffPages/CategoryManagement";
import RefundStatus from "../pages/RefundStatus";
// import FinishGoogleRegistration from "../pages/FinishGoogleRegistration";
// import GoogleLoginStatus from "../pages/GoogleLoginStatus";

function Router() {
  const isRoleAllowed = (roles) => {
    const userRole = JSON.parse(localStorage.getItem("user"))?.role;

    if (!userRole) {
      return false;
    }

    return roles.some((allowedRole) => userRole === allowedRole);
  };

  return (
    <AuthProvider>
      <FormContext2>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="product/:productID" element={<DetailPage />} />
            <Route path="editAcc" element={<EditCustomerAccount />} />
            <Route path="purchase" element={<PurchaseHistory />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orderstatus/:orderId" element={<OrderStatus />} />
            <Route path="toship" element={<OrderList />} />
            <Route path="transStatus" element={<TrasactionStatus />} />
            <Route path="search/:searchTerm" element={<SearchPage />} />
            <Route path="category/:variant" element={<CategoryPage />} />
            <Route path="/article1" element={<Article />} />
            <Route path="/article2" element={<Article2 />} />
            <Route path="/article3" element={<Article3 />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/refundList/:orderId" element={<ListRefundPage />} />
            <Route path="/refundStatus/:refundId" element={<RefundStatus />} />
            <Route path="/address" element={<AddressManagement />} />


          </Route>
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<ForgotPassword />} />
            <Route path="*" element={<Error />} />
            <Route path="/error" element={<Error />} />
            <Route path="/fill" element={<FinnishRegistration />} />

            {/* <Route path="/fill-oauth2" element={<FinishGoogleRegistration />} /> */}
            {/* <Route path="/oauth2-google" element={<GoogleLoginStatus />} /> */}
            <Route path="/otp" element={<OTP />} />
          </Route>
          <Route element={<NoBubbleLayout />}></Route>

          {/*admin route*/}
          <Route
            path="admin"
            element={
              // isRoleAllowed(["ADMIN"]) ? (
              <AdminLayout />
              // ) : (
              //   <Navigate to="/error" replace />
              // )
            }
          >
            <Route index element={<WelcomeAdmin />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="customer" element={<CustomerManagement />} />
            <Route path="newStaff" element={<AddStaff />} />
          </Route>

          {/* Staff route */}
          <Route
            path="staff"
            element={
              // isRoleAllowed([
              //   "MANAGER",
              //   "POST_STAFF",
              //   "PRODUCT_STAFF",
              //   "SELLER",
              // ]) ? (
              <StaffLayout />
              // ) : (
              //   <Navigate to="/error" replace />
              // )
            }
          >
            <Route index element={<WelcomeStaff />} />
            <Route path="product" element={<StaffProductList />} />
            <Route path="product/new" element={<ProductForm />} />
            <Route path="product/edit/:id" element={<ProductForm />} />
            <Route path="customer" element={<CustomerManagement />} />
            <Route path="post" element={<PostStaff />} />
            <Route path="order" element={<OrderListStaff />} />
            <Route path="newPost" element={<EditorComponent />} />
            <Route path="refundReq" element={<RefundRequest />} />
            <Route path="category" element={<CategoryManagement />} />

          </Route>
        </Routes>
      </FormContext2>
    </AuthProvider>
  );
}

export default Router;
