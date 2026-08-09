import { Router } from "express";
import {
  deleteUserController,
  getUser,
  getUsers,
  updateUserController,
} from "../services/user/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = Router();

// Admin: get all users
router.get(
  "/",
  authMiddleware,
  requireAdmin,
  getUsers
);

// Authenticated user/admin: get user by ID
router.get(
  "/:id",
  authMiddleware,
  getUser
);

// Authenticated user/admin: update user
router.patch(
  "/:id",
  authMiddleware,
  updateUserController
);

// Admin: soft delete user
router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  deleteUserController
);

export default router;