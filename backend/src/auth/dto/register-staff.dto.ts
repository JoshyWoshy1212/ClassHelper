import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterStaffDto {
  @ApiProperty({ description: '강사/직원 이메일 (로그인 ID)', example: 'teacher1@classhelper.kr' })
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({ description: '초기 비밀번호 (6자 이상)', example: 'teacher123!' })
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;

  @ApiProperty({ description: '이름', example: '이강사' })
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @ApiPropertyOptional({ description: '휴대폰 번호', example: '010-9876-5432' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: '직책/권한 (TEACHER, ADMIN, STAFF)',
    enum: UserRole,
    default: UserRole.TEACHER,
    example: UserRole.TEACHER,
  })
  @IsEnum(UserRole, { message: '유효한 역할을 선택해주세요 (TEACHER, ADMIN, STAFF).' })
  role: UserRole;
}
