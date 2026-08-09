import { Request, Response } from "express";
import {
  createReview,
  deleteReview,
  deleteReviewByAdmin,
  getAllReviews,
  getReviewById,
  updateReview,
} from "./review.service.js";
import { successResponse } from "../../utils/response.js";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const getId = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Invalid review ID");
  }

  return id;
};

export const createReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      rating,
      comment,
      productId,
    } = req.body;

    if (rating === undefined || !productId) {
      return res.status(400).json({
        success: false,
        message: "Rating and productId are required",
      });
    }

    const review = await createReview({
      rating: Number(rating),
      comment,
      productId,
      userId: req.user.userId,
    });

    return successResponse(
      res,
      201,
      "Review created successfully",
      review
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create review",
    });
  }
};

export const getReviewsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const reviews = await getAllReviews();

    return successResponse(
      res,
      200,
      "Reviews retrieved successfully",
      reviews
    );
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews",
    });
  }
};

export const getReviewController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    const review = await getReviewById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return successResponse(
      res,
      200,
      "Review retrieved successfully",
      review
    );
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid review ID",
    });
  }
};

export const updateReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = getId(req);

    const review = await updateReview(
      id,
      req.user.userId,
      req.body
    );

    return successResponse(
      res,
      200,
      "Review updated successfully",
      review
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update review",
    });
  }
};

export const deleteReviewController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = getId(req);

    if (req.user.role === "ADMIN") {
      await deleteReviewByAdmin(id);
    } else {
      await deleteReview(
        id,
        req.user.userId
      );
    }

    return successResponse(
      res,
      200,
      "Review deleted successfully",
      null
    );
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete review",
    });
  }
};