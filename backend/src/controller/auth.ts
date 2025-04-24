import { Request, Response } from "express";
import { MailService, PassMailService } from "../services/mail.service";
import { OtpUtil } from "../utils/otp.util";
import { OtpRequestBody, OtpResponse, PhoneOtpRequestBody } from "../types";
import { SmsService } from "../services/sms.servise";
import twilio from "twilio";
import { getConnection } from "../database/db.config";
import { User } from "../entities/Users";
require("dotenv").config();
import bcrypt from "bcryptjs";
import { handleGenerateToken } from "../utils/token";
import { AuthenticatedRequest } from "../types/requestTypes";
import { Property } from "../entities/Property";
import { Booking } from "../entities/Booking";
import { Owner } from "../entities/Owner";
import cloudinary from "../config/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { addMinutes } from "date-fns";
import { PasswordResetToken } from "../entities/PasswordResetToken";
import { History } from "../entities/History";
import { PaymentMethod } from "../entities/PaymentMethod";

const passMailService = new PassMailService();

const mailService = new MailService();
// const smsService = new SmsService();

interface ExtendedOtpResponse extends OtpResponse {
  otp?: string;
}

/**
 * @function handleSendEmailOtp
 * @description Handles sending an OTP to the user's email address.
 */
export async function handleSendEmailOtp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body as OtpRequestBody;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email address",
      } as ExtendedOtpResponse);
      return;
    }

    const otp = OtpUtil.generateOtp();

    await OtpUtil.storeOtp(email, otp);

    const emailSent = await mailService.sendOtpEmail(email, otp);

    if (!emailSent) {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      } as ExtendedOtpResponse);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    } as ExtendedOtpResponse);
  } catch (error) {
    console.error("Error in handleSendEmailOtp:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ExtendedOtpResponse);
  }
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

/**
 * @function handleSendPhoneOtp
 * @description Handles sending an OTP to the user's phone number.
 */
export async function handleSendPhoneOtp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }

    const formattedPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: formattedPhoneNumber,
        channel: "sms",
      });

    res.status(200).json({
      success: true,
      sid: verification.sid,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send OTP",
    });
  }
}

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Missing required Twilio environment variables");
}

/**
 * @function handleVerifyEmailOtp
 * @description Handles verifying the OTP sent to the user's email address.
 */
export async function handleVerifyPhoneOtp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      res.status(400).json({
        success: false,
        error: "Phone number and OTP code are required",
      });
      return;
    }

    const formattedPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: formattedPhoneNumber,
        code,
      });

    if (verificationCheck.status === "approved") {
      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        status: verificationCheck.status,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid OTP",
        status: verificationCheck.status,
      });
    }
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to verify OTP",
    });
  }
}

/**
 * @function handleRegisterUser
 * @description Handles user registration.
 */

// export async function handleRegisterUser(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   try {
//     const {
//       fullName,
//       email,
//       phoneCode,
//       phoneNumber,
//       password,
//       confirmPassword,
//       userRole,
//       agreeToTerms,
//       street,
//       city,
//       state,
//       zip,
//       country,
//       employment,
//       income,
//       rentalHistory,
//       paymentMethod,
//     } = req.body;

//     console.log(req.body, "data");
//     // Basic validation
//     if (
//       !fullName ||
//       !email ||
//       !phoneNumber ||
//       !password ||
//       !confirmPassword ||
//       !agreeToTerms
//     ) {
//       res
//         .status(400)
//         .json({ errors: { general: "Required fields are missing" } });
//       return;
//     }

//     if (password !== confirmPassword) {
//       res
//         .status(400)
//         .json({ errors: { confirmPassword: "Passwords do not match" } });
//       return;
//     }

//     const AppDataSource = await getConnection();
//     const userRepository = AppDataSource.getRepository(User);
//     const historyRepository = AppDataSource.getRepository(History); // Add repository for history

//     const existingUser = await userRepository.findOne({
//       where: [{ email }, { phoneNumber }],
//     });

//     if (existingUser) {
//       if (
//         req.files &&
//         (req.files as { [fieldname: string]: Express.Multer.File[] })[
//           "profilePicture"
//         ]
//       ) {
//         await cloudinary.uploader.destroy(
//           `${
//             (req.files as { [fieldname: string]: Express.Multer.File[] })[
//               "profilePicture"
//             ][0].filename
//           }`
//         );
//       }
//       res.status(400).json({
//         errors: {
//           [existingUser.email === email ? "email" : "phoneNumber"]:
//             "Already exists",
//         },
//       });
//       return;
//     }

