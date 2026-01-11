import { Hono } from "hono";
import { googleAuth } from "@hono/oauth-providers/google";
import { sign } from "hono/jwt";

const auth = new Hono();
const hr = 1;

if (process.env.NODE_ENV !== "production") {
  auth.get("/test-login", async (c) => {
    const JWT_SECRET = process.env.JWT_SECRET || "12345678";
    const mockUser = {
      id: "mock-12345",
      email: "test@cugetreg.com",
      name: "สมชาย ทดสอบ",
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
    client_id: process.env.GOOGLE_CLIENT_ID || "", // from Google Cloud Console
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "", // from Google Cloud Console
    scope: ["openid", "email", "profile"],
  }),
  async (c) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const googleUser = c.get("user-google");

    if (!googleUser) return c.json({ error: "Auth Failed" }, 401);

    const payload = {
      id: googleUser.id,
      email: googleUser.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * hr,
    };

    const token = await sign(payload, JWT_SECRET);

    return c.json({
      message: "Login Success",
      token: token,
      user: googleUser,
    });
  }
);

export default auth;
