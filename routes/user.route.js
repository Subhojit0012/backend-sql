import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
} from "../controllers/auth.controller.js";
import { authMiddleware, isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/allusers", getAllUser);
router.post("/register", registerUser);
router.post("/login", isLoggedIn, loginUser);
router.get("/logout", authMiddleware, logoutUser);

export default router;
