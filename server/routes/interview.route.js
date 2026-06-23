import express from "express";
import isAuth from "../middleware/isAuth.js";
import { analyzeResume, finishInterview, generateQuestion, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js";
import {upload} from "../middleware/multer.js";
const router = express.Router();

router.post("/resume",isAuth, upload.single("resume"),analyzeResume)
router.post("/generate-questions", isAuth, generateQuestion);
router.post("/submit-answer", isAuth, submitAnswer);
router.post("/finish", isAuth, finishInterview);

router.get("/get-interview", isAuth, getMyInterviews)
router.get("/report/:id", isAuth, getInterviewReport)

export default router;