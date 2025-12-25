import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.js";
import { account, session, user, verification } from "../schema/auth.ts";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  plugins: [expo()],
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
  trustedOrigins: [
    "http://localhost:5173",
    "mobile://",  // Production mobile scheme
    // Development mode - Expo's exp:// scheme
    "exp://",
    "exp://**",
    "exp://192.168.*.*:*/**",
  ],
});
