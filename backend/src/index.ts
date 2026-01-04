import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { OpenAPIHono } from "@hono/zod-openapi";
import public_carts from "./routes/public_carts.js";
import admin from "./routes/admin.js";
import courses from "./routes/courses.js";
import carts from "./routes/carts.js";
import reviews from "./routes/reviews.js";
import user from "./routes/user.js";
import auth, { middleware_auth } from "./routes/auth.js";
import { swaggerUI } from "@hono/swagger-ui";

dotenv.config();

const app = new OpenAPIHono().basePath("/api/v1");

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// Without JWT Auth
app.route("/public/carts", public_carts);
app.route("/auth", auth);

// Middleware List

app.use("/admin/*", middleware_auth); // Middleware from Bearer Token
app.use("/carts/*", middleware_auth);
app.use("/courses/*", middleware_auth);
app.use("/reviews/*", middleware_auth);
app.use("/user/*", middleware_auth);

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
  }
);
