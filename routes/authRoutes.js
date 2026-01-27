import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, isAdmin } from "../middlewares/authGuard.js";
import { getProfile, createAdmin  } from "../controllers/userController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.put("/make-admin", protect, isAdmin, createAdmin);

router.get("/profile", protect, getProfile);

export default router;
