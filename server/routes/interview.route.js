import express from "express";
import isAuth from "../middleware/isAuth.js";
import { analyzeResume, finishInterview, generateQuestion, submitAnswer } from "../controllers/interview.controller.js";
import {upload} from "../middleware/multer.js";
const router = express.Router();

router.post("/resume",isAuth, upload.single("resume"),analyzeResume)
router.post("/generate-questions", isAuth, generateQuestion);
router.post("/submit-anser", isAuth, submitAnswer);
router.post("/finish", isAuth, finishInterview);

export default router;