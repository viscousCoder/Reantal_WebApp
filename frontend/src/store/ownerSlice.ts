import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { APP_URL } from "../common/Constant";
import { toast } from "react-toastify";

const apiUrl = APP_URL;

interface PropertyState {
  loading: boolean;
  error: string | null;
  data: any;
  success: boolean;

  currentOwnerLoading: boolean;
  currentOwnerError: string | null;
  currentOwnerProperties: any[];
}

const initialState: PropertyState = {
  loading: false,
  error: null,
  data: null,
  success: false,

  currentOwnerLoading: false,
  currentOwnerError: null,
  currentOwnerProperties: [],
};

// Async thunk to create property
export const createProperty = createAsyncThunk(
  "property/create",
  async (
    {
      formData,
      navigate,
    }: { formData: FormData; navigate: (path: string) => void },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/property`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
      toast.success("Property created successfully");
      return response.data;
    } catch (error: any) {
      toast.error("Failed to create property");
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

//get current owner all property list
export const getCurrentOwnerProperties = createAsyncThunk(
  "property/getCurrentOwnerProperties",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${APP_URL}/getCurrentOwnerProperty`,
        null,
        {
          headers: {
            "x-token": token,
          },
        }
      );

      return response.data.properties;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Server Error");
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

    //get current owner all property
    builder
      .addCase(getCurrentOwnerProperties.pending, (state) => {
        state.currentOwnerLoading = true;
        state.currentOwnerError = null;
      })
      .addCase(getCurrentOwnerProperties.fulfilled, (state, action) => {
        state.currentOwnerLoading = false;
        state.currentOwnerProperties = action.payload;
      })
      .addCase(getCurrentOwnerProperties.rejected, (state, action) => {
        state.currentOwnerLoading = false;
        state.currentOwnerError = action.payload as string;
      });
  },
});

export const { resetPropertyState } = ownerSlice.actions;
export default ownerSlice.reducer;
