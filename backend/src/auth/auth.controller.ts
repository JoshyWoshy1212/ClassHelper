import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { RegisterStaffDto } from './dto/register-staff.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserProfileDto, UserDetailResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Auth (인증 및 계정 관리)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-owner')
  @ApiOperation({
    summary: '학원 신규 개설 및 원장(최고 관리자) 회원가입',
    description: '새로운 학원(Academy)과 원장님(OWNER) 계정을 동시에 생성하고 JWT 토큰을 반환합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '회원가입 및 학원 개설 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 사용 중인 이메일',
  })
  async registerOwner(@Body() dto: RegisterOwnerDto): Promise<AuthResponseDto> {
    return this.authService.registerOwner(dto);
  }

  @Post('register-staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '강사/직원 등록 (원장/관리자 전용)',
    description: '현재 소속된 학원에 강사(TEACHER), 실장(ADMIN), 조교(STAFF) 계정을 추가합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '강사/직원 계정 생성 성공',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '권한 부족 (원장/관리자만 가능)',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 사용 중인 이메일',
  })
  async registerStaff(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() dto: RegisterStaffDto,
  ): Promise<UserProfileDto> {
    return this.authService.registerStaff(currentUser, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰과 사용자/학원 정보를 발급받습니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '이메일 또는 비밀번호 불일치',
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 정보 및 소속 학원 조회',
    description: '현재 JWT 토큰으로 인증된 사용자의 정보와 소속 학원 정보를 반환합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 및 학원 정보 조회 성공',
    type: UserDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '유효하지 않거나 만료된 토큰',
  })
  async getMe(@CurrentUser('userId') userId: number): Promise<UserDetailResponseDto> {
    return this.authService.getMe(userId);
  }
}
