import { Owner, User } from "./Admin";

// src/types/types.ts
export interface AuthResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export interface SendOtpPayload {
  email: string;
}

export interface SendPhoneOtpPayload {
  phoneNumber: string;
}

export interface VerifyOtpPayload {
  phoneNumber: string;
  code: string;
}

export interface UserFormData {
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
  profilePicture?: File | null;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ErrorResponse {
  errors: {
    [key: string]: string;
  };
}

// export interface User {
//   id: string;
//   fullName: string;
//   email: string;
//   phoneCode: string;
//   phoneNumber: string;
//   password: string;
//   agreeToTerms: boolean;
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
//   country: string;
//   emailVerified: boolean;
//   phoneVerified: boolean;
//   userRole: "tenant" | "landlord" | "admin"; // Assuming possible roles
//   employment: string;
//   income: string;
//   rentalHistory: string;
//   profilePicture: string;
//   paymentMethod: string;
//   created_at: string | Date;
//   updated_at: string | Date;
// }
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  emailOtp: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  loading: boolean;
  error: string | ErrorResponse | null;
  formData: UserFormData;
  registeredUser: UserResponse | null;
  bookedRoom: any[];
  userFullDetails: User | Owner | null;
}
