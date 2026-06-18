import path from "node:path";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";

export const app = express();

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, "");

const allowedOrigins = new Set([
  ...env.CLIENT_URL.split(",").map(normalizeOrigin),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://student-management-system-iota-one.vercel.app"
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use(errorHandler);
