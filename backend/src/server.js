import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fromNodeHeaders } from "better-auth/node";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import { db } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

// CORS
app.use(
  cors({
    origin: 5001 || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Mount Better Auth handler
app.all("/api/auth/{*any}", toNodeHandler(auth));

// middlewares

app.use(express.json());

// public route

// private routes

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

if (db) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  console.log("Lỗi kết nối CSDL");
}
