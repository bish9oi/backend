// routes/dashboard.routes.js
import express from "express";
import { verifyJwt, verifyJwtPatient } from "../middlewares/auth.middleware.js";
import {
  createIssue,
  getMyIssues,
  getMyIssueById,
  getOpenIssues,
  getIssueById,
  reviewIssue,
  downloadIssueReport
} from "../controllers/issue.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

/* ---------------- PATIENT ROUTES ---------------- */
router.post("/patient/create", verifyJwtPatient,upload.single("image"), createIssue);
router.get("/patient/issues", verifyJwtPatient, getMyIssues);
router.get("/patient/issues/:id", verifyJwtPatient, getMyIssueById);
router.get("/patient/issue/:id/pdf", verifyJwtPatient, downloadIssueReport);

/* ---------------- DOCTOR ROUTES ---------------- */
router.get("/doctor/issues", verifyJwt, getOpenIssues);
router.get("/doctor/issues/:id", verifyJwt, getIssueById);
router.post("/doctor/review/:id", verifyJwt, reviewIssue);

export default router;
