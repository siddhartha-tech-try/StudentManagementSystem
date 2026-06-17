CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

CREATE SEQUENCE "student_admission_sequence"
  AS BIGINT
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE TABLE "Student" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "admissionNumber" VARCHAR(32) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "course" VARCHAR(120) NOT NULL,
  "year" INTEGER NOT NULL,
  "dateOfBirth" DATE NOT NULL,
  "email" VARCHAR(160) NOT NULL,
  "mobileNo" VARCHAR(20) NOT NULL,
  "gender" "Gender" NOT NULL,
  "address" TEXT NOT NULL,
  "photoUrl" VARCHAR(500),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActivityLog" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "action" "ActivityAction" NOT NULL,
  "entityType" VARCHAR(80) NOT NULL,
  "entityId" UUID,
  "admissionNumber" VARCHAR(32),
  "message" VARCHAR(255) NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Student_admissionNumber_key" ON "Student"("admissionNumber");
CREATE INDEX "Student_admissionNumber_idx" ON "Student"("admissionNumber");
CREATE INDEX "Student_name_idx" ON "Student"("name");
CREATE INDEX "Student_email_idx" ON "Student"("email");
CREATE INDEX "Student_mobileNo_idx" ON "Student"("mobileNo");
CREATE INDEX "Student_course_idx" ON "Student"("course");
CREATE INDEX "Student_year_idx" ON "Student"("year");
CREATE INDEX "Student_gender_idx" ON "Student"("gender");
CREATE INDEX "Student_createdAt_idx" ON "Student"("createdAt");
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");
CREATE INDEX "ActivityLog_entityType_idx" ON "ActivityLog"("entityType");
CREATE INDEX "ActivityLog_entityId_idx" ON "ActivityLog"("entityId");
CREATE INDEX "ActivityLog_admissionNumber_idx" ON "ActivityLog"("admissionNumber");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
