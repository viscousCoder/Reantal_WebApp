// export interface OwnerFormData {
//   fullName: string;
//   email: string;
//   phoneCode: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
//   companyName?: string;
//   agreeToTerms: boolean;
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
//   country: string;
//   verificationMethod?: string;
//   emailOtp?: string;
//   phoneOtp?: string;
//   emailVerified: boolean;
//   phoneVerified: boolean;
//   generatedEmailOtp?: string;
//   generatedPhoneOtp?: string;
//   verifiedEmailOtp?: string;
//   verifiedPhoneOtp?: string;
//   profilePicture?: File | null;
//   userRole: string;
// }
// export interface RegisterOwnerArgs {
//   formData: OwnerFormData;
//   navigate: (path: string) => void;
// }

export interface OwnerResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface ErrorResponse {
  errors: Record<string, string>;
}

export interface OwnerFormData {
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
  profilePicture: File | null;
  userRole: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface RegisterOwnerArgs {
  formData: OwnerFormData;
  navigate: (path: string) => void;
}

export interface Owner {
  id: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  password: string;
  agreeToTerms: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePicture?: File | null;
}
