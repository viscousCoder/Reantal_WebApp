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

export interface AuthState {
  user: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    userRole?: string;
  } | null;
  isAuthenticated: boolean;
  emailOtp: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  loading: boolean;
  error: string | ErrorResponse | null;
  formData: UserFormData;
  registeredUser: UserResponse | null;
}
