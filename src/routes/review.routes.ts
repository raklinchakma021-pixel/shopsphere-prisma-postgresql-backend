import { Router } from "express";
import {
  createReviewController,
  deleteReviewController,
  getReviewController,
  getReviewsController,
  updateReviewController,
} from "../services/review/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../services/review/review.validation.js";
const router = Router();

router.post(
  "/",
  authMiddleware,
  validateRequest(createReviewSchema),
  createReviewController
);

router.get(
  "/",
  getReviewsController
);

router.get(
  "/:id",
  getReviewController
);

router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updateReviewSchema),
  updateReviewController
);

router.delete(
  "/:id",
  authMiddleware,
  deleteReviewController
);

export default router;