import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import SignUp from "./pages/SignUp/SignUp";
import DeliveryStaffHome from "./pages/DeliveryStaff/home_delivery/Delivery_staff/DeliveryStaffHome";
import AuthProvider from "./authentication/AuthProvider";
import PrivateRoute from "./authentication/PrivateRoute";
import LoginCustomer from "./pages/login/LoginCustomer/LoginCustomer";
import LoginSaleStaff from "./pages/login/LoginSaleStaff/LoginSaleStaff";
import LoginDeliveryStaff from "./pages/login/LoginDeliveryStaff/LoginDeliveryStaff";
import LoginManager from "./pages/login/LoginManager/LoginManager";
import PostedOrderSalesStaff from "./pages/SalesStaff/OrderSalesStaff/PostedOrderSalesStaff";
import CustomerLayout from "./pages/Layout/CustomerLayout/CustomerLayout";
import CustomerEditProfile from "./pages/Customer/CustomerEditProfile/CustomerEditProfile";
import SalesStaffHome from "./pages/SalesStaff/SalesStaffHome/SalesStaffHome";
import PaymentSuccess from "./utils/DefaultPages/PaymentSuccess";
import DeliveryStaffLayout from "./pages/Layout/DeliveryStaffLayout/DeliveryStaffLayout";
import SalesStaffLayout from "./pages/Layout/SalesStaffLayout/SalesStaffLayout";
import PublicRoute from "./authentication/PublicRoute";
import SalesOrderDetail from "./pages/SalesStaff/components/SalesOrderDetail/SalesOrderDetail";
import SalesFishDetail from "./pages/SalesStaff/components/SalesFishDetail/SalesFishDetail";
// import BasicLayout from "./pages/Layout/BasicLayout/BasicLayout";
import CustomerCreateOrder from "./pages/Customer/CustomerCreateOrder/CustomerCreateOrder";
import CustomerHome from "./pages/Customer/CustomerHome/CustomerHome";
import Report from "./pages/Manager/Report/Report";
import ManagerLayout from "./pages/Layout/ManagerLayout/ManagerLayout";
import Storage from "./pages/Manager/SystemData/Storage/Storage";
import Customer from "./pages/Manager/SystemData/Customer/Customer";
import DeliveryStaff from "./pages/Manager/SystemData/DeliveryStaff/DeliveryStaff";
import SalesStaff from "./pages/Manager/SystemData/SalesStaff/SalesStaff";
import Dashboard from "./pages/Manager/Report/Dashboard";
import TrackingOrder from "./pages/public/TrackingOrder/TrackingOrder";
import "./App.css";
import "./App.scss";
import PaymentRate from "./pages/Manager/SystemData/PaymentRate/PaymentRate";
import ReceivedOrderSalesStaff from "./pages/SalesStaff/OrderSalesStaff/ReceivedOrderSalesStaff";
import CustomerEditOrder from "./pages/Customer/CustomerEditOrder/CustomerEditOrder";
import SalesStaffNews from "./pages/SalesStaff/SalesStaffNews/SalesStaffNews"
import Page404 from "./pages/DefaultError/404";
import Transaction from "./pages/Manager/SystemData/Transaction/Transaction";
import License from "./pages/Manager/SystemData/License/License";
import PaymentHistory from "./pages/Manager/SystemData/PaymentHistory/PaymentHistory";
import Fish from "./pages/Manager/SystemData/Fish/Fish";
import Orders from "./pages/Manager/SystemData/Orders/Orders";
import Invoice from "./pages/public/Invoice/Invoice";
import OrderFinalInfo from "./pages/Customer/CustomerEditOrder/pages/OrderFinalInfo";
import ContactPage from "./pages/public/Contact/Contact";
import DeliveryStaffEditProfile from "./pages/DeliveryStaff/DeliveryStaffEditProfile/DeliveryStaffEditProfile";
import SalesStaffEditProfile from "./pages/SalesStaff/SalesStaffEditProfile/SalesStaffEditProfile";
import DeliveryOrderHome from "./pages/DeliveryStaff/DeliveryOrderHome/DeliveryOrderHome";
import GettingOrderDeliveryStaff from "./pages/DeliveryStaff/DeliveryOrderHome/GettingOrderDeliveryStaff";
import AvailableToDelivery from "./pages/DeliveryStaff/DeliveryOrderHome/AvailableToDelivery";
import AvailableToGet from "./pages/DeliveryStaff/DeliveryOrderHome/AvailableToGet";
import DeliveryOrderDetail from "./pages/DeliveryStaff/DeliveryOrderDetail/DeliveryOrderDetail";
import DeliveryFishDetail from "./pages/DeliveryStaff/DeliveryFishDetail/DeliveryFishDetail";
import WaitingForConfirm from "./pages/public/WatingForConfirm/WatingForConfirm";
import RegistrationSuccess from "./pages/public/RegistrationSuccess/RegistrationSuccess";
import FishPayment from "./pages/Customer/FishCreateOrder/pages/FishPayment";
import CustomerCreateFish from "./pages/Customer/FishCreateOrder/CustomerCreateFish";
import DeliveringOrder from "./pages/DeliveryStaff/DeliveryOrderHome/DeliveringOrderDeliveryStaff";
import Allnews from "./pages/public/News/Allnews";
import NewsDetail from "./pages/public/News/NewsDetail";
import Manager from "./pages/Manager/SystemData/Manager/manager";
import SupportPage from "./pages/public/Support/SupportPage";
import DraftOrderDetail from "./pages/Customer/OrderDetail/DraftOrderDetail/DraftOrderDetail";
import PostedOrderDetail from "./pages/Customer/OrderDetail/PostedOrderDetail/PostedOrderDetail";
import GettingOrderDetail from "./pages/Customer/OrderDetail/GettingOrderDetail/GettingOrderDetail";
import DeliveringOrderDetail from "./pages/Customer/OrderDetail/DeliveringOrderDetail/DeliveringOrderDetail";
import CompletedOrderDetail from "./pages/Customer/OrderDetail/CompletedOrderDetail/CompletedOrderDetail";
import ForgotPassword from "./pages/public/ForgotPassword/ForgotPassword";
import Rating from "./pages/Manager/SystemData/Rating/Rating";

