import { Router } from "express";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/students",
  asyncHandler(async (_req, res) => {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [totalStudents, recentStudentCount, courseCounts, yearCounts, genderCounts] =
      await prisma.$transaction([
        prisma.student.count(),
        prisma.student.count({
          where: {
            createdAt: {
              gte: since
            }
          }
        }),
        prisma.student.groupBy({
          by: ["course"],
          _count: {
            course: true
          },
          orderBy: {
            _count: {
              course: "desc"
            }
          }
        }),
        prisma.student.groupBy({
          by: ["year"],
          _count: {
            year: true
          },
          orderBy: {
            year: "asc"
          }
        }),
        prisma.student.groupBy({
          by: ["gender"],
          _count: {
            gender: true
          }
        })
      ]);

    res.json({
      data: {
        totalStudents,
        recentStudentCount,
        courseCounts: courseCounts.map((item) => ({
          course: item.course,
          count: item._count.course
        })),
        yearCounts: yearCounts.map((item) => ({
          year: item.year,
          count: item._count.year
        })),
        genderCounts: genderCounts.map((item) => ({
          gender: item.gender,
          count: item._count.gender
        }))
      }
    });
  })
);
