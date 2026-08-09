import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./product.service.js";
import { successResponse } from "../../utils/response.js";

const getId = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Invalid product ID");
  }

  return id;
};

export const createProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      status,
      categoryId,
    } = req.body;

    if (!name || price === undefined || stock === undefined || !categoryId) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price, stock and categoryId are required",
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price and stock cannot be negative",
      });
    }

    const product = await createProduct({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      status,
      categoryId,
    });

    return successResponse(
      res,
      201,
      "Product created successfully",
      product
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create product",
    });
  }
};

export const getProductsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const products = await getAllProducts();

    return successResponse(
      res,
      200,
      "Products retrieved successfully",
      products
    );
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

export const getProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return successResponse(
      res,
      200,
      "Product retrieved successfully",
      product
    );
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

export const updateProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    const product = await updateProduct(
      id,
      req.body
    );

    return successResponse(
      res,
      200,
      "Product updated successfully",
      product
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product",
    });
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getId(req);

    const product = await deleteProduct(id);

    return successResponse(
      res,
      200,
      "Product deleted successfully",
      product
    );
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete product",
    });
  }
};