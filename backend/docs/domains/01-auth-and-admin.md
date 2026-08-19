# 🔐 01. 인증 및 플랫폼 관리자 도메인 (Auth & Admin Domain)

## 📌 도메인 개요

인증 & 관리자 도메인은 **플랫폼 전체의 테넌트(학원) 격리, 다중 권한(RBAC), 이중 토큰 보안(JWT + RTR), 그리고 슈퍼 관리자 감사 로그(`AuditLog`)**를 총괄하는 최상위 핵심 도메인입니다.

---

## 🗄️ 1. 관련 엔티티 (Entities)

### 1) `Academy` (학원 테넌트)
* **역할**: 모든 비즈니스 데이터의 최상위 격리 경계(Partitioning Boundary).
* **필드**:
  * `id`: 고유 식별자 (PK, Auto-increment)
  * `name`: 학원 명칭 (예: "클래스헬퍼 어학원 대치본원")
  * `status`: `AcademyStatus` (`ACTIVE`, `SUSPENDED`, `PENDING`)
  * `businessNumber`: 사업자등록번호 (선택, 현금영수증/세금계산서 연동용)
  * `phoneNumber`: 학원 대표번호 (알림톡 발신번호로 사용)
  * `address`: 학원 소재지 주소
  * `settings`: 학원별 알림 설정 및 커스텀 JSONB 옵션

### 2) `User` (사용자 계정)
* **역할**: 시스템에 로그인하여 학원 업무 또는 플랫폼 관리 작업을 수행하는 주체.
* **필드**:
  * `id`: 고유 식별자
  * `academyId`: 소속 학원 ID (`SUPER_ADMIN`의 경우 `null` 허용)
  * `email`: 로그인 이메일 (Unique)
  * `password`: bcrypt 해시 암호 (8자 이상, 영문/숫자/특수문자)
  * `name`: 사용자 성함 (예: "김원장", "이선생")
  * `role`: `UserRole` (`SUPER_ADMIN`, `OWNER`, `ADMIN`, `TEACHER`, `STAFF`)
  * `hashedRefreshToken`: RTR 보안 토큰 해시

### 3) `AuditLog` (관리자 감사 로그)
* **역할**: 슈퍼 관리자 또는 원장님의 고위험 작업(학원 정지, 권한 변경, 강제 데이터 수정 등)을 영구 기록.
* **필드**:
  * `id`: BigInt 식별자
  * `adminId`: 작업을 수행한 관리자 User ID
  * `action`: 작업 유형 (예: `UPDATE_ACADEMY_STATUS`, `RESET_USER_PASSWORD`)
  * `targetType`: 대상 도메인 (`ACADEMY`, `USER`, `STUDENT`, `INVOICE`)
  * `targetId`: 대상 레코드 ID
  * `details`: 작업 전/후 변경사항 JSONB
  * `ipAddress`: 요청자 접속 IP

---

## 👥 2. 역할별 권한 매트릭스 (Role Permissions Matrix)

| 기능 / API | SUPER_ADMIN | OWNER | ADMIN | TEACHER | STAFF |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **전체 학원 목록 & 통계 조회** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **학원 계정 승인 / 일시정지** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **플랫폼 보안 감사 로그 열람** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **학원 기본 정보 & 설정 수정** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **강사/직원 신규 등록 및 권한 부여** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **본인 학원 강사/직원 목록 조회** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **본인 비밀번호 및 프로필 수정** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 3. 보안 프로세스 (Dual-Token & RTR Flow)

```text
[ Client (Browser) ]                  [ NestJS Backend ]                  [ PostgreSQL DB ]
         │                                    │                                    │
         │─── 1. POST /auth/login ───────────>│                                    │
         │    (email, password)               │─── 2. Validate Password (bcrypt) ─>│
         │                                    │<── 3. Return User & Academy Info ──│
         │                                    │                                    │
         │                                    │─── 4. Generate Access/Refresh Token│
         │                                    │─── 5. Store Hashed Refresh Token ─>│
         │<── 6. Return Tokens & Profile ─────│                                    │
         │    (Access: 15m, Refresh: 7d)      │                                    │
```
