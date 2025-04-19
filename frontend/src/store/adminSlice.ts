import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

import { APP_URL } from "../common/Constant";
import { Admin, Owner, User } from "../types/Admin";
import { toast } from "react-toastify";

const apiUrl = APP_URL;

export type UserType = "tenant" | "owner" | "admin";

export interface AdminState {
  loading: boolean;
  error: string | null;
  users: (User | Owner | Admin)[];
  updateLoading: boolean;
  slectedUser: User | Owner | null;
}

const initialState: AdminState = {
  loading: false,
  error: null,
  users: [],
  updateLoading: false,
  slectedUser: null,
};

export const fetchUsersByType = createAsyncThunk<
  (User | Owner | Admin)[],
  UserType,
  { rejectValue: string }
>("admin/fetchUsersByType", async (userType, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<{ users: (User | Owner | Admin)[] }>(
      `${apiUrl}/admin/getUser`,
      {
        headers: {
          "x-users": userType,
          "x-token": token,
        },
      }
    );
    return response.data.users;
  } catch (error) {
    const axiosError = error as AxiosError;
    toast.error("Failed to fetch users");
    return rejectWithValue(
      (axiosError.response?.data as { message?: string })?.message ||
        "Failed to fetch users"
    );
  }
});

//update user state(block/unblock)
interface UpdateUserPayload {
  userId: string;
  userRole: "tenant" | "owner";
  block: boolean;
}
export const updateUserBlockStatus = createAsyncThunk<
  { message: string },
  UpdateUserPayload,
  { rejectValue: string }
>("admin/updateUserBlockStatus", async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch<{ message: string }>(
      `${apiUrl}/admin/updateUser`,
      payload,
      {
        headers: { "Content-Type": "application/json", "x-token": token },
      }
    );
    toast.success("User updated successfully");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    toast.error("Update failed");
    return rejectWithValue(
      (err.response?.data as { message?: string })?.message || "Update failed"
    );
  }
});

//Deleting user
interface DeleteUserArgs {
  userId: string;
  userRole: "tenant" | "owner";
}
export const deleteUser = createAsyncThunk<
  { message: string },
  DeleteUserArgs,
  { rejectValue: string }
>("admin/deleteUser", async ({ userId, userRole }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete<{ message: string }>(
      `${apiUrl}/admin/deleteUser`,
      {
        headers: {
          Authorization: `${token}`,
        },
        data: {
          userId,
          userRole,
        },
      }
    );
    toast.success("User deleted successfully");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    toast.error("Failed to delete user");
    return rejectWithValue(
      (err.response?.data as { message?: string })?.message ||
        "Failed to delete user"
    );
  }
});

//Get selected admin user
export const fetchSelectedUser = createAsyncThunk<
  User | Owner,
  { userId: string; userRole: string },
  { rejectValue: string }
>(
  "admin/fetchSelectedUser",
  async ({ userId, userRole }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<User | Owner>(
        `${apiUrl}/admin/selectedUser`,
        {
          headers: {
            "x-userid": userId,
            "x-userrole": userRole,
            Authorization: `${token}`,
          },
        }
      );
      toast.success("User fetched successfully");
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      toast.error("Failed to fetch user");
      return rejectWithValue(
        (err.response?.data as { message?: string })?.message ||
          "Faile to get the user"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersByType.fulfilled,
        (state, action: PayloadAction<(User | Owner | Admin)[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchUsersByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
    //update user state(block/unblock)
    builder
      .addCase(updateUserBlockStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUserBlockStatus.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateUserBlockStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Failed to fetch users";
      });

    //delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Failed to delete user";
      });

    //selected user details
    builder
      .addCase(fetchSelectedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSelectedUser.fulfilled,
        (state, action: PayloadAction<User | Owner>) => {
          state.slectedUser = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchSelectedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export default adminSlice.reducer;
