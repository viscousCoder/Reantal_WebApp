// types.ts

export interface Booking {
  id: string;
  moveInDate: string;
  duration: string;
  property: Property;
  totalAmount: number;
  created_at: string;
  updated_at: string;
}

export interface User {
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
  block: boolean;
  userRole: "tenant";
  employment?: string;
  income?: string;
  rentalHistory?: string;
  profilePicture: string;
  paymentMethod: "Card" | "UPI";
  bookings: Booking[];
  history: Photo[];
  paymentMethods: Card[];
  created_at: string;
  updated_at: string;
}

// Description Interface
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

// Photo Interface
export interface Photo {
  id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

// Policy Interface
export interface Policy {
  id: string;
  petPolicy: string;
  smokingPolicy: string;
  petPolicyDescription: string;
  smokingPolicyDescription: string | null;
  noisePolicy: string;
  guestPolicy: string;
  additionalPolicies: {
    title: string;
    description: string;
  }[];
  created_at: string;
  updated_at: string;
}

// Property Interface
export interface Property {
  id: string;
  address: string;
  propertyType: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  noOfSet: number;
  totalRoom: number;
  securityDeposit: number;
  leaseTerm: string;
  availableDate: string | null;
  isAvailable: boolean;
  created_at: string;
  updated_at: string;
  description: Description;
  photos: Photo[];
  policies: Policy;
}

export interface Card {
  id: string;
  type: "Card" | "UPI";
  cardNumber: string;
  cardHolder: string;
  bankName: string;
  ifsc: string;
  upiId: string | null;
  created_at: string;
  updated_at: string;
}

export interface Owner {
  id: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  companyName?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  password: string;
  agreeToTerms: boolean;
  profilePicture: string;
  verificationMethod: "email" | "phone";
  emailOtp?: string;
  phoneOtp?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  block: boolean;
  generatedEmailOtp?: string;
  generatedPhoneOtp?: string;
  verifiedEmailOtp?: string;
  verifiedPhoneOtp?: string;
  userRole: "owner" | "admin";
  properties: Property[];

  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  companyName?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  password: string;
  agreeToTerms: boolean;
  profilePicture: string;
  verificationMethod: "email" | "phone";
  emailOtp?: string;
  phoneOtp?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  block: boolean;
  generatedEmailOtp?: string;
  generatedPhoneOtp?: string;
  verifiedEmailOtp?: string;
  verifiedPhoneOtp?: string;
  userRole: "owner" | "admin";
  properties: Property[];
  created_at: string;
  updated_at: string;
}
