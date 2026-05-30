import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import dotenv from "dotenv";
import { cors } from "hono/cors";

import admin from "./routes/admin.js";
import authRoute, { includeAuth, middlewareAuth } from "./routes/auth.js";
import carts from "./routes/carts.js";
import courses from "./routes/courses.js";
import publicCarts from "./routes/publicCarts.js";
import reviews from "./routes/reviews.js";
import user from "./routes/user.js";

import type { Variables } from "../src/lib/auth.js";

dotenv.config();

// All routes are under /api/v1
const app = new OpenAPIHono<{ Variables: Variables }>().basePath("/api/v1");

// Allow frontend dev servers and local prod preview to call the API with cookies
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Upgrade-Insecure-Requests",
    ],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Register cookie-based session auth scheme so Swagger UI shows the lock icon
app.openAPIRegistry.registerComponent("securitySchemes", "CookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "better-auth.session_token",
});

app.use("/courses", includeAuth);

// Public routes — no auth required
app.route("/public/carts", publicCarts);
app.route("/auth", authRoute);
app.route("/courses", courses);

// Middleware List
app.use("/admin/*", middlewareAuth); // Middleware from Bearer Token
app.use("/carts/*", middlewareAuth);
app.use("/reviews/*", middlewareAuth);
app.use("/user/*", middlewareAuth);

// Protected routes (session injected by middlewareAuth above)
app.route("/admin", admin);
app.route("/carts", carts);
app.route("/reviews", reviews);
app.route("/user", user);

app
  .doc("/specification", {
    openapi: "3.0.0",
    info: { title: "CuGetRegV2 API", version: "1.0.0" },
  })
  .get("/docs", swaggerUI({ url: "/api/v1/specification" }));

export type AppType = typeof app;

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
