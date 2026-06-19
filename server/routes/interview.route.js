import express from "express";
import isAuth from "../middleware/isAuth.js";
import { analyzeResume } from "../controllers/interview.controller.js";
import {upload} from "../middleware/multer.js";
const router = express.Router();

router.post("/resume",isAuth, upload.single("resume"),analyzeResume)

export default router;