# 🏛️ ClassHelper 도메인 아키텍처 및 역할(RBAC) 정의서

ClassHelper는 멀티 테넌트(Multi-Tenant) 기반의 학원 운영 올인원 SaaS 플랫폼입니다.  
본 문서는 시스템을 구성하는 **5대 핵심 도메인과 사용자 역할(Role)별 권한 및 책임(Responsibilities)**을 정의합니다.

---

## 👥 1. 사용자 역할 (User Roles & RBAC)

시스템의 모든 사용자는 다음 5가지 역할 중 하나를 부여받으며, 직무와 권한 범위가 명확히 분리됩니다.

```text
[ SUPER_ADMIN (플랫폼 총괄 관리자) ] ── 플랫폼 전체 학원 모니터링, 승인/정지, 감사 로그
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     [ 테넌트: 개별 학원 ]                    │
│                                                             │
│  [ OWNER (원장님) ] ── 학원 최고 관리자 (재정, 강사 관리, 설정)    │
│         │                                                   │
│         ├── [ ADMIN (실장/원무) ] ── 원생 등록, 수납 처리, 출결 총괄 │
│         ├── [ TEACHER (강사) ] ── 담당 반 출결, 수업 일지/과제   │
│         └── [ STAFF (조교/직원) ] ── 출결 체크 보조, 원무 보조     │
└─────────────────────────────────────────────────────────────┘
```

| 역할 (`UserRole`) | 권한 범위 (Scope) | 핵심 업무 및 책임 |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | **플랫폼 전체 (Global)** | • 전체 학원 현황 모니터링 및 통계 분석<br>• 학원 계정 승인/일시정지/해지 관리<br>• 시스템 감사 로그(`AuditLog`) 열람<br>• 알림톡 단가 및 플랫폼 공지 관리 |
| **`OWNER`** | **소속 학원 전체 (Tenant All)** | • 학원 기본 정보 및 알림 설정<br>• 강사/직원 계정 초대 및 권한 부여<br>• 수강료 수납 및 미납 통계, 재정 관리<br>• 학원 내 모든 원생, 반, 출결 열람 및 수정 |
| **`ADMIN`** | **소속 학원 운영 (Operations)** | • 신규 원생 등록, 반 배정 및 수강(Enrollment) 관리<br>• 월별 수강료 청구서 발행 및 현장 수납 처리<br>• 학원 전체 출결 현황 모니터링 및 학부모 상담 지원 |
| **`TEACHER`** | **담당 반 (Assigned Classes)** | • 담당 반 실시간 1초 출결 체크 (등원/하원/지각/결석)<br>• 회차별 수업 진도 일지(`ClassLog`) 작성<br>• 원생별 과제 검사 및 피드백 코멘트 작성 |
| **`STAFF`** | **소속 학원 보조 (Assistance)** | • 데스크 등원/하원 출결 태깅 보조<br>• 보강(Makeup) 일정 확인 및 단순 원무 보조 |

---

## 📦 2. 5대 핵심 도메인 맵 (Domain Map)

```text
1. Auth & Admin (인증 & 관리자 도메인)
   └── [User], [Academy], [AuditLog]
   
2. Students & Classes (원생 & 반 편성 도메인)
   └── [Student], [Class], [Enrollment]

3. Attendance & Alimtalk (출결 & 알림 도메인)
   └── [Attendance], [Kakao Alimtalk Engine]

4. Billing & Tuition (수납 & 수강료 도메인)
   └── [TuitionInvoice], [TuitionPayment]

5. Class Logs & Homework (수업 일지 & 과제 도메인)
   └── [ClassLog], [HomeworkSubmission]
```

---

## 📑 3. 도메인별 세부 가이드 문서

각 도메인의 엔티티 구조, 상태 라이프사이클(State Lifecycle), API 명세 및 역할별 권한 매트릭스는 아래 세부 문서를 참조하십시오:

1. [01. 인증 및 플랫폼 관리자 도메인 (Auth & Admin)](./01-auth-and-admin.md)
2. [02. 원생 및 수업 편성 도메인 (Students & Classes)](./02-students-and-classes.md)
3. [03. 일별 출결 및 알림톡 도메인 (Attendance & Notifications)](./03-attendance-and-notifications.md)
4. [04. 수강료 청구 및 수납 관리 도메인 (Billing & Tuition)](./04-billing-and-tuition.md)
5. [05. 수업 일지 및 과제 관리 도메인 (Class Logs & Homework)](./05-class-logs-and-homework.md)
