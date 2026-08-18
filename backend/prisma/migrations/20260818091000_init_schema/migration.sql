-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'TEACHER', 'STAFF');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'DISCHARGED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ENROLLED', 'COMPLETED', 'DROPPED', 'PAUSED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'VOID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'CASH', 'BANK_TRANSFER', 'EASY_PAY', 'OTHER');

-- CreateEnum
CREATE TYPE "HomeworkStatus" AS ENUM ('COMPLETED', 'INCOMPLETE', 'NOT_SUBMITTED', 'EXCUSED');

-- CreateTable
CREATE TABLE "academies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "businessNumber" VARCHAR(20),
    "phoneNumber" VARCHAR(20),
    "address" VARCHAR(255),
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20),
    "role" "UserRole" NOT NULL DEFAULT 'TEACHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "gender" "Gender",
    "birthDate" DATE,
    "schoolName" VARCHAR(50),
    "grade" VARCHAR(20),
    "studentPhone" VARCHAR(20),
    "parentPhone" VARCHAR(20) NOT NULL,
    "parentName" VARCHAR(50),
    "parentRelationship" VARCHAR(20),
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" DATE,
    "dischargedAt" DATE,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(50),
    "targetGrade" VARCHAR(20),
    "teacherId" INTEGER,
    "schedule" VARCHAR(100),
    "capacity" INTEGER,
    "monthlyFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "ClassStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" BIGSERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "reason" VARCHAR(255),
    "isMakeupNeeded" BOOLEAN NOT NULL DEFAULT false,
    "isMakeupCompleted" BOOLEAN NOT NULL DEFAULT false,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tuition_invoices" (
    "id" SERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "billingYearMonth" VARCHAR(7) NOT NULL,
    "originalAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "finalAmount" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "dueDate" DATE NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tuition_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tuition_payments" (
    "id" SERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'CARD',
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiptNumber" VARCHAR(100),
    "memo" TEXT,
    "processedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tuition_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_logs" (
    "id" SERIAL NOT NULL,
    "academyId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "curriculum" VARCHAR(255) NOT NULL,
    "lessonContent" TEXT,
    "homework" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homework_submissions" (
    "id" SERIAL NOT NULL,
    "classLogId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" "HomeworkStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "score" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homework_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_academyId_role_idx" ON "users"("academyId", "role");

-- CreateIndex
CREATE INDEX "students_academyId_status_idx" ON "students"("academyId", "status");

-- CreateIndex
CREATE INDEX "students_academyId_name_idx" ON "students"("academyId", "name");

-- CreateIndex
CREATE INDEX "students_academyId_parentPhone_idx" ON "students"("academyId", "parentPhone");

-- CreateIndex
CREATE INDEX "classes_academyId_status_idx" ON "classes"("academyId", "status");

-- CreateIndex
CREATE INDEX "classes_academyId_teacherId_idx" ON "classes"("academyId", "teacherId");

-- CreateIndex
CREATE INDEX "enrollments_academyId_status_idx" ON "enrollments"("academyId", "status");

-- CreateIndex
CREATE INDEX "enrollments_classId_status_idx" ON "enrollments"("classId", "status");

-- CreateIndex
CREATE INDEX "enrollments_studentId_status_idx" ON "enrollments"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_studentId_classId_startDate_key" ON "enrollments"("studentId", "classId", "startDate");

-- CreateIndex
CREATE INDEX "attendances_academyId_date_idx" ON "attendances"("academyId", "date");

-- CreateIndex
CREATE INDEX "attendances_classId_date_idx" ON "attendances"("classId", "date");

-- CreateIndex
CREATE INDEX "attendances_studentId_date_idx" ON "attendances"("studentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_studentId_classId_date_key" ON "attendances"("studentId", "classId", "date");

-- CreateIndex
CREATE INDEX "tuition_invoices_academyId_billingYearMonth_idx" ON "tuition_invoices"("academyId", "billingYearMonth");

-- CreateIndex
CREATE INDEX "tuition_invoices_academyId_status_idx" ON "tuition_invoices"("academyId", "status");

-- CreateIndex
CREATE INDEX "tuition_invoices_studentId_billingYearMonth_idx" ON "tuition_invoices"("studentId", "billingYearMonth");

-- CreateIndex
CREATE INDEX "tuition_payments_academyId_paidAt_idx" ON "tuition_payments"("academyId", "paidAt");

-- CreateIndex
CREATE INDEX "tuition_payments_invoiceId_idx" ON "tuition_payments"("invoiceId");

-- CreateIndex
CREATE INDEX "class_logs_academyId_date_idx" ON "class_logs"("academyId", "date");

-- CreateIndex
CREATE INDEX "class_logs_classId_date_idx" ON "class_logs"("classId", "date");

-- CreateIndex
CREATE INDEX "class_logs_teacherId_date_idx" ON "class_logs"("teacherId", "date");

-- CreateIndex
CREATE INDEX "homework_submissions_studentId_idx" ON "homework_submissions"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "homework_submissions_classLogId_studentId_key" ON "homework_submissions"("classLogId", "studentId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuition_invoices" ADD CONSTRAINT "tuition_invoices_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuition_invoices" ADD CONSTRAINT "tuition_invoices_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuition_payments" ADD CONSTRAINT "tuition_payments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuition_payments" ADD CONSTRAINT "tuition_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "tuition_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuition_payments" ADD CONSTRAINT "tuition_payments_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_logs" ADD CONSTRAINT "class_logs_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_logs" ADD CONSTRAINT "class_logs_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_logs" ADD CONSTRAINT "class_logs_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_classLogId_fkey" FOREIGN KEY ("classLogId") REFERENCES "class_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