//     // Create new user
//     const user = new User();
//     user.fullName = fullName;
//     user.email = email;
//     user.phoneCode = phoneCode || "+91";
//     user.phoneNumber = phoneNumber;
//     user.password = await bcrypt.hash(password, 10);
//     user.agreeToTerms = agreeToTerms;
//     user.userRole = userRole;
//     user.street = street || "";
//     user.city = city || "";
//     user.state = state || "";
//     user.zip = zip || "";
//     user.country = country || "";
//     user.employment = employment || null;
//     user.income = income || null;
//     user.rentalHistory = rentalHistory || null;
//     user.paymentMethod = paymentMethod || null;
//     user.emailVerified = true;
//     user.phoneVerified = true;

//     // Ensure profilePicture is assigned correctly
//     if (
//       req.files &&
//       (req.files as { [fieldname: string]: Express.Multer.File[] })[
//         "profilePicture"
//       ]
//     ) {
//       user.profilePicture = (
//         req.files as { [fieldname: string]: Express.Multer.File[] }
//       )["profilePicture"][0].path;
//     }

//     // Save user to database
//     await userRepository.save(user);

//     // Handle rental files upload and create History record for each file

//     if (
//       req.files &&
//       Array.isArray(
//         (req.files as { [fieldname: string]: Express.Multer.File[] })[
//           "rentalFiles"
//         ]
//       )
//     ) {
//       for (const file of (
//         req.files as { [fieldname: string]: Express.Multer.File[] }
//       )["rentalFiles"]) {
//         const history = new History();
//         history.userId = user.id;
//         history.url = file.path;

//         // Save the history entry for each file
//         await historyRepository.save(history);
//       }
//     }
//     console.log("data", req.file, req.files);

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: user.id,
//         fullName: user.fullName,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ errors: { server: "Internal server error" } });
//   }
// }

export async function handleRegisterUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      fullName,
      email,
      phoneCode = "+91",
      phoneNumber,
      password,
      confirmPassword,
      userRole = "tenant",
      agreeToTerms,
      street = "",
      city = "",
      state = "",
      zip = "",
      country = "",
      employment = null,
      income = null,
      rentalHistory = null,
      paymentMethod, // "card" or "upi"
      upiId,
      "cardDetails.cardNumber": cardNumber,
      "cardDetails.cardHolder": cardHolder,
      "cardDetails.expiry": expiry,
      "cardDetails.cvv": cvv,
      "cardDetails.bankName": bankName,
      "cardDetails.ifsc": ifsc,
    } = req.body;

    // Basic validation
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !agreeToTerms
    ) {
      res
        .status(400)
        .json({ errors: { general: "Required fields are missing" } });
      return;
    }

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ errors: { confirmPassword: "Passwords do not match" } });
      return;
    }

    const AppDataSource = await getConnection();
    const userRepository = AppDataSource.getRepository(User);
    const historyRepo = AppDataSource.getRepository(History);
    const paymentRepo = AppDataSource.getRepository(PaymentMethod);

    const existingUser = await userRepository.findOne({
      where: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (
        req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] })[
          "profilePicture"
        ]
      ) {
        await cloudinary.uploader.destroy(
          (req.files as { [fieldname: string]: Express.Multer.File[] })[
            "profilePicture"
          ][0].filename
        );
      }

      res.status(400).json({
        errors: {
          [existingUser.email === email ? "email" : "phoneNumber"]:
            "Already exists",
        },
      });
      return;
    }

    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.phoneCode = phoneCode;
    user.phoneNumber = phoneNumber;
    user.password = await bcrypt.hash(password, 10);
    user.agreeToTerms = agreeToTerms === "true" || agreeToTerms === true;
    user.userRole = userRole;
    user.street = street;
    user.city = city;
    user.state = state;
    user.zip = zip;
    user.country = country;
    user.employment = employment;
    user.income = income;
    user.rentalHistory = rentalHistory;
    user.paymentMethod = paymentMethod;
    user.emailVerified = true;
    user.phoneVerified = true;

    if (
      req.files &&
      (req.files as { [fieldname: string]: Express.Multer.File[] })[
        "profilePicture"
      ]
    ) {
      user.profilePicture = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["profilePicture"][0].path;
    } else {
      user.profilePicture = "";
    }

    await userRepository.save(user);

    // Save rental history documents
    if (
      req.files &&
      Array.isArray(
        (req.files as { [fieldname: string]: Express.Multer.File[] })[
          "rentalFiles"
        ]
      )
    ) {
      for (const file of (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["rentalFiles"]) {
        const history = new History();
        history.userId = user.id;
        history.url = file.path;
        await historyRepo.save(history);
      }
    }

    // Save payment method
    const pm = new PaymentMethod();
    pm.user = user;

    if (paymentMethod === "Card") {
      // Validate required fields for card
      if (!cardNumber || !cardHolder || !expiry || !cvv || !bankName || !ifsc) {
        res
          .status(400)
          .json({ errors: { paymentMethod: "Incomplete card details" } });
        return;
      }

      pm.type = "Card";
      pm.cardHolder = cardHolder;
      pm.cardNumber = cardNumber;
      // pm.expiry = expiry;
      // pm.cvv = cvv;
      pm.bankName = bankName;
      pm.ifsc = ifsc;
    } else if (paymentMethod === "UPI") {
      if (!upiId) {
        res
          .status(400)
          .json({ errors: { paymentMethod: "UPI ID is required" } });
        return;
      }

      pm.type = "UPI";
      pm.upiId = upiId;
    }

    await paymentRepo.save(pm);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ errors: { server: "Internal server error" } });
  }
}

