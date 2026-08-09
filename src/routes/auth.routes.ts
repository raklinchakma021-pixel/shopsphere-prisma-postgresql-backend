import { Router } from "express";
import { requireOwnerOrAdmin } from "../middlewares/owner.middleware.js";
import {
  getMe,
  login,
  register,
} from "../services/auth/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  registerSchema,
  loginSchema,
} from "../services/auth/auth.validation.js";
const router = Router();

router.post("/register", register,   validateRequest(registerSchema));
router.post("/login", login,   validateRequest(loginSchema));
router.get("/me", authMiddleware, getMe);
router.patch(
  "/:id",
  authMiddleware,
  requireOwnerOrAdmin,
);
export default router;