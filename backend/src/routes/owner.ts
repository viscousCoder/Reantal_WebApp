// routes/property.ts
import express from "express";
import { upload } from "../middleware/multer";
import {
  handleGetCurrentOwnerProperty,
  handleProperty,
} from "../controller/owner";
const router = express.Router();

router.post("/property", upload.array("photos"), handleProperty);
router.post("/getCurrentOwnerProperty", handleGetCurrentOwnerProperty);
export default router;
