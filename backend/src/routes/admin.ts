import express from "express";
import {
  deleteUser,
  getSelectedAdminUser,
  getUser,
  updateUser,
} from "../controller/admin";

const router = express.Router();

router.get("/admin/getUser", getUser);
router.patch("/admin/updateUser", updateUser);
router.delete("/admin/deleteUser", deleteUser);
router.get("/admin/selectedUser", getSelectedAdminUser);

export default router;
