import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  passwordReset,
} from "../controllers/auth.controller.js";
import {
  authMiddleware,
  isLoggedIn,
  passwordResetEmail,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/allusers", getAllUser);
router.post("/register", registerUser);
router.post("/login", isLoggedIn, loginUser);
router.get("/logout", authMiddleware, logoutUser);
router.post("/verify", passwordResetEmail); // inside the handler -> next()
router.post("/verify/change-password", passwordReset);

export default router;
