import { prisma } from "@/db/clients.js";
import { env } from "@/env.js";
import { mapFaculty } from "@/utils/utils.js";

import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

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
  trustedOrigins: [
    "http://localhost:5173",
    ...(env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((o) => o.trim()) ?? []),
  ],
  user: {
    additionalFields: {
      faculty: {
        type: "string",
        required: false,
      },
      department: {
        type: "string",
        required: false,
      },
    },
  },
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

          const studentId = user.email.split("@")[0];
          const facultyId = studentId.slice(
            studentId.length - 2,
            studentId.length,
          );

          return {
            data: {
              ...user,
              faculty: mapFaculty(facultyId).en === "UNKOWN" ? null : facultyId,
            },
          };
        },
      },
    },
  },
});

// Hono context variables injected by middlewareAuth — access via c.get("user")
export type Variables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};
