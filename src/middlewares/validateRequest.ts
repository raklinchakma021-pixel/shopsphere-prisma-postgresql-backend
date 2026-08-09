import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequest = (
  schema: z.ZodType<{
    body?: unknown;
    params?: unknown;
    query?: unknown;
  }>
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = result.data;

    // req.body can be replaced
    if (data.body !== undefined) {
      req.body = data.body;
    }

    // Do NOT assign to req.params or req.query.
    // They are read-only in your current Express setup.

    next();
  };
};