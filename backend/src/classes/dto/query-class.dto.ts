import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ClassStatus } from '@prisma/client';

export class QueryClassDto {
  @ApiPropertyOptional({
    description: '반 명칭 또는 과목 검색어',
    example: '수학',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: '수업 운영 상태 필터',
    enum: ClassStatus,
    example: ClassStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ClassStatus)
  status?: ClassStatus;

  @ApiPropertyOptional({
    description: '담당 강사 User ID 필터',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teacherId?: number;

  @ApiPropertyOptional({
    description: '대상 학년 필터 (예: 중2, 고1)',
    example: '중2',
  })
  @IsOptional()
  @IsString()
  targetGrade?: string;

  @ApiPropertyOptional({
    description: '페이지 번호 (기본값: 1)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: '페이지 당 조회 개수 (기본값: 20)',
    default: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;
}
