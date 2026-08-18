import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { RegisterStaffDto } from './dto/register-staff.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserProfileDto, AcademySummaryDto, UserDetailResponseDto } from './dto/auth-response.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 학원 신규 개설 및 원장(최고 관리자) 회원가입
   */
  async registerOwner(dto: RegisterOwnerDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일 주소입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const academy = await tx.academy.create({
        data: {
          name: dto.academyName,
          businessNumber: dto.businessNumber,
          phoneNumber: dto.academyPhone,
          address: dto.address,
        },
      });

      const user = await tx.user.create({
        data: {
          academyId: academy.id,
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          phone: dto.phone,
          role: UserRole.OWNER,
        },
      });

      return { academy, user };
    });

    this.logger.log(`새 학원 등록 완료: [${result.academy.name}] 원장: [${result.user.name}(${result.user.email})]`);

    const accessToken = this.generateToken(result.user);

    return {
      accessToken,
      user: this.mapToUserProfile(result.user),
      academy: this.mapToAcademySummary(result.academy),
    };
  }

  /**
   * 학원 내 강사/직원 추가 등록 (원장/관리자 전용)
   */
  async registerStaff(currentUser: CurrentUserPayload, dto: RegisterStaffDto): Promise<UserProfileDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일 주소입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        academyId: currentUser.academyId,
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        role: dto.role,
      },
    });

    this.logger.log(`학원(${currentUser.academyId}) 내 강사/직원 추가: [${user.name}(${user.role})]`);

    return this.mapToUserProfile(user);
  }

  /**
   * 로그인
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { academy: true },
    });

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const accessToken = this.generateToken(user);

    return {
      accessToken,
      user: this.mapToUserProfile(user),
      academy: this.mapToAcademySummary(user.academy),
    };
  }

  /**
   * 현재 로그인 사용자 및 학원 정보 조회
   */
  async getMe(userId: number): Promise<UserDetailResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { academy: true },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return {
      ...this.mapToUserProfile(user),
      academy: this.mapToAcademySummary(user.academy),
    };
  }

  /**
   * JWT 토큰 발급
   */
  private generateToken(user: { id: number; academyId: number; email: string; name: string; role: UserRole }): string {
    const payload = {
      sub: user.id,
      academyId: user.academyId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private mapToUserProfile(user: {
    id: number;
    academyId: number;
    email: string;
    name: string;
    phone: string | null;
    role: UserRole;
    createdAt: Date;
  }): UserProfileDto {
    return {
      id: user.id,
      academyId: user.academyId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private mapToAcademySummary(academy: {
    id: number;
    name: string;
    businessNumber: string | null;
    phoneNumber: string | null;
    address: string | null;
  }): AcademySummaryDto {
    return {
      id: academy.id,
      name: academy.name,
      businessNumber: academy.businessNumber,
      phoneNumber: academy.phoneNumber,
      address: academy.address,
    };
  }
}
