import { Router } from "express";
import { prisma } from "../config/prisma";
import { activityQuerySchema } from "../schemas/student.schema";
import { asyncHandler } from "../utils/asyncHandler";

export const activitiesRouter = Router();

activitiesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { limit } = activityQuerySchema.parse(req.query);
    const activities = await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    });

    res.json({
      data: activities
    });
  })
);
