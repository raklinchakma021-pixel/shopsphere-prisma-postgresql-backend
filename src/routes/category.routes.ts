import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController,
} from "../services/category/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../services/category/category.validation.js";
const router = Router();

router.post(
  "/",
  authMiddleware,
  requireAdmin,
  validateRequest(createCategorySchema),
  createCategoryController
);

router.get(
  "/",
  getCategoriesController
);

router.get(
  "/:id",
  getCategoryController
);

router.patch(
  "/:id",
  authMiddleware,
  requireAdmin,
  validateRequest(updateCategorySchema),
  updateCategoryController
);

router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  deleteCategoryController
);

export default router;