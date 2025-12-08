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
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Mount Better Auth handler - Express 5 syntax
app.all("/api/auth/*splat", toNodeHandler(auth));

// middlewares
app.use(express.json());

// Import routes
import teamsRouter from "./routes/teams.js";
import teamMembersRouter from "./routes/team-members.js";
import tasksRouter from "./routes/tasks.js";
import commentsRouter from "./routes/comments.js";

// Mount API routes
app.use("/api", teamsRouter);
app.use("/api", teamMembersRouter);
app.use("/api", tasksRouter);
app.use("/api", commentsRouter);

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
