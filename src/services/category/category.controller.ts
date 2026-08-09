import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "./category.service.js";
import { successResponse } from "../../utils/response.js";

const getId = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Invalid category ID");
  }

  return id;
};

export const createCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await createCategory({
      name,
      description,
    });

    return successResponse(
      res,
      201,
      "Category created successfully",
      category
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create category",
    });
  }
};

export const getCategoriesController = async (
  _req: Request,
  res: Response
) => {
  try {
    const categories = await getAllCategories();

    return successResponse(
      res,
      200,
      "Categories retrieved successfully",
      categories
    );
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
    });
  }
};

export const getCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return successResponse(
      res,
      200,
      "Category retrieved successfully",
      category
    );
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    const category = await updateCategory(
      id,
      req.body
    );

    return successResponse(
      res,
      200,
      "Category updated successfully",
      category
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category",
    });
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    const category = await deleteCategory(id);

    return successResponse(
      res,
      200,
      "Category deleted successfully",
      category
    );
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete category",
    });
  }
};