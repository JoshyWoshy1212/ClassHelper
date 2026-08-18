import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  const mockUser = {
    id: 1,
    academyId: 10,
    email: 'owner@classhelper.kr',
    password: 'hashedPassword',
    name: '김원장',
    phone: '010-1234-5678',
    role: UserRole.OWNER,
    createdAt: new Date(),
    updatedAt: new Date(),
    academy: {
      id: 10,
      name: '클래스헬퍼 어학원',
      businessNumber: '123-45-67890',
      phoneNumber: '02-1234-5678',
      address: '서울시 강남구',
      settings: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      academy: {
        create: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerOwner', () => {
    it('새 학원 개설 및 원장 등록 성공 시 토큰과 프로필 반환', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prisma.academy.create.mockResolvedValue(mockUser.academy);
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await service.registerOwner({
        academyName: '클래스헬퍼 어학원',
        email: 'owner@classhelper.kr',
        password: 'password123!',
        name: '김원장',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.user.email).toBe('owner@classhelper.kr');
      expect(result.academy.name).toBe('클래스헬퍼 어학원');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        academyId: mockUser.academyId,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
    });

    it('이메일 중복 시 ConflictException 발생', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.registerOwner({
          academyName: '새 학원',
          email: 'owner@classhelper.kr',
          password: 'password123!',
          name: '김원장',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('registerStaff', () => {
    it('강사/직원 등록 성공 시 생성된 사용자 프로필 반환', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const staffUser = { ...mockUser, id: 2, email: 'teacher@classhelper.kr', role: UserRole.TEACHER };
      prisma.user.create.mockResolvedValue(staffUser);

      const result = await service.registerStaff(
        { userId: 1, academyId: 10, email: 'owner@classhelper.kr', name: '김원장', role: UserRole.OWNER },
        {
          email: 'teacher@classhelper.kr',
          password: 'password123!',
          name: '이강사',
          role: UserRole.TEACHER,
        },
      );

      expect(result.email).toBe('teacher@classhelper.kr');
      expect(result.role).toBe(UserRole.TEACHER);
    });

    it('직원 이메일 중복 시 ConflictException 발생', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.registerStaff(
          { userId: 1, academyId: 10, email: 'owner@classhelper.kr', name: '김원장', role: UserRole.OWNER },
          {
            email: 'owner@classhelper.kr',
            password: 'password123!',
            name: '이강사',
            role: UserRole.TEACHER,
          },
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('올바른 로그인 정보 입력 시 토큰 및 프로필 반환', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'owner@classhelper.kr',
        password: 'password123!',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.user.email).toBe('owner@classhelper.kr');
    });

    it('존재하지 않는 이메일일 때 UnauthorizedException 발생', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'unknown@classhelper.kr',
          password: 'password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('비밀번호 불일치 시 UnauthorizedException 발생', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'owner@classhelper.kr',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('사용자 조회 성공 시 상세 정보 반환', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe(1);

      expect(result.id).toBe(1);
      expect(result.academy.id).toBe(10);
    });

    it('존재하지 않는 사용자일 때 NotFoundException 발생', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe(999)).rejects.toThrow(NotFoundException);
    });
  });
});
