# 🗄️ Prisma & 데이터베이스 가이드

ClassHelper는 최신 **Prisma 7 (`^7.9.1`)** 및 **PostgreSQL 16**을 사용합니다.
Prisma 7부터 도입된 **Driver Adapter** 아키텍처와 마이그레이션 및 쿼리 작성 가이드를 안내합니다.

---

## ⚙️ Prisma 7 Driver Adapter 구조

Prisma 7에서는 번들링된 Rust 엔진 대신 JavaScript/TypeScript 네이티브 드라이버 어댑터를 사용하여 더 가볍고 빠른 성능을 제공합니다.

### 1. 설정 파일 분리
- **`prisma.config.ts`**: 데이터베이스 접속 URL 및 마이그레이션 경로 정의
- **`prisma/schema.prisma`**: 순수 데이터 모델 및 제약조건 정의

```typescript
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### 2. NestJS [`PrismaService`](file:///home/joshywoshy/ClassHelper/backend/src/prisma/prisma.service.ts) 연결 구현
PostgreSQL 커넥션 풀(`pg.Pool`)과 `@prisma/adapter-pg` 어댑터를 통해 `PrismaClient`를 초기화합니다.

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Successfully connected to PostgreSQL via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL');
  }
}
```

---

## 📋 핵심 CLI 명령어 모음

| 스크립트 명령어 | 실제 실행 명령 | 설명 |
| :--- | :--- | :--- |
| `yarn prisma:generate` | `prisma generate` | `schema.prisma`를 기반으로 `@prisma/client` 타입 및 쿼리 메서드 재생성 |
| `yarn prisma:migrate` | `prisma migrate dev` | 스키마 변경 사항을 바탕으로 신규 SQL 마이그레이션 파일 생성 및 DB 적용 |
| `yarn prisma:studio` | `prisma studio` | 브라우저에서 데이터베이스 레코드를 시각적으로 조회/수정할 수 있는 GUI 실행 |

---

## 🔄 데이터베이스 스키마 마이그레이션 워크플로우

1. **`prisma/schema.prisma` 파일 수정**:
   필요한 필드, 모델, 인덱스 또는 관계(Relation)를 수정합니다.
2. **마이그레이션 생성 및 실행**:
   ```bash
   yarn prisma:migrate
   ```
   - 변경 사항에 대한 마이그레이션 이름(예: `add_attendance_notes`)을 입력합니다.
   - `prisma/migrations/` 폴더 아래에 타임스탬프와 함께 SQL 파일이 자동 생성됩니다.
3. **타입 클라이언트 생성**:
   마이그레이션 후 `prisma generate`가 자동 실행되어 최신 TypeScript 타입 정의가 반영됩니다.

---

## 💡 모범 쿼리 작성 패턴 (Best Practices)

### 1. 원자적 트랜잭션 (`$transaction`)
학원 생성과 최고 관리자(원장) 계정 생성이 함께 성공하거나 실패해야 하는 경우:
```typescript
const result = await this.prisma.$transaction(async (tx) => {
  const academy = await tx.academy.create({
    data: { name: dto.academyName, address: dto.address },
  });

  const user = await tx.user.create({
    data: {
      academyId: academy.id,
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: UserRole.OWNER,
    },
  });

  return { academy, user };
});
```

### 2. 관계(Relation) 쿼리 최적화
필요한 필드만 선별하여 페이로드 크기를 줄이고 인덱스를 활용합니다:
```typescript
const classDetail = await this.prisma.class.findUnique({
  where: { id: classId },
  include: {
    teacher: {
      select: { id: true, name: true, phone: true },
    },
    enrollments: {
      where: { status: 'ENROLLED' },
      include: {
        student: {
          select: { id: true, name: true, grade: true, parentPhone: true },
        },
      },
    },
  },
});
```

### 3. BigInt & Decimal 처리 주의사항
- **`BigInt` (예: `Attendance.id`)**:
  JavaScript의 기본 `JSON.stringify`는 `BigInt`를 직렬화하지 못하므로, API 응답 시 `Number(id)` 또는 `id.toString()`으로 변환하거나 DTO 변환기를 적용합니다.
- **`Decimal` (예: `monthlyFee`, `finalAmount`)**:
  Prisma의 `Decimal` 인스턴스로 반환되므로 숫자 계산 시 `.toNumber()` 또는 `Number(val)`를 사용합니다.
