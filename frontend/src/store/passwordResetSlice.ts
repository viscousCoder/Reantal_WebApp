import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { APP_URL } from "../common/Constant";
import { toast } from "react-toastify";
const apiUrl = APP_URL;

interface PasswordResetState {
  loading: boolean;
  successMessage: string | null;
  error: string | null;
}

const initialState: PasswordResetState = {
  loading: false,
  successMessage: null,
  error: null,
};

// Send Reset Link
export const sendResetLink = createAsyncThunk<
  string,
  { email: string; userRole: string; navigate: (path: string) => void },
  { rejectValue: string }
>("passwordReset/sendLink", async ({ email, userRole, navigate }, thunkAPI) => {
  try {
    const res = await axios.post(`${apiUrl}/reset-password`, {
      email,
      userRole,
    });
    toast.success("Reset link sent successfully");
    navigate("/");
    return res.data.message;
  } catch (error: any) {
    toast.error("Failed to send reset link");
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to send reset link"
    );
  }
});

// Reset Password
export const resetPassword = createAsyncThunk<
  string,
  { token: string; newPassword: string; navigate: (path: string) => void },
  { rejectValue: string }
>("passwordReset/reset", async ({ token, newPassword, navigate }, thunkAPI) => {
  try {
    const res = await axios.post(`${apiUrl}/reset-password/${token}`, {
      token,
      newPassword,
    });
    navigate("/");
    toast.success("Password reset successfully");
    return res.data.message;
  } catch (error: any) {
    toast.error("Failed to reset password");
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to reset password"
    );
  }
});

const passwordResetSlice = createSlice({
  name: "password",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendResetLink.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(
        sendResetLink.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        }
      )
      .addCase(sendResetLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error sending reset link";
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        }
      )
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error resetting password";
      });
  },
});

// export const { clearMessages } = passwordResetSlice.actions;

export default passwordResetSlice.reducer;
