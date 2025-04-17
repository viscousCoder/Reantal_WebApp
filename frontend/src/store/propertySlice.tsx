import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APP_URL } from "../common/Constant";

const apiUrl = APP_URL;

// types.ts

export interface Description {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  amenities: string[];
  neighborhood: string;
  transportation: string;
  neighborhoodDescription: string;
  pointsOfInterest: string[];
  neighborhoodLatitude: number;
  neighborhoodLongitude: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface Policies {
  id: string;
  petPolicy: string;
  smokingPolicy: string;
  petPolicyDescription: string;
  smokingPolicyDescription: string;
  noisePolicy: string;
  guestPolicy: string;
  additionalPolicies: AdditionalPolicy[];
  created_at: string;
  updated_at: string;
}

export interface AdditionalPolicy {
  title: string;
  description: string;
}

export interface Property {
  id: string;
  address: string;
  propertyType: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  noOfSet: number;
  securityDeposit: number;
  leaseTerm: string;
  availableDate: string;
  isAvailable: boolean;
  created_at: string;
  updated_at: string;
  description: Description;
  photos: Photo[];
  policies: Policies;
  bookings: any[];
}

interface PropertyState {
  properties: Property[];
  property: Property;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  property: {} as Property,
  loading: false,
  error: null,
};

// 👇 Async thunk to fetch all properties
export const fetchProperties = createAsyncThunk(
  "properties/fetchAll",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${apiUrl}/getAllProperties`, {
        headers: {
          "x-token": token,
        },
      });
      return response.data.properties;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
  }
);

/**Get Single property details */
export const getSingleProperty = createAsyncThunk<
  Property,
  string,
  { rejectValue: string }
>("/property/get", async (propertyId: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/property/${propertyId}`, {
      headers: {
        "x-token": token,
      },
    });

    if (response.status === 200) {
      return response.data.property;
    } else {
      return rejectWithValue("Property not found");
    }
  } catch (error) {
    console.error("Error fetching single property:", error);
    return rejectWithValue("Failed to fetch property");
  }
});

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSingleProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload;
      })
      .addCase(getSingleProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default propertySlice.reducer;
