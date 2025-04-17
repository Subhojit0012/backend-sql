import express from "express";
import { Router } from "express";
import { passwordReset } from "../../controllers/auth.controller";

const router = Router();

router.post("/change-password", passwordReset);

export default router;
