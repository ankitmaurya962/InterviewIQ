import express from "express"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router();

router.post("/order", isAuth, createOrder)
router.post("/verify", isAuth, verifyPayment)

export default router;