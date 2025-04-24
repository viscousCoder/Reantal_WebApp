import express from "express";
import {
  getAllProperties,
  handleFullDetails,
  handleGetBookedProperty,
  handleGetDetails,
  handleGetProperty,
  handleLoginUser,
  handleRegisterOwner,
  handleRegisterUser,
  handleResetPassword,
  handleSendEmailOtp,
  handleSendPasswordResetLink,
  handleSendPhoneOtp,
  handleUpdatePassword,
  handleUpdateProperty,
  handleVerifyPhoneOtp,
} from "../controller/auth";
// import { uploadProfilePicture } from "../middleware/uploadMiddleware";
// import { upload } from "../utils/cloudinaryUploader";
import { uploadProfilePicture } from "../middleware/uploadMiddleware";
import { upload } from "../utils/cloudinaryUploader";
const router = express.Router();

router.post("/send-email", handleSendEmailOtp);
router.post("/send-phone", handleSendPhoneOtp);
router.post("/verify-phone", handleVerifyPhoneOtp);
// router.post("/register", upload.single("profilePicture"), handleRegisterUser);

// router.post(
//   "/register",
//   upload.single("profilePicture"),
//   upload.array("rentalFiles"),
//   handleRegisterUser
// );

router.post("/register", upload, handleRegisterUser);

// router.post("/owner/register", upload.none(), handleRegisterOwner);

router.post(
  "/owner/register",
  // upload.single("profilePicture"),
  upload,
  express.json(),
  // uploadProfilePicture,
  handleRegisterOwner
);

// router.post("/register", uploadProfilePicture, handleRegisterUser);

router.post("/login", handleLoginUser);
router.get("/getDetails", handleGetDetails);
router.get("/getAllProperties", getAllProperties);
router.get("/property/:propertyId", handleGetProperty);

router.put("/update/:propertyId", handleUpdateProperty);
router.get("/get-booked-property", handleGetBookedProperty);
router.get("/getFullDetails", handleFullDetails);

router.post("/update-password", handleUpdatePassword);
router.post("/reset-password", handleSendPasswordResetLink);
router.post("/reset-password/:token", handleResetPassword);

export default router;
