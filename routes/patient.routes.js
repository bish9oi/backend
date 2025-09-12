import { Router } from "express";
import { getCurrPatient, loginPatient, logoutPatient, registerPatient } from "../controllers/patient.controllers.js";
import { verifyJwtPatient } from "../middlewares/auth.middleware.js";
const router = Router();

//another way to define routes
router.route("/register").post(registerPatient);
router.route("/login").post(loginPatient);

// protected routes
router.route("/logout").post(verifyJwtPatient, logoutPatient)
router.route("/me").get(verifyJwtPatient, getCurrPatient);

export default router;