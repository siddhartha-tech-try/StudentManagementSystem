import { Router } from "express";
import { activitiesRouter } from "./activities.routes";
import { analyticsRouter } from "./analytics.routes";
import { studentsRouter } from "./students.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "student-management-api"
  });
});

apiRouter.use("/students", studentsRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/activities", activitiesRouter);
