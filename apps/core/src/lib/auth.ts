import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

import { prisma } from "../db/clients.js";
import { env } from "../env.js";

const ALLOW_NON_CHULA = false;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [openAPI()],
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:5173"],
  databaseHooks: {
    user: {
      create: {
        before: async (user, _context) => {
          const allowUser =
            user.email.endsWith("chula.ac.th") || ALLOW_NON_CHULA;

          if (!allowUser) {
            throw new APIError("UNAUTHORIZED", {
              message: "non chula email",
            });
          }
        },
      },
    },
  },
});

export type Variables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};
