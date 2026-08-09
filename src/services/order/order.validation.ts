import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    productId: z
      .string()
      .uuid("Invalid product ID"),

    quantity: z
      .number()
      .int()
      .positive("Quantity must be greater than 0"),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ]),
  }),

  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),

  query: z.object({}),
});