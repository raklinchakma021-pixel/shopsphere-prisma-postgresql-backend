import { prisma } from "../../lib/prisma.js";

interface CreateReviewInput {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
}

interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export const createReview = async (
  input: CreateReviewInput
) => {
  if (input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const product = await prisma.product.findFirst({
    where: {
      id: input.productId,
      isDeleted: false,
      status: {
        not: "INACTIVE",
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: input.userId,
        productId: input.productId,
      },
    },
  });

  if (existingReview && !existingReview.isDeleted) {
    throw new Error("You have already reviewed this product");
  }

  if (existingReview && existingReview.isDeleted) {
    return prisma.review.update({
      where: {
        id: existingReview.id,
      },
      data: {
        rating: input.rating,
        comment: input.comment,
        isDeleted: false,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  return prisma.review.create({
    data: {
      rating: input.rating,
      comment: input.comment,
      userId: input.userId,
      productId: input.productId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getAllReviews = async () => {
  return prisma.review.findMany({
    where: {
      isDeleted: false,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getReviewById = async (
  reviewId: string
) => {
  return prisma.review.findFirst({
    where: {
      id: reviewId,
      isDeleted: false,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateReview = async (
  reviewId: string,
  userId: string,
  input: UpdateReviewInput
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new Error("Review not found or unauthorized");
  }

  if (
    input.rating !== undefined &&
    (input.rating < 1 || input.rating > 5)
  ) {
    throw new Error("Rating must be between 1 and 5");
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: input,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteReview = async (
  reviewId: string,
  userId: string
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new Error("Review not found or unauthorized");
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const deleteReviewByAdmin = async (
  reviewId: string
) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      isDeleted: true,
    },
  });
};