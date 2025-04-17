import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { APP_URL } from "../common/Constant";

const apiUrl = APP_URL;

interface PropertyState {
  loading: boolean;
  error: string | null;
  data: any;
  success: boolean;
}

const initialState: PropertyState = {
  loading: false,
  error: null,
  data: null,
  success: false,
};

// Async thunk to create property
export const createProperty = createAsyncThunk(
  "property/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/property`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    resetPropertyState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createProperty.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = action.payload;
          state.success = true;
        }
      )
      .addCase(createProperty.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetPropertyState } = ownerSlice.actions;
export default ownerSlice.reducer;
