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
  handleSendEmailOtp,
  handleSendPhoneOtp,
  handleUpdateProperty,
  handleVerifyPhoneOtp,
} from "../controller/auth";
// import { uploadProfilePicture } from "../middleware/uploadMiddleware";
import { upload } from "../utils/cloudinaryUploader";
import { uploadProfilePicture } from "../middleware/uploadMiddleware";
const router = express.Router();

router.post("/send-email", handleSendEmailOtp);
router.post("/send-phone", handleSendPhoneOtp);
router.post("/verify-phone", handleVerifyPhoneOtp);
router.post("/register", upload.single("profilePicture"), handleRegisterUser);
// router.post("/owner/register", upload.none(), handleRegisterOwner);
router.post(
  "/owner/register",
  upload.single("profilePicture"),
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

export default router;
