import express from "express";
const router = express.Router();
import { getCurrentUser } from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";

router.get("/current-user", isAuth, getCurrentUser)

export default router;