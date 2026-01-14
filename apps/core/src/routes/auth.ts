import { type MiddlewareHandler } from "hono";
import { auth } from "../lib/auth.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { env } from "../env.js";

const authRoute = new OpenAPIHono();

authRoute.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

export const middlewareAuth: MiddlewareHandler = async (c, next) => {
  if (env.APP_MODE !== "prod") {
    c.set("user", {
      id: "63dea25026f1907da44534a7",
      email: "6438097921@student.chula.ac.th",
    } as any);
  } else {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);
  }

  await next();
};

export default authRoute;