function App() {
  // eslint-disable-next-line react/prop-types
  const CustomerPrivateRoute = ({ element }) => (
    <PrivateRoute allowedRoles={1}>
      {element}
    </PrivateRoute>
  );

  // eslint-disable-next-line react/prop-types
  const SalesStaffPrivateRoute = ({ element }) => (
    <PrivateRoute allowedRoles={2}>
      {element}
    </PrivateRoute>
  );

  // eslint-disable-next-line react/prop-types
  const DeliveryStaffPrivateRoute = ({ element }) => (
    <PrivateRoute allowedRoles={3}>
      {element}
    </PrivateRoute>
  );

  // eslint-disable-next-line react/prop-types
  const ManagerPrivateRoute = ({ element }) => (
    <PrivateRoute allowedRoles={4}>
      {element}
    </PrivateRoute>
  );

  // eslint-disable-next-line react/prop-types
  const AllowedRoute = ({ element }) => (
    <PublicRoute>
      {element}
    </PublicRoute>
  )

  return (
    <AuthProvider>
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SignUp />} />

            <Route path="/login-customer" element={<LoginCustomer />} />
            <Route path="/login-sales-staff" element={<LoginSaleStaff />} />
            <Route path="/login-delivery-staff" element={<LoginDeliveryStaff />} />
            <Route path="/login-manager" element={<LoginManager />} />

            <Route path="/waiting-for-confirmation" element={<WaitingForConfirm />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/support-page" element={<SupportPage />} />
            <Route path="/news" element={<Allnews />} />
            <Route path="/news/:id" element={<NewsDetail />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ManagerLayout />}>
              <Route path="/admin/report" element={<ManagerPrivateRoute element={<Report />} />} />
              <Route path="/admin/dashboard" element={<ManagerPrivateRoute element={<Dashboard />} />} />
              <Route path="/admin/manager" element={<ManagerPrivateRoute element={<Manager />} />} />
              <Route path="/admin/storage" element={<ManagerPrivateRoute element={<Storage />} />} />
              <Route path="/admin/customer" element={<ManagerPrivateRoute element={<Customer />} />} />
              <Route path="/admin/delivery-staff" element={<ManagerPrivateRoute element={<DeliveryStaff />} />} />
              <Route path="/admin/sales-staff" element={<ManagerPrivateRoute element={<SalesStaff />} />} />
              <Route path="/admin/payment-rate" element={<ManagerPrivateRoute element={<PaymentRate />} />} />
              <Route path="/admin/fish" element={<ManagerPrivateRoute element={<Fish />} />} />
              <Route path="/admin/payment-history" element={<ManagerPrivateRoute element={<PaymentHistory />} />} />
              <Route path="/admin/license" element={<ManagerPrivateRoute element={<License />} />} />
              <Route path="/admin/rating" element={<ManagerPrivateRoute element={<Rating/>} />} />
              <Route path="/admin/transaction" element={<ManagerPrivateRoute element={<Transaction />} />} />
              <Route path="/admin/order" element={<ManagerPrivateRoute element={<Orders />} />} />
            </Route>

            <Route element={<CustomerLayout />}>
              <Route path="/customer-home" element={<CustomerPrivateRoute element={<CustomerHome />} />} />
              <Route path="/customer-create-order" element={<CustomerPrivateRoute element={<CustomerCreateOrder />} />} />
              <Route path="/customer-edit-profile" element={<CustomerPrivateRoute element={<CustomerEditProfile />} />} />
              <Route path="/customer-edit-order/:id" element={<CustomerPrivateRoute element={<CustomerEditOrder />} />} />
              <Route path="/customer-add-fish/:id" element={<CustomerPrivateRoute element={<CustomerCreateFish />} />} />
              <Route path="/order-fish-payment/:id" element={<FishPayment />} />
              <Route path="/customer-edit-order/:id/order-conclusion-info" element={<CustomerPrivateRoute element={<OrderFinalInfo />} />} />
              <Route path="/customer-draft-orders" element={<CustomerPrivateRoute element={<DraftOrderDetail />} />} />
              <Route path="/customer-posted-orders" element={<CustomerPrivateRoute element={<PostedOrderDetail />} />} />
              <Route path="/customer-getting-orders" element={<CustomerPrivateRoute element={<GettingOrderDetail />} />} />
              <Route path="/customer-delivering-orders" element={<CustomerPrivateRoute element={<DeliveringOrderDetail />} />} />
              <Route path="/customer-complete-orders" element={<CustomerPrivateRoute element={<CompletedOrderDetail />} />} />
            </Route>

            <Route path="/delivery-staff-home" element={<DeliveryStaffPrivateRoute element={<DeliveryStaffHome />} />} />

            <Route element={<DeliveryStaffLayout />}>
              <Route path="/delivery-order-home" element={<DeliveryStaffPrivateRoute element={<DeliveryOrderHome />} />} />
              <Route path="/delivery-staff-edit-profile" element={<DeliveryStaffPrivateRoute element={<DeliveryStaffEditProfile />} />} />
              <Route path="/getting-order-delivery-staff" element={<DeliveryStaffPrivateRoute element={<GettingOrderDeliveryStaff />} />} />
              <Route path="/available-to-delivery-staff" element={<DeliveryStaffPrivateRoute element={<AvailableToDelivery />} />} />
              <Route path="/delivering-order-delivery-staff" element={<DeliveryStaffPrivateRoute element={<DeliveringOrder />} />} />
              <Route path="/available-to-get-delivery-staff" element={<DeliveryStaffPrivateRoute element={<AvailableToGet />} />} />
              <Route path="/delivery-order-detail/:id" element={<DeliveryStaffPrivateRoute element={<DeliveryOrderDetail />} />} />
              <Route path="/delivery-order-detail/:id/delivery-fish-detail" element={<DeliveryStaffPrivateRoute element={<DeliveryFishDetail />} />} />
            </Route>

            <Route element={<SalesStaffLayout />}>
              <Route path="/posted-order-sales-staff" element={<SalesStaffPrivateRoute element={<PostedOrderSalesStaff />} />} />
              <Route path="/received-order-sales-staff" element={<SalesStaffPrivateRoute element={<ReceivedOrderSalesStaff />} />} />
              <Route path="/sales-staff-edit-profile" element={<SalesStaffPrivateRoute element={<SalesStaffEditProfile />} />} />
              <Route path="/sales-staff-home" element={<SalesStaffPrivateRoute element={<SalesStaffHome />} />} />
              <Route path="/sales-order-detail/:id" element={<SalesStaffPrivateRoute element={<SalesOrderDetail />} />} />
              <Route path="/sales-order-detail/:id/sales-fish-detail" element={<SalesStaffPrivateRoute element={<SalesFishDetail />} />} />
              <Route path="/news-sales-staff" element={<SalesStaffPrivateRoute element={<SalesStaffNews />} />} />
              <Route path="/news-sales-staff/:id" element={<SalesStaffPrivateRoute element={<SalesStaffNews />} />} />
            </Route>

            <Route path="/payment-success" element={<AllowedRoute element={<PaymentSuccess />} />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/tracking-order" element={<TrackingOrder />} />

            <Route path="/*" element={<Page404 />} />
          </Routes>
        </Router>
      </main>
    </AuthProvider>
  );
}

export default App;