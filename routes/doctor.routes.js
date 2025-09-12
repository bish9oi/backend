import { Router } from "express";
import { loginUser, logoutUser, registerUser, getCurrUser } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/register", registerUser);
// You can add more user-related routes here, such as login, logout, etc.
// Example: router.post("/login", loginUser);

//another way to define routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// protected routes
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/me").get(verifyJwt, getCurrUser);

export default router;
// This file is currently empty, but you can add your user-related routes here.