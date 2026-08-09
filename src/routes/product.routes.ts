import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "../services/product/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../services/product/product.validation.js";
const router = Router();

router.post(
  "/",
  authMiddleware,
  requireAdmin,
  validateRequest(createProductSchema),
  createProductController
);

router.get(
  "/",
  getProductsController
);

router.get(
  "/:id",
  getProductController
);

router.patch(
  "/:id",
  authMiddleware,
  requireAdmin,
    validateRequest(updateProductSchema),
  updateProductController
);

router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  deleteProductController
);

export default router;