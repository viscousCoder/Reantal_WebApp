import express from "express";
import { handlePayment } from "../controller/payment";

const router = express.Router();

router.post("/create-checkout-session", handlePayment);

export default router;
