import { env } from "@/env.js";
import { auth } from "@/lib/auth.js";

import { OpenAPIHono } from "@hono/zod-openapi";
import { type MiddlewareHandler } from "hono";

// Proxy all /auth/* requests directly to better-auth (login, callback, session, signout)
const authRoute = new OpenAPIHono();

authRoute.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

// Inject session user into context; in non-prod bypasses real auth with a hardcoded user for local dev
export const middlewareAuth: MiddlewareHandler = async (c, next) => {
  if (env.APP_MODE !== "prod") {
    c.set("user", {
      id: "63dea25026f1907da44534a7",
      email: "6438097921@student.chula.ac.th",
    } as typeof auth.$Infer.Session.user);
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

// Guards service-to-service routes (e.g. CI creating an announcement) with a
// shared-secret header instead of a user session — there's no session to check.
export const middlewareInternalToken: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("X-Internal-Token");

  if (!token || token !== env.INTERNAL_API_TOKEN) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  await next();
};

export const includeAuth: MiddlewareHandler = async (c, next) => {
  if (env.APP_MODE !== "prod") {
    c.set("user", {
      id: "63dea25026f1907da44534a7",
      email: "6438097921@student.chula.ac.th",
    } as typeof auth.$Infer.Session.user);
  } else {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session) {
      c.set("user", session.user);
      c.set("session", session.session);
    } else {
      c.set("user", null);
      c.set("session", null);
    }
  }

  await next();
};

export default authRoute;
