import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../store/slices/productSlice";
import cateReducer from "../store/slices/cateSlice";
import priceHeaderReducer from "../store/slices/priceHeaderSlice";
import priceLineReducer from "../store/slices/priceLineSlice";
import createBillReducer from "../store/slices/createBillSlice";
import userReducer from "../store/slices/userSlice";
import customerReducer from "../store/slices/customerSlice";
import unitTypeReducer from "../store/slices/unitTypeSlice";
import employeeReducer from "../store/slices/employeeSlice";
import customerTypeReducer from "../store/slices/customerTypeSlice";
import storeTranReducer from "../store/slices/storeTranSlice";
import promotionHeaderReducer from "../store/slices/promotionHeaderSlice";
import promotionLineReducer from "../store/slices/promotionLineSlice";

const rootReducer = {
  product: productReducer,
  cate: cateReducer,
  priceHeader: priceHeaderReducer,
  priceLine: priceLineReducer,
  createBill: createBillReducer,
  user: userReducer,
  customer: customerReducer,
  unitType: unitTypeReducer,
  employee: employeeReducer,
  customerType: customerTypeReducer,
  storeTran: storeTranReducer,
  promotionHeader: promotionHeaderReducer,
  promotionLine: promotionLineReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});
