// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";
// import cloudinary from "../config/cloudinary";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "main_rental",
//       allowed_formats: ["jpg", "jpeg", "png", "avif"],
//       transformation: [{ width: 500, height: 500, crop: "limit" }],
//     };
//   },
// });

// export const upload = multer({ storage });

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "rental-uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "avif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

// Set up multer with the storage configuration
export const upload = multer({ storage }).fields([
  { name: "profilePicture", maxCount: 1 }, // Single file for profile picture
  { name: "rentalFiles", maxCount: 5 }, // Multiple files for rental files (limit to 5)
]);
