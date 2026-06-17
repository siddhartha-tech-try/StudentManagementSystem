import { Router } from "express";
import { studentPhotoUpload } from "../middleware/upload";
import {
  studentBodySchema,
  studentIdParamSchema,
  studentListQuerySchema
} from "../schemas/student.schema";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  listStudents,
  updateStudent
} from "../services/student.service";
import { asyncHandler } from "../utils/asyncHandler";
import { HttpError } from "../utils/httpError";
import { removePhotoFile, toPublicPhotoUrl } from "../utils/photo";

export const studentsRouter = Router();

studentsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = studentListQuerySchema.parse(req.query);
    const result = await listStudents(query);
    res.json(result);
  })
);

studentsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = studentIdParamSchema.parse(req.params);
    const student = await getStudentById(id);

    if (!student) {
      throw new HttpError(404, "Student not found");
    }

    res.json({ data: student });
  })
);

studentsRouter.post(
  "/",
  studentPhotoUpload.single("photo"),
  asyncHandler(async (req, res) => {
    const body = studentBodySchema.parse(req.body);
    const photoUrl = req.file ? toPublicPhotoUrl(req.file.filename) : null;

    try {
      const student = await createStudent(body, photoUrl);
      res.status(201).json({
        message: "Student created successfully",
        data: student
      });
    } catch (error) {
      await removePhotoFile(photoUrl);
      throw error;
    }
  })
);

studentsRouter.put(
  "/:id",
  studentPhotoUpload.single("photo"),
  asyncHandler(async (req, res) => {
    const { id } = studentIdParamSchema.parse(req.params);
    const body = studentBodySchema.parse(req.body);
    const existingStudent = await getStudentById(id);

    if (!existingStudent) {
      if (req.file) {
        await removePhotoFile(toPublicPhotoUrl(req.file.filename));
      }
      throw new HttpError(404, "Student not found");
    }

    const newPhotoUrl = req.file ? toPublicPhotoUrl(req.file.filename) : undefined;

    try {
      const student = await updateStudent(existingStudent, body, newPhotoUrl);

      if (newPhotoUrl && existingStudent.photoUrl) {
        await removePhotoFile(existingStudent.photoUrl);
      }

      res.json({
        message: "Student updated successfully",
        data: student
      });
    } catch (error) {
      if (newPhotoUrl) {
        await removePhotoFile(newPhotoUrl);
      }
      throw error;
    }
  })
);

studentsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = studentIdParamSchema.parse(req.params);
    const student = await getStudentById(id);

    if (!student) {
      throw new HttpError(404, "Student not found");
    }

    await deleteStudent(student);
    await removePhotoFile(student.photoUrl);

    res.json({
      message: "Student deleted successfully"
    });
  })
);
