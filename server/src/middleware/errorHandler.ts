import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import { HttpError } from "../utils/httpError";

const hasDatabaseConnectionError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as {
    code?: unknown;
    errors?: Array<{ code?: unknown }>;
  };

  return (
    maybeError.code === "ECONNREFUSED" ||
    Boolean(maybeError.errors?.some((nestedError) => nestedError.code === "ECONNREFUSED"))
  );
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      details: error.flatten().fieldErrors
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({
      message: error.code === "LIMIT_FILE_SIZE" ? "Uploaded photo is too large." : error.message
    });
    return;
  }

  if (hasDatabaseConnectionError(error)) {
    res.status(503).json({
      message:
        "Database connection failed. Start PostgreSQL and verify DATABASE_URL in server/.env."
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1000") {
    res.status(503).json({
      message:
        "Database authentication failed. Update DATABASE_URL in server/.env with the correct PostgreSQL username and password."
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1003") {
    res.status(503).json({
      message:
        "Database does not exist. Create the database from DATABASE_URL, then run Prisma migrations."
    });
    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P2021", "P2022"].includes(error.code)
  ) {
    res.status(503).json({
      message: "Database schema is not ready. Run `npm run prisma:migrate` in the server folder."
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    res.status(409).json({
      message: "A record with the same unique value already exists."
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    message: "Internal server error"
  });
};
