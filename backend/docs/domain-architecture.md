# 🏛️ 도메인 아키텍처 및 역할별 가이드

ClassHelper는 **멀티테넌시(Multi-Tenancy)** 기반의 B2B SaaS 구조로 설계되었습니다. 각 학원(Academy)은 독립된 테넌트 단위로 격리되며, 모든 도메인 엔티티는 `academyId`를 기준으로 안전하게 분리 관리됩니다.

---

## 🗺️ 전체 도메인 관계 다이어그램 (ERD)

```mermaid
erDiagram
    Academy ||--o{ User : "소속 강사/직원"
    Academy ||--o{ Student : "재원생"
    Academy ||--o{ Class : "개설 반"
    Academy ||--o{ Attendance : "출결 기록"
    Academy ||--o{ TuitionInvoice : "수강료 청구"
    Academy ||--o{ TuitionPayment : "수납 내역"
    Academy ||--o{ ClassLog : "수업 일지"

    Class ||--o{ Enrollment : "수강 등록"
    Student ||--o{ Enrollment : "수강 등록"
    User ||--o{ Class : "담당 강사"
    User ||--o{ ClassLog : "작성 강사"

    Student ||--o{ Attendance : "출석 기록"
    Class ||--o{ Attendance : "수업 출석"

    Student ||--o{ TuitionInvoice : "청구 대상"
    TuitionInvoice ||--o{ TuitionPayment : "수납 매핑"

    ClassLog ||--o{ HomeworkSubmission : "과제 제출"
    Student ||--o{ HomeworkSubmission : "과제 평가"
```

---

## 🧱 5대 핵심 도메인 상세

### 1. 학원(테넌트) & 사용자/인증 (`Academies & Users`)
- **역할**: 멀티테넌시의 최상위 루트 엔티티 및 시스템 접근 사용자 관리.
- **주요 엔티티**:
  - `Academy`: 학원명, 사업자등록번호, 대표 연락처, 주소, 학원 설정(`settings: Json`).
  - `User`: 사용자 이메일(로그인 ID), 단방향 암호화 비밀번호, 성명, 연락처, 권한 역할(`UserRole`).
- **권한 체계 (`UserRole`)**:
  | 권한 | 대상 | 권한 범위 |
  | :--- | :--- | :--- |
  | `OWNER` | 원장님 (최고 관리자) | 학원 설정, 강사/직원 추가, 재정/수납, 전체 반/학생 관리 전권 |
  | `ADMIN` | 실장 / 원무 관리자 | 학생/반 등록 및 관리, 수강료 수납 처리, 출결 확인 |
  | `TEACHER` | 담당 강사 | 담당 반 수업 일지 작성, 과제 검사, 담당 반 출결 체크 및 학생 조회 |
  | `STAFF` | 조교 / 안내 데스크 | 단순 출결 체크 보조, 원무 안내 |

---

### 2. 학생 & 반 & 수강 관리 (`Students, Classes & Enrollments`)
- **역할**: 학원의 핵심 자산인 원생과 수업 커리큘럼, 그리고 수강 매핑 관리.
- **주요 엔티티**:
  - `Student`: 원생 이름, 성별, 생년월일, 학교/학년, 원생 연락처, **학부모 연락처**, 재원 상태(`ACTIVE`, `ON_LEAVE`, `DISCHARGED`), 메모.
  - `Class`: 반 명칭, 과목, 담당 강사(`User`), 타겟 학년, 수업 시간표(`schedule`), 정원(`capacity`), 월 기본 수강료(`monthlyFee`), 운영 상태(`ACTIVE`, `INACTIVE`, `CLOSED`).
  - `Enrollment`: 학생과 반의 N:M 매핑 엔티티. 수강 시작일, 종료일, 수강 상태(`ENROLLED`, `COMPLETED`, `DROPPED`, `PAUSED`).

---

### 3. 일별 출결 관리 (`Attendance`)
- **역할**: 교실 안에서 1초 만에 완료하는 실시간 출결 체크 및 보강 관리.
- **주요 엔티티**:
  - `Attendance`: 일자(`date`), 학생(`Student`), 반(`Class`), 출결 상태(`PRESENT`: 출석, `ABSENT`: 결석, `LATE`: 지각, `EARLY_LEAVE`: 조퇴), 등원/하원 시각(`checkInTime`, `checkOutTime`), 사유, 보강 필요 여부(`isMakeupNeeded`), 보강 완료 여부(`isMakeupCompleted`).
- **비즈니스 규칙**:
  - 동일 학생은 동일 반의 동일 날짜에 1건의 출결 기록만 가집니다 (`@@unique([studentId, classId, date])`).

---

### 4. 수강료 청구 및 수납 관리 (`Tuition Invoices & Payments`)
- **역할**: 매월 반복되는 원비 청구, 할인 적용, 복합 결제 수단별 수납 이력 추적.
- **주요 엔티티**:
  - `TuitionInvoice`: 청구 연월(`billingYearMonth`: "YYYY-MM"), 원래 금액(`originalAmount`), 할인 금액(`discountAmount`), 최종 청구액(`finalAmount`), 수납 완료액(`paidAmount`), 납부 기한(`dueDate`), 청구 상태(`UNPAID`, `PARTIALLY_PAID`, `PAID`, `VOID`).
  - `TuitionPayment`: 수납 금액(`amount`), 결제 수단(`CARD`, `CASH`, `BANK_TRANSFER`, `EASY_PAY`, `OTHER`), 영수증 번호, 처리자(`processedById`).

---

### 5. 수업 일지 & 진도/과제 관리 (`ClassLogs & Homework`)
- **역할**: 강의 진도 기록, 학생별 과제 이행도 점검 및 학부모 피드백 리포트 생성 기반.
- **주요 엔티티**:
  - `ClassLog`: 수업 일자, 반(`Class`), 담당 강사(`User`), 진도/교재 범위(`curriculum`), 수업 내용 요약, 과제 안내, 수업 특이사항.
  - `HomeworkSubmission`: 학생별 과제 제출 및 성취도 상태(`COMPLETED`, `INCOMPLETE`, `NOT_SUBMITTED`, `EXCUSED`), 점수(`score`), 개별 피드백(`feedback`).

---

## 🔒 멀티테넌시 데이터 격리 원칙

모든 비즈니스 로직 작성 시 아래 원칙을 반드시 준수해야 합니다:

1. **`academyId` 자동 주입**:
   컨트롤러에서 `@CurrentUser('academyId')`를 통해 현재 로그인된 사용자의 소속 학원 ID를 받아 서비스에 전달합니다.
2. **조회/수정/삭제 쿼리 검증**:
   모든 Prisma 쿼리 조건(`where`)에 항상 `academyId`를 포함하여 다른 학원의 데이터에 접근하지 못하도록 원천 차단합니다.
   ```typescript
   // 안전한 쿼리 예시
   const student = await this.prisma.student.findFirst({
     where: {
       id: studentId,
       academyId: currentUser.academyId, // 테넌트 격리 필수
     },
   });
   ```
