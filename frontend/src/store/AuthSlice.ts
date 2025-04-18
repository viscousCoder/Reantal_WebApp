import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  AuthState,
  SendOtpPayload,
  SendPhoneOtpPayload,
  VerifyOtpPayload,
  AuthResponse,
} from "../types/types";
import { APP_URL } from "../common/Constant";
import { OwnerResponse, RegisterOwnerArgs } from "../types/owner";
import { toast } from "react-toastify";

const apiUrl = APP_URL;
// Define the user form data interface (based on your provided structure)
interface UserFormData {
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  employment?: string;
  income?: string;
  rentalHistory?: string;
  paymentMethod?: string;
  profilePictureFile?: File | null;
}

// Define the user response from the registration API
interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

// Define the error response structure
interface ErrorResponse {
  errors: {
    [key: string]: string;
  };
}

// Initial form data
const initialFormData: UserFormData = {
  fullName: "",
  email: "",
  phoneCode: "+91",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  employment: "",
  income: "",
  rentalHistory: "",
  paymentMethod: "",
  profilePictureFile: null,
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  emailOtp: null,
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
  formData: initialFormData,
  registeredUser: null,
  bookedRoom: [],
};

// Async thunk to send email OTP (unchanged)
export const sendOtp = createAsyncThunk<
  AuthResponse,
  SendOtpPayload,
  { rejectValue: string }
>("auth/sendOtp", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(`${apiUrl}/send-email`, {
      email,
    });
    console.log(response.data, "email response");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP"
    );
  }
});

// Async thunk to send phone OTP (unchanged)
export const sendPhoneOtp = createAsyncThunk<
  AuthResponse,
  SendPhoneOtpPayload,
  { rejectValue: string }
>("auth/sendPhoneOtp", async ({ phoneNumber }, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(`${apiUrl}/send-phone`, {
      phoneNumber,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send phone OTP"
    );
  }
});

// Async thunk to verify OTP (unchanged)
export const verifyOtp = createAsyncThunk<
  AuthResponse,
  VerifyOtpPayload,
  { rejectValue: string }
>("auth/verifyOtp", async ({ phoneNumber, code }, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(`${apiUrl}/verify-phone`, {
      phoneNumber,
      code,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to verify OTP"
    );
  }
});

// Async thunk for registering user
interface RegisterArgs {
  formData: UserFormData;
  navigate: (path: string) => void;
}
export const registerUser = createAsyncThunk<
  UserResponse,
  RegisterArgs,
  { rejectValue: ErrorResponse }
>("auth/registerUser", async ({ formData, navigate }, { rejectWithValue }) => {
  try {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "profilePicture" && value instanceof File) {
        data.append("profilePicture", value);
      } else if (typeof value === "boolean") {
        data.append(key, value ? "true" : "false");
      } else if (value !== undefined && value !== null) {
        data.append(key, value.toString());
      }
    });

    const response = await axios.post<{ message: string; user: UserResponse }>(
      `${apiUrl}/register`, // Adjust port if needed
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    navigate("/login");
    toast.success("Registration successful");
    return response.data.user;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Registration failed");
    }
    console.error("Registration error:", error);
    return rejectWithValue(
      axiosError.response?.data || {
        errors: { server: "Failed to register user" },
      }
    );
  }
});

//register owner
export const registerOwner = createAsyncThunk<
  OwnerResponse,
  RegisterOwnerArgs,
  { rejectValue: ErrorResponse }
>("auth/registerOwner", async ({ formData, navigate }, { rejectWithValue }) => {
  try {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "profilePicture" && value instanceof File) {
        data.append("profilePicture", value);
      } else if (typeof value === "boolean") {
        data.append(key, value ? "true" : "false");
      } else if (value !== undefined && value !== null) {
        data.append(key, value.toString());
      }
    });

    const response = await axios.post<{
      message: string;
      owner: OwnerResponse;
    }>(`${apiUrl}/owner/register`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/login");
    return response.data.owner;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || {
        errors: { server: "Failed to register owner" },
      }
    );
  }
});

//login

interface LoginFormData {
  email: string;
  password: string;
  userRole: string;
}

interface LoginArgs {
  formData: LoginFormData;
  navigate: (path: string) => void;
}

