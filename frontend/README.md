# 🎨 ClassHelper Frontend (학원 관리 웹/태블릿 클라이언트)

> **ClassHelper Frontend**는 학원 원장님과 강사들이 PC 및 태블릿/모바일 환경에서 원생 관리, 1초 출결 체크, 수업 일지 기록, 수강료 수납 현황을 직관적으로 확인하고 처리할 수 있도록 구현된 모던 웹 애플리케이션입니다.

---

## 🛠️ 프론트엔드 핵심 기술 스택 & 모듈 (Tech Stack)

| 분류 | 모듈 / 도구 | 용도 및 선정 이유 |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | React 19 기반 모던 프레임워크, 빠른 초기 로딩 및 대시보드 확장성 |
| **Language** | **TypeScript 5** | 정적 타입 검증 및 백엔드 NestJS DTO와의 완벽한 타입 일치 |
| **Styling** | **Tailwind CSS v4** | 유연하고 빠른 유틸리티 CSS 스타일링 및 반응형 디자인 |
| **Server State** | **TanStack Query v5 (React Query)** | API 데이터 캐싱, 백그라운드 동기화, **1초 출결 체크 시 낙관적 업데이트(Optimistic Update)** |
| **Client State** | **Zustand** | 로그인 유저 정보, 현재 선택된 학원/반 등 가벼운 전역 상태 관리 |
| **Form & Validation** | **React Hook Form + Zod** | 학생 등록, 수강료 청구서 작성 등 복잡한 폼 검증 및 성능 최적화 |
| **Icons & Utility** | **Lucide React + date-fns** | 직관적인 UI 아이콘 및 출결/청구 년월 날짜 계산 유틸리티 |
| **Charts** | **Recharts** | 월별 원비 수납 현황, 반별 출결률 등 시각화 차트 |
| **HTTP Client** | **Axios** | JWT 토큰 자동 주입 인터셉터 및 에러 핸들링 |

---

## 📁 디렉터리 구조 (Architecture)

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router (페이지 라우팅)
│   │   ├── (auth)/             # 인증 관련 화면 (로그인, 회원가입 등)
│   │   │   └── login/
│   │   ├── (dashboard)/        # 관리자/강사용 대시보드 레이아웃
│   │   │   ├── students/       # 학생 및 반 관리 화면
│   │   │   ├── attendance/     # 1초 출결 체크 화면 (모바일/태블릿 최적화)
│   │   │   ├── tuition/        # 수강료 청구 및 수납 관리 화면
│   │   │   └── class-logs/     # 수업 일지 및 과제 관리 화면
│   │   ├── globals.css         # 글로벌 스타일 & Tailwind 설정
│   │   └── layout.tsx          # Root Layout (QueryProvider 포함)
│   ├── components/             # 공통 UI 컴포넌트
│   │   ├── common/             # Header, Sidebar, Modal, Table 등
│   │   └── ui/                 # 버튼, 배지, 카드 등 원자 단위 UI 컴포넌트
│   ├── hooks/                  # TanStack Query 훅 및 커스텀 훅
│   ├── lib/                    # API 클라이언트 (Axios) 및 유틸리티
│   │   ├── api.ts              # 백엔드 API 통신 인스턴스 (JWT Interceptor)
│   │   └── utils.ts            # Tailwind 클래스 병합 (cn 헬퍼)
│   ├── providers/              # React Context / Query Providers
│   │   └── query-provider.tsx  # TanStack React Query 전역 프로바이더
│   ├── stores/                 # Zustand 전역 스토어 (인증 상태, 테넌트 상태)
│   └── types/                  # 프론트엔드 공통 타입 및 API 응답 DTO 매핑
├── public/                     # 정적 에셋 (이미지, 파비콘 등)
├── package.json
└── tsconfig.json
```

---

## 💻 빠른 시작 (Getting Started)

### 1. 패키지 설치
```bash
yarn install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하여 백엔드 API 주소를 설정합니다:
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. 개발 서버 실행
```bash
yarn dev
```
브라우저에서 `http://localhost:3000` (또는 포트 충돌 시 `http://localhost:3001`)로 접속합니다.

### 4. 프로덕션 빌드 & 테스트
```bash
# 빌드
yarn build

# 린트 검사
yarn lint
```
