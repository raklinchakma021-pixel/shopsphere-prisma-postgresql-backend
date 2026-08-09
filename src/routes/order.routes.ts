import { Router } from "express";
import {
  createOrderController,
  deleteOrderController,
  getOrderController,
  getOrdersController,
  updateOrderStatusController,
} from "../services/order/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../services/order/order.validation.js";
const router = Router();

router.post(
  "/",
  authMiddleware,
   validateRequest(createOrderSchema),
  createOrderController
);

router.get(
  "/",
  authMiddleware,
  getOrdersController
);

router.get(
  "/:id",
  authMiddleware,
  getOrderController
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireAdmin,
   validateRequest(updateOrderStatusSchema),
  updateOrderStatusController
);

router.delete(
  "/:id",
  authMiddleware,
  deleteOrderController
);

export default router;