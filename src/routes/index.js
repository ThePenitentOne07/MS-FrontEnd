import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import BlankLayout from '../layouts/BlankLayout';
import Home from '../pages/Home';
import MainLayout from '../layouts/MainLayout';
import DetailPage from '../pages/DetailPage';
import Cart from '../pages/Cart';
import EditCustomerAccount from '../pages/EditCusAcc';
import PurchaseHistory from '../pages/PurchaseHistory';
import FinnishRegistration from '../pages/FinnishRegistration';
import ChangePassword from '../pages/ChangePassword';
import OrderList from '../pages/OrderList';
import AdminLayout from '../layouts/AdminLayout';
import WelcomeAdmin from '../adminPages/WelcomeAdmin';
import DashboardPage from '../adminPages/DashboardPage';
import StaffManagement from '../adminPages/StaffManagement';
import CustomerManagement from '../adminPages/CustomerManagement';
import StaffLayout from '../layouts/StaffLayout';
import WelcomeStaff from '../staffPages/WelcomeStaff';
import StaffProductList from '../staffPages/StaffProductList';
import { AuthProvider } from '../contexts/AuthContext';
import NoBubbleLayout from '../layouts/NoBubbleLayout';
import PostPage from '../pages/PostPage';
import PostCard from '../components/PostCard';
import PostStaff from '../staffPages/PostStaff';
import Error from '../pages/Error';
import Checkout from '../pages/Checkout';
import OrderListStaff from '../staffPages/OrderListStaff';
import OrderStatus from '../components/OrderStatus';
import ProductForm from '../staffPages/ProductForm';
import OTP from '../pages/OTP';
import AddStaff from '../adminPages/AddStaff';
import { FormContext2 } from '../components/form/FormContext';
import PrivateRoute from '../contexts/PrivateRoute';
import TrasactionStatus from '../pages/TrasactionStatus';
// import CreatePost from '../staffPages/EditorComponent';
import EditorComponent from '../staffPages/EditorComponent';
import SearchPage from '../pages/SearchPage';
function Router() {
  return (
    <AuthProvider>
      <FormContext2>
        <Routes >



          <Route path="/" element={<MainLayout />} >
            <Route index element={<Home />} />
            <Route path="product/:productID" element={<DetailPage />} />
            <Route path='editAcc' element={<EditCustomerAccount />} />
            <Route path='purchase' element={<PurchaseHistory />} />
            <Route path='password' element={<ChangePassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orderstatus/:orderId" element={<OrderStatus />} />
            <Route path="toship" element={<OrderList />} />
            <Route path="transStatus" element={<TrasactionStatus />} />
            <Route path="search/:searchTerm" element={<SearchPage />} />
          </Route>
          <Route element={<BlankLayout />} >

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<ForgotPassword />} />
            <Route path='*' element={<Error />} />
            <Route path='/fill' element={<FinnishRegistration />} />
            <Route path="/otp" element={<OTP />} />
          </Route>
          <Route element={<NoBubbleLayout />}>

          </Route>

            //admin route

          {/* <Route element={<PrivateRoute roles={['ADMIN']} />}> */}
          <Route path='admin' element={<AdminLayout />}>
            <Route index element={<WelcomeAdmin />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="customer" element={<CustomerManagement />} />
            <Route path="newStaff" element={<AddStaff />} />
          </Route>
          {/* asdasd */}
      //staff route
          <Route path='staff' element={<StaffLayout />}>
            <Route index element={<WelcomeStaff />} />
            <Route path='product' element={<StaffProductList />} />
            <Route path='product/new' element={<ProductForm />} />
            <Route path='product/edit/:id' element={<ProductForm />} />
            <Route path='customer' element={<CustomerManagement />} />
            <Route path='post' element={<PostStaff />} />
            <Route path='order' element={<OrderListStaff />} />
            <Route path='newPost' element={<EditorComponent />} />
          </Route>
        </Routes>
      </FormContext2>
    </AuthProvider>
  );
}

export default Router;