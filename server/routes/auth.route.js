import express from "express";
const router = express.Router();
import { googleAuth, logout } from "../controllers/auth.controller.js";

router.post("/google", googleAuth);
router.get("/logout", logout);

export default router;