/**
 * @function handleRegisterOwner
 * @description Handles owner registration.
 */

export async function handleRegisterOwner(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      fullName,
      email,
      phoneCode,
      phoneNumber,
      password,
      confirmPassword,
      companyName,
      agreeToTerms,
      street,
      city,
      state,
      zip,
      country,
      verificationMethod,
      emailOtp,
      phoneOtp,
      emailVerified,
      phoneVerified,
      generatedEmailOtp,
      generatedPhoneOtp,
      verifiedEmailOtp,
      verifiedPhoneOtp,
    } = req.body;

    // Basic validations
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !agreeToTerms
    ) {
      res
        .status(400)
        .json({ errors: { general: "Required fields are missing" } });
      return;
    }

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ errors: { confirmPassword: "Passwords do not match" } });
      return;
    }

    const AppDataSource = await getConnection();
    const ownerRepository = AppDataSource.getRepository(Owner);

    const existingOwner = await ownerRepository.findOne({
      where: [{ email }, { phoneNumber }],
    });

    if (existingOwner) {
      if (req.file?.filename) {
        await cloudinary.uploader.destroy(`${req.file.filename}`);
      }
      res.status(400).json({
        errors: {
          [existingOwner.email === email ? "email" : "phoneNumber"]:
            "Already exists",
        },
      });
      return;
    }

    // Create and save new owner
    const owner = new Owner();
    owner.fullName = fullName;
    owner.email = email;
    owner.phoneCode = phoneCode || "+91";
    owner.phoneNumber = phoneNumber;
    owner.password = await bcrypt.hash(password, 10);
    owner.companyName = companyName || null;
    owner.agreeToTerms = agreeToTerms === "true";
    owner.street = street || "";
    owner.city = city || "";
    owner.state = state || "";
    owner.zip = zip || "";
    owner.country = country || "";
    owner.verificationMethod = verificationMethod || "phone";
    owner.emailOtp = emailOtp || null;
    owner.phoneOtp = phoneOtp || null;
    owner.emailVerified = emailVerified === "true";
    owner.phoneVerified = phoneVerified === "true";
    owner.generatedEmailOtp = generatedEmailOtp || null;
    owner.generatedPhoneOtp = generatedPhoneOtp || null;
    owner.verifiedEmailOtp = verifiedEmailOtp || null;
    owner.verifiedPhoneOtp = verifiedPhoneOtp || null;

    // if (req.file) {
    //   owner.profilePicture = req.file.path;
    // }
    if (
      req.files &&
      (req.files as { [fieldname: string]: Express.Multer.File[] })[
        "profilePicture"
      ]
    ) {
      owner.profilePicture = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["profilePicture"][0].path;
    }

    await ownerRepository.save(owner);

    res.status(201).json({
      message: "Owner registered successfully",
      owner: {
        id: owner.id,
        fullName: owner.fullName,
        email: owner.email,
        phoneNumber: owner.phoneNumber,
        profilePicture: owner.profilePicture,
      },
    });
  } catch (error: any) {
    console.error("Owner registration error:", error);
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(`main_rental/${req.file.filename}`);
    }

    res.status(500).json({
      errors: { server: "Internal server error", detail: error.message },
    });
  }
}

