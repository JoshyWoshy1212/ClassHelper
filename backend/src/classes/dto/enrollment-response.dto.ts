import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnrollmentStatus, Gender, StudentStatus } from '@prisma/client';

export class EnrolledStudentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '김민준' })
  name: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  gender?: Gender | null;

  @ApiPropertyOptional({ example: '중2' })
  grade?: string | null;

  @ApiPropertyOptional({ example: '대치중학교' })
  schoolName?: string | null;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  studentPhone?: string | null;

  @ApiProperty({ example: '010-9876-5432' })
  parentPhone: string;

  @ApiPropertyOptional({ example: '학부모' })
  parentName?: string | null;

  @ApiProperty({ enum: StudentStatus, example: StudentStatus.ACTIVE })
  status: StudentStatus;
}

export class EnrollmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  academyId: number;

  @ApiProperty({ example: 1 })
  studentId: number;

  @ApiProperty({ example: 1 })
  classId: number;

  @ApiProperty({ example: '2026-09-01' })
  startDate: Date;

  @ApiPropertyOptional({ example: '2026-12-31' })
  endDate?: Date | null;

  @ApiProperty({ enum: EnrollmentStatus, example: EnrollmentStatus.ENROLLED })
  status: EnrollmentStatus;

  @ApiProperty({ type: EnrolledStudentDto })
  student: EnrolledStudentDto;

  @ApiProperty({ example: '2026-08-19T00:00:00.000Z' })
  createdAt: Date;
}
