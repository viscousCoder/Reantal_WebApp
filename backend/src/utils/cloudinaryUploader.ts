import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "main_rental",
      allowed_formats: ["jpg", "jpeg", "png", "avif"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

export const upload = multer({ storage });
