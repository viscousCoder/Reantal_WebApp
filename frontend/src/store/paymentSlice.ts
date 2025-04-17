import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loadStripe } from "@stripe/stripe-js";
import { APP_URL } from "../common/Constant";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const apiUrl = APP_URL;
interface CustomerDetails {
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentRequest {
  propertyId: number;
  amount: number;
  description: string;
  customerDetails: CustomerDetails;
}

interface PaymentState {
  sessionId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  sessionId: null,
  loading: false,
  error: null,
};

export const createCheckoutSession = createAsyncThunk<
  string,
  PaymentRequest,
  { rejectValue: string }
>(
  "payment/createCheckoutSession",
  async (paymentData: PaymentRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create checkout session"
        );
      }

      const data: { id: string } = await response.json();
      console.log("Checkout session created:", data.id);
      return data.id;
    } catch (error) {
      return rejectWithValue((error as Error).message || "An error occurred");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.sessionId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCheckoutSession.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.sessionId = action.payload;
        }
      )
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create checkout session";
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;

export const redirectToCheckout = async (sessionId: string) => {
  console.log("Attempting to redirect with session ID:", sessionId);
  const stripe = await stripePromise;
  if (stripe) {
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error("Stripe redirect error:", error.message);
    }
  } else {
    console.error("Stripe failed to load");
  }
};
