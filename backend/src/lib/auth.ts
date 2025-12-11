import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.js";
import { account, session, user, verification } from "../schema/auth.ts";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: false,
      httpOnly: true,
    },
  },
  trustedOrigins: ["http://localhost:5173"],
});
