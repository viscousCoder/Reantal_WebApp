import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import ownerReducer from "./ownerSlice";
import propertyReducer from "./propertySlice";
import paymentReducer from "./paymentSlice";
import adminReducer from "./adminSlice";
import passwordReducer from "./passwordResetSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    owner: ownerReducer,
    property: propertyReducer,
    payment: paymentReducer,
    admin: adminReducer,
    password: passwordReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
