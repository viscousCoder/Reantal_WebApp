import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    userRole: string;
  };
}
