import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import ownerReducer from "./ownerSlice";
import propertyReducer from "./propertySlice";
import paymentReducer from "./paymentSlice";
import adminReducer from "./adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    owner: ownerReducer,
    property: propertyReducer,
    payment: paymentReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
