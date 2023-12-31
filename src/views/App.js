import { Button, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import Main from "../components/admin/layout/Main";
import AdminProducts from "./../components/product/AdminProducts";
import Price from "../components/price/Price";
import Bill from "./../components/bill/Bill";
import Promotion from "./../components/promotion/Promotion";
import UnitType from "../components/unittype/UnitType";
import StoreChanging from "./../components/store/StoreChanging";
import StoreChecking from "./../components/store/StoreChecking";
import CustomerGroup from "./../components/customerGroup/CustomerGroup";
import Employee from "./../components/employee/Employee";
import Customer from "./../components/customer/Customer";
import Category from "./../components/category/Category";
import ReceiveBill from "../components/receiveBill/ReceiveBill";
import CreateBill from "../components/bill/createBill/CreateBill";
import Order from "../components/order/Order";
import Auth from "../components/auth/Auth";
import StoreEnterTicket from "../components/store/StoreEnterTicket";
import StatisStoreInput from "../components/statistical/StatisStoreInput";
import StatisStorage from "../components/statistical/StatisStorage";
import StatisPromotions from "./../components/statistical/StatisPromotions";
import StatisRetrieves from "./../components/statistical/StatisRetrieves";
import StatisBillsCustomers from "./../components/statistical/StatisBillsCustomers";
import StatisBillsDay from "./../components/statistical/StatisBillsDay";
import BarcodeScanner from "../components/bill/createBill/BarcodeScanner";
import { useEffect, useRef } from "react";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#018547",
          fontSize: 13,
        },
      }}
    >
      <Routes>
        <Route path="/admin" element={<Main />}>
          <Route path="products" element={<AdminProducts />} />
          <Route path="category" element={<Category />} />
          <Route path="prices" element={<Price />} />
          <Route path="bills" element={<Bill />} />
          <Route path="bills_receive" element={<ReceiveBill />} />
          <Route path="customers" element={<Customer />} />
          <Route path="promotion" element={<Promotion />} />
          <Route path="unitType" element={<UnitType />} />
          <Route path="store_change" element={<StoreChanging />} />
          <Route path="store_check" element={<StoreChecking />} />
          <Route path="store_tickets" element={<StoreEnterTicket />} />
          <Route path="customer_group" element={<CustomerGroup />} />
          <Route path="employee" element={<Employee />} />
          <Route path="create_bill" element={<CreateBill />} />
          <Route path="orders" element={<Order />} />

          <Route path="statistic/inputs" element={<StatisStoreInput />} />
          <Route path="statistic/storage" element={<StatisStorage />} />
          <Route path="statistic/promotions" element={<StatisPromotions />} />
          <Route path="statistic/retrieves" element={<StatisRetrieves />} />
          <Route
            path="statistic/bills-customers"
            element={<StatisBillsCustomers />}
          />
          <Route path="statistic/bills-days" element={<StatisBillsDay />} />
        </Route>
        <Route path="auth" element={<Auth />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
