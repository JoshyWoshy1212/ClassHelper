# 🏫 ClassHelper (학원 통합 관리 시스템)

> **ClassHelper**는 학원 원장님과 선생님들이 원생 출결 관리, 수업 진도 및 과제 체크, 수강료 납부 현황 관리 등을 한곳에서 빠르고 간편하게 처리할 수 [...]

---

## 📌 주요 특징 및 해결하고자 하는 문제

- **1초 출결 체크**: 교실 안에서 모바일/태블릿으로 반별 학생들의 출결(출석, 결석, 지각, 조퇴)을 터치 한 번으로 기록
- **수납 및 미납 관리**: 매월 청구되는 원비 수납 현황을 실시간으로 추적하고 미납자 관리
- **수업 일지 및 진도 추적**: 반별/학생별 교재 진도와 과제 완성도를 기록하고 학부모 상담용 피드백 축적
- **선생님 업무 효율화**: 복잡한 행정 서류 작업을 전산화하여 교육 본연에 집중할 수 있는 환경 제공

---

## 🧱 핵심 4대 도메인 설계

![ER diagram rendered via mermaid.ink](https://mermaid.ink/svg/erDiagram%0AACADEMY%20%7C%7C--o%7B%20USER%20%3A%20employs%0AACADEMY%20%7C%7C--o%7B%20STUDENT%20%3A%20manages%0AACADEMY%20%7C%7C--o%7B%20CLASS%20%3A%20operates%0AUSER%20%7C%7C--o%7B%20CLASS%20%3A%20teaches%0ACLASS%20%7C%7C--o%7B%20ENROLLMENT%20%3A%20includes%0ASTUDENT%20%7C%7C--o%7B%20ENROLLMENT%20%3A%20enrolls%0AENROLLMENT%20%7C%7C--o%7B%20ATTENDANCE%20%3A%20logs%0ACLASS%20%7C%7C--o%7B%20CLASS_LOG%20%3A%20records%0ASTUDENT%20%7C%7C--o%7B%20TUITION_INVOICE%20%3A%20billed%0ATUITION_INVOICE%20%7C%7C--o%7B%20TUITION_PAYMENT%20%3A%20settles)

<details>
<summary>원본 mermaid 코드 (클릭하여 보기)</summary>

```mermaid
erDiagram
    ACADEMY ||--o{ USER : employs
    ACADEMY ||--o{ STUDENT : manages
    ACADEMY ||--o{ CLASS : operates

    USER ||--o{ CLASS : teaches
    CLASS ||--o{ ENROLLMENT : includes
    STUDENT ||--o{ ENROLLMENT : enrolls

    ENROLLMENT ||--o{ ATTENDANCE : logs
    CLASS ||--o{ CLASS_LOG : records
    STUDENT ||--o{ TUITION_INVOICE : billed
    TUITION_INVOICE ||--o{ TUITION_PAYMENT : settles
```

</details>

### 1. 학생 및 반 관리 (`Students & Classes`)
- **학생(Student)**: 이름, 학교/학년, 연락처, 학부모 연락처, 재원 상태(`ACTIVE`, `ON_LEAVE`, `DISCHARGED`)
- **반(Class)**: 반 이름, 과목, 담당 강사, 수업 요일/시간, 정원, 기본 수강료
- **수강(Enrollment)**: 학생과 반 매핑 및 수강 시작/종료일 관리

### 2. 출결 관리 (`Attendance`)
- 일자별/수업별 학생 출결 상태 기록 (`PRESENT`, `ABSENT`, `LATE`, `EARLY_LEAVE`)
- 결석/지각 사유 메모 및 보강 필요 여부 기록

### 3. 수강료 및 수납 관리 (`Tuition & Payments`)
- 매월 정기 수강료 청구서(`TuitionInvoice`) 생성
- 수납 기록(`TuitionPayment`) 등록 (카드, 계좌이체, 현금) 및 결제 상태(`PAID`, `UNPAID`, `PARTIAL`) 관리

### 4. 진도 및 수업 일지 (`ClassLog & Homework`)
- 회차별 수업 진도(교재, 범위, 주요 학습 주제) 기록
- 과제 제출 여부 및 성취도 평가, 학생 개별 특이사항 기록

---

## 🛠️ 기술 스택 (Tech Stack)

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) + MySQL / PostgreSQL
- **Package Manager**: [Yarn](https://yarnpkg.com/)
- **API Documentation**: [Swagger (OpenAPI)](https://swagger.io/)
- **Testing**: [Jest](https://jestjs.io/) & Supertest (Unit / E2E)

---

## 🚀 개발 로드맵 (Milestones)

![Milestones flowchart rendered via mermaid.ink](https://mermaid.ink/svg/flowchart%20LR%0AM1%5B%22Milestone%201%3Cbr%3E인증%20및%20학생%2F반%20관리%22%5D%20--%3E%20M2%5B%22Milestone%202%3Cbr%3E출결%20관리%20시스템%22%5D%0AM2%20--%3E%20M3%5B%22Milestone%203%3Cbr%3E수강료%20및%20수납%20관리%22%5D%0AM3%20--%3E%20M4%5B%22Milestone%204%3Cbr%3E수업%20진도%20및%20피드백%22%5D%0AM4%20--%3E%20M5%5B%22Milestone%205%3Cbr%3E학부모%20알림%20연동%22%5D)

<details>
<summary>원본 mermaid 코드 (클릭하여 보기)</summary>

```mermaid
flowchart LR
    M1["Milestone 1<br>인증 및 학생/반 관리"] --> M2["Milestone 2<br>출결 관리 시스템"]
    M2 --> M3["Milestone 3<br>수강료 및 수납 관리"]
    M3 --> M4["Milestone 4<br>수업 진도 및 피드백"]
    M4 --> M5["Milestone 5<br>학부모 알림 연동"]
```

</details>

- **[x] Phase 0**: 프로젝트 요구사항 정의 및 아키텍처/README 수립
- **[ ] Phase 1**: NestJS + Yarn 초기 프로젝트 세팅 및 아키텍처 환경 구축
- **[ ] Phase 2**: Prisma 스키마 모델링 및 DB 마이그레이션 (User, Student, Class)
- **[ ] Phase 3**: 학생/반 관리 CRUD API 및 관리자/강사 인증 구현
- **[ ] Phase 4**: 출결 체크 & 일자별 출결 현황 조회 API 구현
- **[ ] Phase 5**: 수강료 청구 및 수납 처리 API 구현
- **[ ] Phase 6**: 수업 일지/진도 기록 API 구현
- **[ ] Phase 7**: Swagger 명세 및 테스트 코드(Unit/E2E) 완성

---

## 💻 빠른 시작 (Getting Started)

### 1. 패키지 설치
```bash
yarn install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
```

### 3. 데이터베이스 마이그레이션
```bash
yarn prisma migrate dev
```

### 4. 개발 서버 실행
```bash
yarn start:dev
```

### 5. Swagger API 문서 확인
서버 실행 후 브라우저에서 `http://localhost:3000/api-docs` 접속
