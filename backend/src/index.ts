import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import public_carts from "./routes/public_carts.js";
import admin from "./routes/admin.js";
import courses from "./routes/courses.js";
import carts from "./routes/carts.js";
import reviews from "./routes/reviews.js";
import user from "./routes/user.js";
import auth, { middleware_auth } from "./routes/auth.js";

dotenv.config();

const app = new Hono()
  .basePath("/api/v1")

  // Without JWT Auth

  .route("/public/carts", public_carts)
  .route("/auth", auth)

  // Middleware List

  .all("/admin/*", middleware_auth) // Middleware from Bearer Token
  .all("/carts/*", middleware_auth)
  .all("/courses/*", middleware_auth)
  .all("/reviews/*", middleware_auth)
  .all("/user/*", middleware_auth)

  // With JWT Auth

  .route("/admin", admin)
  .route("/courses", courses)
  .route("/carts", carts)
  .route("/reviews", reviews)
  .route("/user", user);

export type AppType = typeof app;

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
