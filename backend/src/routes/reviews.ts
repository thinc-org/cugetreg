import { Effect, Console } from "effect";
import { prisma } from "../db/clients.js";
import * as routes from "../routes_define/review.routes.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { reviewSchema } from "../zod_schemas/user.schema.js";
const app = new OpenAPIHono();
//We can't npm run dev yet because we can't npx prisma generate due to not having a valid DATABASE_URL yet.

//2.1 Submit Review
app.openapi(routes.submitReviewRoute, async (c) => {
  // 1. Get User ID from Token
  const user = c.get("jwtPayload");
  const userId = user.id;

  // 2. Get Validated Input
  const body = c.req.valid("json");

  const program = Effect.gen(function* () {
  type ReviewEntity = {
  id: string;
  userId: string;
  courseNo: string;
  studyProgram: string;
  academicYear: string;
  semester: number;
  rating: number;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  likeCount: number;
  dislikeCount: number;
  created_at: Date;
  };
  const newReview = yield* Effect.tryPromise<ReviewEntity,Error>({
  try: () =>
    prisma.review.create({
      data: {
        userId,
        courseNo: body.courseNo,
        studyProgram: body.studyProgram,
        academicYear: body.academicYear,
        semester: body.semester,
        rating: body.rating,
        content: body.content,
        status: "PENDING",
        likeCount: 0,
        dislikeCount: 0,
      },
    }),
  catch: (error) => new Error(`Prisma Create Error: ${error}`),
  });

  // Construct Response using the returned DB object
  const responseData = {
  message: "Review submitted successfully",
  data: {
    id: newReview.id,
    courseNo: newReview.courseNo,
    studyProgram: newReview.studyProgram,
    academicYear: newReview.academicYear,
    semester: newReview.semester,
    rating: newReview.rating,
    content: newReview.content,
    status: newReview.status,
    likeCount: newReview.likeCount,
    dislikeCount: newReview.dislikeCount,
    createdAt: newReview.created_at.toISOString(),
    myVote: null,
    isOwner: true,
  },
  };

  return c.json(responseData, 201);
  }).pipe(
    Effect.catchAll((err) => {
      return Effect.gen(function* () {
        yield* Console.error("Submit Review Error:", err);
        return c.json({ description: "Internal Server Error" }, 500);
      });
    })
  );

  return await Effect.runPromise(program);
});
//2.2 like/dislike Review
app.openapi(routes.reactReviewRoute, async (c) => {
  // A. Get User ID from Token
  const user = c.get("jwtPayload");
  const userId = user.id;

  // B. Get Validated Input (Params and Body)
  const reviewId = c.req.param("id");
  const { interaction } = c.req.valid("json");

  const program = Effect.gen(function* () {
    // C. Define local type for database transaction result
    type ReactResultEntity = {
      id: string;
      likeCount: number;
      dislikeCount: number;
      isOwner: boolean;
    };

    // D. Execute Database Transaction
    //!!this is temporary until we have proper error handling for not found review
      type PrismaTransaction = {
        interaction: {
          deleteMany: (args: unknown) => Promise<unknown>;
          upsert: (args: unknown) => Promise<unknown>;
          count: (args: unknown) => Promise<number>;
        };
        review: {
          update: (args: unknown) => Promise<{
            id: string;
            userId: string;
          }>;
        };
      };
    const result = yield* Effect.tryPromise<ReactResultEntity, Error>({
      try: () =>
        prisma.$transaction(async (tx:PrismaTransaction) => {
          // 1. Handle the interaction record (Upsert or Delete)
          if (interaction === "N") {
            await tx.interaction.deleteMany({
              where: { userId, reviewId },
            });
          } else {
            await tx.interaction.upsert({
              where: { userId_reviewId: { userId, reviewId } },
              update: { type: interaction },
              create: { userId, reviewId, type: interaction },
            });
          }

          // 2. Recalculate totals for the review
          const likes = await tx.interaction.count({
            where: { reviewId, type: "L" },
          });
          const dislikes = await tx.interaction.count({
            where: { reviewId, type: "D" },
          });

          // 3. Update the Review record counts
          const updatedReview = await tx.review.update({
            where: { id: reviewId },
            data: {
              likeCount: likes,
              dislikeCount: dislikes,
            },
          });

          // 4. Return the specific data needed for the entity
          return {
            id: updatedReview.id,
            likeCount: likes,
            dislikeCount: dislikes,
            isOwner: updatedReview.userId === userId,
          };
        }),
      catch: (error) => new Error(`Transaction Error: ${error}`),
    });

    // E. Construct Response with explicit field mapping
    const responseData = {
      message: "Interaction updated successfully",
      data: {
        id: result.id,
        likeCount: result.likeCount,
        dislikeCount: result.dislikeCount,
        myInteraction: interaction, // Mapped directly from input
        isOwner: result.isOwner,
      },
    };

    return c.json(responseData, 200);
  }).pipe(
    // F. Global Error Handling
    Effect.catchAll((err) => {
      return Effect.gen(function* () {
        yield* Console.error("React Review Error:", err);
        return c.json({ description: "Internal Server Error" }, 500);
      });
    })
  );

  return await Effect.runPromise(program);
});

