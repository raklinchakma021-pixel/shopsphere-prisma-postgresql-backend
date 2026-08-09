import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),

    comment: z
      .string()
      .trim()
      .max(1000, "Comment is too long")
      .optional(),

    productId: z
      .string()
      .uuid("Invalid product ID"),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),

    comment: z
      .string()
      .trim()
      .max(1000)
      .optional(),
  }),

  params: z.object({
    id: z.string().uuid("Invalid review ID"),
  }),

  query: z.object({}),
});