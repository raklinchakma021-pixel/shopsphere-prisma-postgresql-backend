import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters"),

    description: z
      .string()
      .trim()
      .optional(),

    price: z
      .number()
      .positive("Price must be greater than 0"),

    stock: z
      .number()
      .int()
      .min(0, "Stock cannot be negative"),

    status: z
      .enum([
        "ACTIVE",
        "INACTIVE",
        "OUT_OF_STOCK",
      ])
      .optional(),

    categoryId: z
      .string()
      .uuid("Invalid category ID"),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .optional(),

    description: z
      .string()
      .trim()
      .optional(),

    price: z
      .number()
      .positive()
      .optional(),

    stock: z
      .number()
      .int()
      .min(0)
      .optional(),

    status: z
      .enum([
        "ACTIVE",
        "INACTIVE",
        "OUT_OF_STOCK",
      ])
      .optional(),

    categoryId: z
      .string()
      .uuid()
      .optional(),
  }),

  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),

  query: z.object({}),
});