/**
 * @function handleLoginUser
 * @description Handles user login.
 *  */
export async function handleLoginUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, password, userRole } = req.body;

    if (!email || !password || !userRole) {
      res.status(400).json({
        errors: { general: "Email, password, and user role are required" },
      });
      return;
    }

    const AppDataSource = await getConnection();

    let user: User | Owner | null = null;

    if (userRole === "tenant") {
      const userRepository = AppDataSource.getRepository(User);
      user = await userRepository.findOne({ where: { email } });
    } else if (userRole === "owner" || userRole === "admin") {
      const ownerRepository = AppDataSource.getRepository(Owner);
      user = await ownerRepository.findOne({ where: { email } });
    } else {
      res.status(400).json({
        errors: { general: "Invalid user role" },
      });
      return;
    }

    if (!user) {
      res.status(401).json({
        errors: { general: "User not found, please register first" },
      });
      return;
    }

    if (user.block) {
      res.status(403).json({
        errors: { general: "You have been blocked" },
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        errors: { general: "Invalid email or password" },
      });
      return;
    }

    const token = await handleGenerateToken(user);
    const userData = { ...user, token };

    res.status(200).json({
      message: "Login successful",
      userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ errors: { server: "Internal server error" } });
  }
}

/**
 * @function handleGetDetails
 * @description get user details
 */
export async function handleGetDetails(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const id = req.user?.id;
  const userRole = req.user?.userRole;
  if (!id) {
    res.status(401).json({ error: "Unauthorired: User is missing" });
  }
  try {
    const AppDataSource = await getConnection();
    let user: User | Owner | null = null;
    if (userRole === "tenant") {
      const userRepo = AppDataSource.getRepository(User);
      user = await userRepo.findOne({
        where: { id },
      });
    } else if (userRole === "owner" || userRole === "admin") {
      const ownerRepository = AppDataSource.getRepository(Owner);
      user = await ownerRepository.findOne({ where: { id } });
    } else {
      res.status(400).json({
        errors: { general: "Invalid user role" },
      });
      return;
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * @function getAllProperties
 * @description Fetches all properties from the database.
 */
export async function getAllProperties(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();
    const propertyRepo = AppDataSource.getRepository(Property);

    const properties = await propertyRepo.find({
      relations: ["photos", "description", "policies"],
      order: {
        created_at: "DESC",
      },
    });

    res.status(200).json({
      message: "Properties fetched successfully",
      properties,
    });
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
}

//to get particuar room data
export async function handleGetProperty(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();
    const propertyRepo = AppDataSource.getRepository(Property);

    const { propertyId } = req.params;

    const property = await propertyRepo.findOne({
      where: { id: propertyId },
      relations: ["description", "photos", "policies"], // Include all related entities
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ property });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ message: "Failed to fetch property", error });
  }
}

