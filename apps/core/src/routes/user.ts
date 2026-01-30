import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../db/clients.js";
import * as schema from "../zod_schemas/user.schema.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import * as routes from "../routes_define/user.routes.js";
import { Effect,Console } from "effect";
import { Prisma } from "@prisma/client/extension";

const user = new OpenAPIHono()

//5.1
.openapi(routes.getUserInformationRoute, async(c)=>{
const user = c.get("id");
  const userId = user.id;

  const program = Effect.gen(function* () {
    // 2. Fetch user from Database
    // Using findUnique because we are looking for 1 specific user
    const userInfo = yield* Effect.tryPromise({
      try: () =>
        prisma.user.findUnique({
          where: {
            id: userId,
          },
        }),
      catch: (error) => new Error(`Prisma Error: ${error}`),
    });

    // 3. Handle Case: User not found (404)
    // findUnique returns null if no record exists
    if (!userInfo) {
      return c.json({ description: "User not found" }, 404);
    }
    return c.json(userInfo, 200);

  }).pipe(
    Effect.catchAll((err) => {
      return Effect.gen(function* () {
        yield* Console.error("Fetch User Error:", err);
        return c.json({ description: "Internal Server Error" }, 500);
      });
    })
  );

  return await Effect.runPromise(program);
})

//5.2
.openapi(routes.getUserReviewRoute,async(c)=>{
// 1. Get User ID from Token
  const user = c.get("id");
  const userId = user.id;

  const { page, limit, status } = c.req.valid("query");

  const program = Effect.gen(function* () {
    // 3. Calculate Pagination Offset
    const skip = (page - 1) * limit;
    const whereClause = {
      userId: userId, // Only get reviews by this user
      status: status, // Optional: undefined if not provided, which Prisma ignores
    };

    // 5. Run Database Queries (Count + Fetch)
    // We use Effect.all to run them in parallel for better performance
    const [totalCount, reviews] = yield* Effect.tryPromise({
      try: () =>
        Promise.all([
          // Query A: Count total matching reviews (for metadata)
          prisma.review.count({
            where: whereClause,
          }),
          // Query B: Fetch the actual page of data
          prisma.review.findMany({
            where: whereClause,
            take: limit, // How many to return
            skip: skip,  // How many to skip
            orderBy: {
              created_at: "desc", // Default: Newest first
            },
          }),
        ]),
      catch: (error) => new Error(`Prisma Error: ${error}`),
    });

    // 6. Construct Response Object
    // This matches the 'getReviewsResponseSchema' we defined earlier
    const response = {
      total_reviews: totalCount,
      page: page,
      limit: limit,
      reviews: reviews, // The array of review objects
    };

    return c.json(response, 200);

  }).pipe(
    // 7. Error Handling
    Effect.catchAll((err) => {
      return Effect.gen(function* () {
        yield* Console.error("Fetch User Reviews Error:", err);
        return c.json({ description: "Internal Server Error" }, 500);
      });
    })
  );

  return await Effect.runPromise(program);
})
//5.3
.openapi(routes.updateUserInformationRoute, async (c) => {
  // 1. Get User ID from Token
  const user = c.get("id");
  const userId = user.id;

  // 2. Get Validated Body Data
  // 'json' corresponds to the request body schema we defined
  const { name, faculty, department } = c.req.valid("json");

  const program = Effect.gen(function* () {
    // 3. Perform the Update
    // Prisma's update throws an error if the record doesn't exist (unlike findUnique)
    const updatedUser = yield* Effect.tryPromise({
      try: () =>
        prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            // Prisma ignores keys that are undefined.
            // Since our Zod schema made these optional, we can pass them directly.
            name: name,
            faculty: faculty,
            department: department,
            // If you need to update 'updated_at' manually:
            // updated_at: new Date(), 
          },
        }),
      catch: (error) => {
        // 4. Handle Specific "User Not Found" Error
        // Prisma error code P2025 means "Record to update not found."
        return new Error(`Prisma Error: ${error}`);
      },
    });

    // 5. Construct Success Response
    return c.json(
      {
        message: "User profile updated successfully.",
        user: updatedUser,
      },
      200
    );
  }).pipe(
    // 6. Global Error Handling
    Effect.catchAll((err) => {
      return Effect.gen(function* () {
        // Handle the specific 404 case we threw above
        if (err.message === "UserNotFound") {
          return c.json({ description: "User not found" }, 404);
        }

        // Handle generic 500 errors
        yield* Console.error("Update User Error:", err);
        return c.json({ description: "Internal Server Error" }, 500);
      });
    })
  );            

  return await Effect.runPromise(program);
});




export default user;
