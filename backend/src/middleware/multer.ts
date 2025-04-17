import multer from "multer";

const storage = multer.memoryStorage(); // keep files in memory
export const upload = multer({ storage });