//to update the room data and update the booking data
export async function handleUpdateProperty(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();
    const propertyRepo = AppDataSource.getRepository(Property);
    const userRepo = AppDataSource.getRepository(User);
    const bookingRepo = AppDataSource.getRepository(Booking);

    const propertyId = req.params.propertyId;
    const userId = req.user?.id;
    const { duration, moveInDate, totalAmount } = req.body;

    // Step 1: Fetch property and user
    const property = await propertyRepo.findOneBy({ id: propertyId });
    const user = await userRepo.findOneBy({ id: userId });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Step 2: Check availability
    if (property.noOfSet <= 0) {
      res.status(400).json({ message: "No available rooms for this property" });
      return;
    }

    // Step 3: Decrement available sets (rooms)
    property.noOfSet -= 1;
    await propertyRepo.save(property);

    // Step 4: Create booking
    const newBooking = bookingRepo.create({
      user,
      property,
      duration,
      moveInDate: new Date(moveInDate),
      totalAmount: Number(totalAmount),
    });

    await bookingRepo.save(newBooking);

    res.status(200).json({
      message: "Property booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error booking property:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

//booking data
export async function handleGetBookedProperty(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();
    const bookingRepo = AppDataSource.getRepository(Booking);

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookings = await bookingRepo.find({
      where: { user: { id: userId } },
      relations: ["property"],
      order: { created_at: "DESC" },
    });

    res.status(200).json({
      message: "Booked properties fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching booked properties:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

/**
 *
 * @function handleFullDetails
 * @description Handles fetching full details of the user or owner even thought there booking property and listed property.
 */
export async function handleFullDetails(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const id = req.user?.id;
  const userRole = req.user?.userRole;
  if (!id) {
    res.status(401).json({ error: "Unauthorired: User is missing" });
  }
  try {
    const AppDataSource = await getConnection();
    let user: User | Owner | null = null;
    if (userRole === "tenant") {
      const userRepo = AppDataSource.getRepository(User);
      user = await userRepo.findOne({
        where: { id },
        relations: [
          "bookings",
          "bookings.property",
          "history",
          "paymentMethods",
        ],
      });
    } else if (userRole === "owner" || userRole === "admin") {
      const ownerRepository = AppDataSource.getRepository(Owner);
      user = await ownerRepository.findOne({
        where: { id },
        relations: [
          "properties",
          "properties.photos",
          "properties.description",
          "properties.policies",
        ],
      });
    } else {
      res.status(400).json({
        errors: { general: "Invalid user role" },
      });
      return;
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * @function handleUpdatePassword
 * @description Handles updating the user's password.
 */
export async function handleUpdatePassword(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: "Old and new passwords are required." });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: User is missing." });
      return;
    }
    const { id: userId, userRole } = req.user;

    if (userRole === "tenant") {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ message: "Tenant not found." });
        return;
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        res.status(401).json({ message: "Old password is incorrect." });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await userRepo.save(user);

      res.status(200).json({ message: "Password updated successfully." });
    } else if (userRole === "owner" || userRole === "admin") {
      const ownerRepo = AppDataSource.getRepository(Owner);
      const owner = await ownerRepo.findOne({ where: { id: userId } });

      if (!owner) {
        res.status(404).json({ message: "Owner not found." });
        return;
      }

      const isMatch = await bcrypt.compare(oldPassword, owner.password);
      if (!isMatch) {
        res.status(401).json({ message: "Old password is incorrect." });
        return;
      }

      owner.password = await bcrypt.hash(newPassword, 10);
      await ownerRepo.save(owner);

      res.status(200).json({ message: "Password updated successfully." });
    } else {
      res.status(403).json({ message: "Unauthorized role." });
    }
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

/**
 * @function handleSendPasswordResetLink
 * @description Handles sending a password reset link to the user's email.
 */
export async function handleSendPasswordResetLink(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const AppDataSource = await getConnection();
    const { email, userRole } = req.body;

    if (!email || !userRole || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ message: "Invalid email or role" });
      return;
    }

    let user: User | Owner | null = null;
    const repo =
      userRole === "tenant"
        ? AppDataSource.getRepository(User)
        : AppDataSource.getRepository(Owner);

    user = await repo.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = uuidv4();
    const expiresAt = addMinutes(new Date(), 15); // token valid for 15 minutes

    const resetRepo = AppDataSource.getRepository(PasswordResetToken);
    await resetRepo.save({ email, token, expiresAt, userRole });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    // const resetLink = `https://rentalapp02.netlify.app/reset-password?token=${token}`;

    const emailSent = await passMailService.sendResetPasswordEmail(
      email,
      resetLink
    );

    if (!emailSent) {
      res.status(500).json({ message: "Failed to send reset email" });
      return;
    }

    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    console.error("Error in handleSendPasswordResetLink:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @function handleResetPassword
 * @description Handles resetting the user's password.
 */
export async function handleResetPassword(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    const AppDataSource = await getConnection();

    if (!token || !newPassword) {
      res.status(400).json({ message: "Missing token or password" });
      return;
    }

    const resetRepo = AppDataSource.getRepository(PasswordResetToken);
    const record = await resetRepo.findOne({ where: { token } });

    if (!record || record.expiresAt < new Date()) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const repo =
      record.userRole === "tenant"
        ? AppDataSource.getRepository(User)
        : AppDataSource.getRepository(Owner);

    const user = await repo.findOne({ where: { email: record.email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    if (record.userRole === "tenant") {
      const tenantRepo = AppDataSource.getRepository(User);
      await tenantRepo.save(user as User);
    } else {
      const ownerRepo = AppDataSource.getRepository(Owner);
      await ownerRepo.save(user as Owner);
    }
    await resetRepo.delete({ token });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in handleResetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