interface LoginResponse {
  message: string;
  userData: {
    id: string;
    fullname: string;
    email: string;
    token: string;
    userRole: string;
    // Add more fields as needed
  };
}

interface ErrorResponse {
  errors: {
    [key: string]: string;
  };
}

export const loginUser = createAsyncThunk<
  LoginResponse["userData"],
  LoginArgs,
  { rejectValue: ErrorResponse }
>("auth/loginUser", async ({ formData, navigate }, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${apiUrl}/login`,
      formData
    );

    localStorage.setItem("token", response.data.userData.token);
    localStorage.setItem("id", response.data.userData.id);
    localStorage.setItem("userRole", response.data.userData.userRole);
    navigate("/");
    return response.data.userData;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || {
        errors: { server: "Internal server error" },
      }
    );
  }
});

//get UserDetails
export const getDetails = createAsyncThunk<
  any,
  void,
  { rejectValue: ErrorResponse }
>("/getDetails", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${apiUrl}/getDetails`, {
      headers: {
        "x-token": token,
      },
    });
    if (response.status === 200) {
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("userRole", response.data.userRole);
      return response.data;
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || {
        errors: { server: "Internal server error" },
      }
    );
  }
});

//book property
export const bookProperty = createAsyncThunk(
  "/book",
  async (_, { rejectWithValue }) => {
    const roomId = localStorage.getItem("roomId");
    const userId = localStorage.getItem("id");
    const data = localStorage.getItem("data");

    let parsedData: any = null;
    if (data) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        parsedData = JSON.parse(data);
      } catch (error) {
        console.error("Error parsing 'data' from localStorage:", error);
        return rejectWithValue("Failed to parse data.");
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/update/${roomId}`,
        { userId, ...parsedData },
        {
          headers: {
            "x-token": token,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue("Booking failed.");
      }
    } catch (error) {
      console.error("Error booking property:", error);
      return rejectWithValue("Failed to book property");
    }
  }
);

//getting booked room list
export const fetchBookedProperties = createAsyncThunk(
  "bookedProperties/fetchBookedProperties",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/get-booked-property`, {
        headers: {
          "x-token": token,
        },
      });
      if (response.status === 200) {
        return response.data.bookings;
      } else {
        return rejectWithValue("Booking failed.");
      }
    } catch (error) {
      console.error("Error booking property:", error);
      return rejectWithValue("Failed to book property");
    }
  }
);

// Update the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Update form data fields
    updateFormData: (state, action: PayloadAction<Partial<UserFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    // Reset form data
    resetFormData: (state) => {
      state.formData = initialFormData;
    },
    // Reset OTP states (unchanged)
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
      state.loading = false;
    },
    // Logout action (updated to clear registeredUser)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
      state.loading = false;
      state.formData = initialFormData;
      state.registeredUser = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send email OTP (unchanged)
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sendOtp.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          if (action.payload.success) {
            state.otpSent = true;
            state.emailOtp = action.payload.otp as string;
          } else {
            state.error = action.payload.message;
          }
        }
      )
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send OTP";
      });

    // Send phone OTP (unchanged)
    builder
      .addCase(sendPhoneOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sendPhoneOtp.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          if (action.payload.success) {
            state.otpSent = true;
          } else {
            state.error = action.payload.message;
          }
        }
      )
      .addCase(sendPhoneOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send phone OTP";
      });

    // Verify OTP (unchanged)
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        verifyOtp.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          if (action.payload.success) {
            state.otpVerified = true;
            state.isAuthenticated = true;
          } else {
            state.error = action.payload.message;
          }
        }
      )
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify OTP";
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.registeredUser = action.payload;
          state.formData = initialFormData; // Clear form after success
          state.isAuthenticated = true; // Set authenticated status
          // state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          errors: { server: "Failed to register user" },
        };
      });

    // Register owner
    builder
      .addCase(registerOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerOwner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          errors: { server: "Failed to register user" },
        };
      });

    //login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        // state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors.general || "Login failed";
      });
    //userDetails
    builder
      .addCase(getDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors?.general || "Login failed";
      });
    //booked room data / list
    builder
      .addCase(fetchBookedProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookedProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";

        state.bookedRoom = action.payload;
      })
      .addCase(fetchBookedProperties.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Booking failed";
      });
  },
});

export const {
  updateFormData,
  resetFormData,
  resetOtpState,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
