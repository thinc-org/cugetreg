import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import dotenv from "dotenv";

import admin from "./routes/admin.js";
import authRoute, { middlewareAuth } from "./routes/auth.js";
import carts from "./routes/carts.js";
import courses from "./routes/courses.js";
import publicCarts from "./routes/publicCarts.js";
import reviews from "./routes/reviews.js";
import user from "./routes/user.js";

import type { Variables } from "../src/lib/auth.js";

dotenv.config();

const app = new OpenAPIHono<{ Variables: Variables }>().basePath("/api/v1");

app.openAPIRegistry.registerComponent("securitySchemes", "CookieAuth", {
  type: "apiKey",
  in: "cookie",
  name: "better-auth.session_token",
});

// Without JWT Auth
app.route("/public/carts", publicCarts);
app.route("/auth", authRoute);

// Middleware List

app.use("/admin/*", middlewareAuth); // Middleware from Bearer Token
app.use("/carts/*", middlewareAuth);
app.use("/courses/*", middlewareAuth);
app.use("/reviews/*", middlewareAuth);
app.use("/user/*", middlewareAuth);

// With JWT Auth

app.route("/admin", admin);
app.route("/courses", courses);
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
