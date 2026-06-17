import type { Prisma, Student } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import type { StudentBody, StudentListQuery } from "../schemas/student.schema";

const buildStudentWhere = (query: StudentListQuery): Prisma.StudentWhereInput => {
  const where: Prisma.StudentWhereInput = {};

  if (query.search) {
    where.OR = [
      { admissionNumber: { contains: query.search, mode: "insensitive" } },
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { mobileNo: { contains: query.search, mode: "insensitive" } }
    ];
  }

  if (query.course) {
    where.course = { contains: query.course, mode: "insensitive" };
  }

  if (query.year) {
    where.year = query.year;
  }

  if (query.gender) {
    where.gender = query.gender;
  }

  return where;
};

const normalizeStudentInput = (body: StudentBody, photoUrl?: string | null) => ({
  ...body,
  dateOfBirth: new Date(body.dateOfBirth),
  photoUrl
});

export const getNextAdmissionNumber = async (tx: Prisma.TransactionClient) => {
  const result = await tx.$queryRaw<Array<{ nextval: bigint }>>`
    SELECT nextval('"student_admission_sequence"')
  `;
  const nextValue = result[0]?.nextval ?? 1n;

  return `ADM-${new Date().getFullYear()}-${nextValue.toString().padStart(6, "0")}`;
};

export const listStudents = async (query: StudentListQuery) => {
  const where = buildStudentWhere(query);
  const skip = (query.page - 1) * query.limit;
  const orderBy = { [query.sortBy]: query.sortOrder } as Prisma.StudentOrderByWithRelationInput;

  const [students, total] = await prisma.$transaction([
    prisma.student.findMany({
      where,
      orderBy,
      skip,
      take: query.limit
    }),
    prisma.student.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return {
    data: students,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1
    }
  };
};

export const getStudentById = (id: string) =>
  prisma.student.findUnique({
    where: { id }
  });

export const createStudent = (body: StudentBody, photoUrl?: string | null) =>
  prisma.$transaction(async (tx) => {
    const admissionNumber = await getNextAdmissionNumber(tx);
    const student = await tx.student.create({
      data: {
        ...normalizeStudentInput(body, photoUrl),
        admissionNumber
      }
    });

    await tx.activityLog.create({
      data: {
        action: "CREATE",
        entityType: "Student",
        entityId: student.id,
        admissionNumber: student.admissionNumber,
        message: `Created student ${student.name}`,
        metadata: {
          name: student.name,
          course: student.course,
          year: student.year
        }
      }
    });

    return student;
  });

export const updateStudent = (student: Student, body: StudentBody, photoUrl?: string | null) =>
  prisma.$transaction(async (tx) => {
    const updatedStudent = await tx.student.update({
      where: { id: student.id },
      data: {
        ...normalizeStudentInput(body, photoUrl ?? student.photoUrl)
      }
    });

    await tx.activityLog.create({
      data: {
        action: "UPDATE",
        entityType: "Student",
        entityId: updatedStudent.id,
        admissionNumber: updatedStudent.admissionNumber,
        message: `Updated student ${updatedStudent.name}`,
        metadata: {
          name: updatedStudent.name,
          course: updatedStudent.course,
          year: updatedStudent.year
        }
      }
    });

    return updatedStudent;
  });

export const deleteStudent = (student: Student) =>
  prisma.$transaction(async (tx) => {
    await tx.student.delete({
      where: { id: student.id }
    });

    await tx.activityLog.create({
      data: {
        action: "DELETE",
        entityType: "Student",
        entityId: student.id,
        admissionNumber: student.admissionNumber,
        message: `Deleted student ${student.name}`,
        metadata: {
          name: student.name,
          course: student.course,
          year: student.year
        }
      }
    });
  });
