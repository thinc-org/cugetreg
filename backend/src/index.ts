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

const app = new Hono();
const api = new Hono().basePath("/api/v1");

// Without JWT Auth

api.route("/public/carts", public_carts);
api.route("/auth", auth);

// Middleware List

api.all("/admin/*", middleware_auth); // Middleware from Bearer Token
api.all("/carts/*", middleware_auth);
api.all("/courses/*", middleware_auth);
api.all("/reviews/*", middleware_auth);
api.all("/user/*", middleware_auth);

// With JWT Auth

api.route("/admin", admin);
api.route("/courses", courses);
api.route("/carts", carts);
api.route("/reviews", reviews);
api.route("/user", user);

app.route("/", api);
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
