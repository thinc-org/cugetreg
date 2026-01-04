import { googleAuth } from "@hono/oauth-providers/google";
import { sign, jwt } from "hono/jwt";
import { prisma } from "../db/clients.js";
import { env } from "../env.js";
import { OpenAPIHono } from "@hono/zod-openapi";

export const middlewareAuth = jwt({ secret: env.JWT_SECRET });

const auth = new OpenAPIHono();
const hr = 1;

if (process.env.APP_MODE === "dev") {
  auth.get("/test-login", async (c) => {
    const JWT_SECRET = env.JWT_SECRET || "12345678";
    const mockUser = {
      id: "63dea25026f1907da44534a7",
      email: "6438097921@student.chula.ac.th",
      name: "Thanayut [Bank] Tiratatri",
      picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
    };
    const payload = {
      id: mockUser.id,
      email: mockUser.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const token = await sign(payload, JWT_SECRET);
    return c.json({
      message: "Mock Login Success (Dev Mode Only)",
      token: token,
      user: mockUser,
    });
  });
}

auth.get(
  "/login",
  googleAuth({
    client_id: env.GOOGLE_CLIENT_ID || "", // from Google Cloud Console
    client_secret: env.GOOGLE_CLIENT_SECRET || "", // from Google Cloud Console
    scope: ["openid", "email", "profile"],
  }),
  async (c) => {
    const JWT_SECRET = env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const googleUser = c.get("user-google");

    if (!googleUser) return c.json({ error: "Auth Failed" }, 401);

    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        name: googleUser.name!, // update new name
      },
      create: {
        email: googleUser.email!,
        name: googleUser.name!,
        googleId: googleUser.id!,
      },
    });

    const payload = {
      id: user.id,
      email: googleUser.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * hr,
    };

    const token = await sign(payload, JWT_SECRET);

    return c.json({
      message: "Login Success",
      token: token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  }
);

export default auth;