//2.3 Edit Review

app.openapi(routes.editReviewRoute, async (c) => {
  const user = c.get("jwtPayload");
  const userId = user.id;

  const { id: reviewId } = c.req.valid("param");
  const body = c.req.valid("json");

  const program = Effect.gen(function* () {
    type ReviewEntity = {
      id: string;
      userId: string;
      content: string;
      updated_at: Date;
    };

    const updatedReview = yield* Effect.tryPromise<ReviewEntity, Error>({
      try: async () => {
        const review = await prisma.review.findUnique({
          where: { id: reviewId },
        });

        if (!review) {
          throw new Error("REVIEW_NOT_FOUND");
        }

        if (review.userId !== userId) {
          throw new Error("FORBIDDEN");
        }

        return prisma.review.update({
          where: { id: reviewId },
          data: {
            content: body.content,
          },
        }) as Promise<ReviewEntity>;
      },
      catch: (error) =>
        error instanceof Error
          ? error
          : new Error(String(error)),
    });

    return c.json(
      {
        message: "Review updated successfully",
        data: {
          id: updatedReview.id,
          content: updatedReview.content,
          updatedAt: updatedReview.updated_at.toISOString(),
          isOwner: true,
        },
      },
      200
    );
  }).pipe(
    Effect.catchAll((err) =>
      Effect.gen(function* () {
        yield* Console.error("Edit Review Error:", err);

        if (err.message === "REVIEW_NOT_FOUND") {
          return c.json({ description: "Review not found" }, 404);
        }

        if (err.message === "FORBIDDEN") {
          return c.json({ description: "Forbidden" }, 403);
        }

        return c.json({ description: "Internal Server Error" }, 500);
      })
    )
  );

  return await Effect.runPromise(program);
});
//2.4 Delete Review
// 2.4 Delete Review
app.openapi(routes.deleteReviewRoute, async (c) => {
  const user = c.get("jwtPayload");
  const userId = user.id;

  const { id: reviewId } = c.req.valid("param");

  const program = Effect.gen(function* () {
    type ReviewEntity = {
      id: string;
      userId: string;
    };

    const deletedReview = yield* Effect.tryPromise<ReviewEntity, Error>({
      try: async () => {
        const review = await prisma.review.findUnique({
          where: { id: reviewId },
        });

        if (!review) {
          throw new Error("REVIEW_NOT_FOUND");
        }

        if (review.userId !== userId) {
          throw new Error("FORBIDDEN");
        }

        return prisma.review.delete({
          where: { id: reviewId },
        }) as Promise<ReviewEntity>;
      },
      catch: (error) =>
        error instanceof Error
          ? error
          : new Error(String(error)),
    });

    return c.json(
      {
        message: "Review deleted successfully",
        data: {
          id: deletedReview.id,
          status: "DELETED",
        },
      },
      200
    );
  }).pipe(
    Effect.catchAll((err) =>
      Effect.gen(function* () {
        yield* Console.error("Delete Review Error:", err);

        if (err.message === "REVIEW_NOT_FOUND") {
          return c.json({ description: "Review not found" }, 404);
        }

        if (err.message === "FORBIDDEN") {
          return c.json({ description: "Forbidden" }, 403);
        }

        return c.json({ description: "Internal Server Error" }, 500);
      })
    )
  );

  return await Effect.runPromise(program);
});
