// // middleware/uploadMiddleware.ts
// import { Request, Response, NextFunction } from "express";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";

// // Configure Cloudinary storage for multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "main_rental",
//     allowed_formats: ["jpg", "png", "jpeg"],
//     transformation: [{ width: 500, height: 500, crop: "limit" }],
//   } as any,
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const mimetype = filetypes.test(file.mimetype);
//     if (mimetype) {
//       return cb(null, true);
//     }
//     cb(new Error("Error: Images only (jpeg, jpg, png)!"));
//   },
// });

// // Middleware to handle file upload
// export const uploadProfilePicture = upload.single("profilePictureFile");
// backend/src/middleware/uploadMiddleware.ts

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Define params type explicitly
interface CloudinaryParams {
  folder?: string;
  allowed_formats?: string[];
  transformation?: Array<{ width?: number; height?: number; crop?: string }>;
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "main_rental",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  } as CloudinaryParams,
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|avif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Error: Images only (jpeg, jpg, png)!"));
  },
});

// Middleware to handle file upload
export const uploadProfilePicture = upload.single("profilePicture");
