export interface OtpRequestBody {
  email: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface PhoneOtpRequestBody {
  phone: string;
}

export interface PhoneOtpResponse {
  success: boolean;
  message: string;
  otp?: string;
}
