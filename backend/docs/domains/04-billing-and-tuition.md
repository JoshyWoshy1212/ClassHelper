# 💳 04. 수강료 청구 및 수납 관리 도메인 (Billing & Tuition Domain)

## 📌 도메인 개요

수납 도메인은 **매월 원생별 수강료 청구서(TuitionInvoice)를 자동 생성하고, 다양한 결제 수단(카드, 현금, 계좌이체 등)으로 수납된 내역(TuitionPayment)을 추적하며, 미납자 관리 및 매출 통계를 지원**하는 재정 핵심 도메인입니다.

---

## 🗄️ 1. 관련 엔티티 (Entities)

### 1) `TuitionInvoice` (수강료 청구서)
* **역할**: 매월 원생에게 청구되는 수강료 청구 명세.
* **청구 상태 (`InvoiceStatus`)**:
  * `UNPAID`: 미납 (청구서 발행 후 결제 전)
  * `PARTIALLY_PAID`: 부분 수납 (수강료의 일부만 결제된 상태)
  * `PAID`: 완납 (전액 수납 완료)
  * `VOID`: 취소/무효 (휴원/퇴원 또는 오발행으로 취소된 청구서)
* **주요 필드**:
  * `billingYearMonth`: 청구 년월 (`YYYY-MM`, 예: "2026-09")
  * `originalAmount`: 정규 수강료 원금
  * `discountAmount`: 형제 할인/장학 할인/이벤트 할인 금액
  * `finalAmount`: 최종 청구 금액 (`originalAmount - discountAmount`)
  * `paidAmount`: 현재까지 누적 수납된 금액
  * `dueDate`: 납부 마감일 (`YYYY-MM-DD`)
  * `description`: 청구 항목 상세 (예: "9월 정규반 수강료 + 교재비")

### 2) `TuitionPayment` (수납/결제 이력)
* **역할**: 실제 결제 발생 시 기록되는 개별 수납 영수증.
* **결제 수단 (`PaymentMethod`)**:
  * `CARD`: 신용 / 체크카드 현장 결제
  * `CASH`: 현금 수납 (현금영수증 발행 대상)
  * `BANK_TRANSFER`: 가상계좌 / 학원 계좌이체
  * `EASY_PAY`: 카카오페이 / 네이버페이 등 간편결제
  * `OTHER`: 기타 상품권 등
* **주요 필드**:
  * `amount`: 이번 회차 결제 금액
  * `paidAt`: 결제 승인 일시
  * `receiptNumber`: 영수증 / 카드 승인 번호
  * `processedById`: 수납을 처리한 직원 User ID (`processedBy`)
  * `memo`: 결제 관련 메모 (예: "1회차 분할 납부")

---

## 👥 2. 역할별 권한 매트릭스 (Role Permissions Matrix)

| 기능 / 작업 | SUPER_ADMIN | OWNER | ADMIN | TEACHER | STAFF |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **월간 수강료 청구서 일괄 자동 생성** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **개별 청구서 금액 할인/수정/취소** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **수강료 수납 처리 (카드/현금/이체 등록)** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **미납자 명단 조회 및 카카오 납부 안내 발송** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **학원 월별 매출/수납률 통계 대시보드** | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 🔄 3. 수강료 청구 및 완납 라이프사이클

```text
[ 1. 매월 1일: 수강료 청구서 자동 발행 ] 
       │  (InvoiceStatus: UNPAID, finalAmount: 350,000원)
       ▼
[ 2. 학부모 납부 안내 알림톡 자동 발송 ]
       │
       ├── (사례 A: 전액 350,000원 카드 결제)
       │      │
       │      ▼
       │   [ TuitionPayment 생성: 350,000원 ] ──> InvoiceStatus: PAID (완납 🎉)
       │
       └── (사례 B: 200,000원 분할 납부)
              │
              ▼
           [ TuitionPayment 생성: 200,000원 ] ──> InvoiceStatus: PARTIALLY_PAID (잔액 150,000원)
```
