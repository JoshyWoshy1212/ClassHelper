import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassStatus } from '@prisma/client';

export class ClassTeacherDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: '이선생' })
  name: string;

  @ApiProperty({ example: 'teacher@classhelper.kr' })
  email: string;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  phone?: string | null;
}

export class ClassResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  academyId: number;

  @ApiProperty({ example: '중등 수학 심화A반' })
  name: string;

  @ApiPropertyOptional({ example: '수학' })
  subject?: string | null;

  @ApiPropertyOptional({ example: '중2' })
  targetGrade?: string | null;

  @ApiPropertyOptional({ example: 2 })
  teacherId?: number | null;

  @ApiPropertyOptional({ type: ClassTeacherDto })
  teacher?: ClassTeacherDto | null;

  @ApiPropertyOptional({ example: '월/수/금 17:00-19:00' })
  schedule?: string | null;

  @ApiPropertyOptional({ example: 15 })
  capacity?: number | null;

  @ApiProperty({ example: 350000 })
  monthlyFee: number;

  @ApiProperty({ enum: ClassStatus, example: ClassStatus.ACTIVE })
  status: ClassStatus;

  @ApiProperty({ example: 10, description: '현재 수강 중인 원생 수' })
  enrolledCount: number;

  @ApiProperty({ example: '2026-08-19T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-08-19T00:00:00.000Z' })
  updatedAt: Date;
}

export class PaginatedClassResponseDto {
  @ApiProperty({ type: [ClassResponseDto] })
  items: ClassResponseDto[];

  @ApiProperty({
    example: {
      total: 10,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
