# 📑 Swagger & API 활용 가이드

ClassHelper 백엔드는 [Swagger (OpenAPI 3.0)](https://swagger.io/)을 통해 모든 RESTful API 엔드포인트를 시각적으로 문서화하고 대화형으로 직접 테스트할 수 있는 환경을 제공합니다.

---

## 🌐 Swagger UI 접속 및 기본 정보

- **문서 URL**: [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)
- **JSON 스펙 URL**: `http://localhost:3000/api-docs-json`
- **서버 기본 주소**: `http://localhost:3000`

---

## 🔑 Swagger UI에서 JWT 인증(Authorize) 적용 방법

보호된 API(자물쇠 아이콘이 표시된 엔드포인트)를 테스트하려면 JWT Access Token을 헤더에 설정해야 합니다.

```text
[1. POST /auth/login] 호출 
       ↓ 
[2. response의 accessToken 복사]
       ↓
[3. Swagger 상단 'Authorize' (🔓) 버튼 클릭]
       ↓
[4. Value 입력창에 토큰 붙여넣기] (예: eyJhbGciOiJIUzI1Ni...)
       ↓
[5. 'Authorize' 클릭 후 'Close'] (자물쇠가 🔒로 변경됨)
```

> **주의**: Bearer 접두사는 Swagger가 자동으로 붙여주므로 토큰 문자열만 그대로 입력하시면 됩니다.

---

## 📋 API 응답 규격 및 HTTP 상태 코드

### 1. 주요 상태 코드 표
| 상태 코드 | 의미 | 설명 |
| :--- | :--- | :--- |
| `200 OK` | 성공 | 일반적인 데이터 조회(GET), 수정(PUT/PATCH), 일부 작업(POST) 성공 |
| `201 Created` | 생성 성공 | 신규 리소스 등록(회원가입, 학생 등록, 출결 생성 등) 성공 |
| `400 Bad Request` | 입력 유효성 실패 | `class-validator` 검증 실패 (이메일 포맷 오류, 필수값 누락 등) |
| `401 Unauthorized` | 인증 실패 | JWT 토큰 누락, 만료, 비밀번호 불일치 |
| `403 Forbidden` | 인가/권한 부족 | 해당 기능에 접근 권한이 없는 역할(예: 강사가 직원 등록 시도 시) |
| `404 Not Found` | 리소스 없음 | 요청한 ID의 학생, 반, 학원 등이 존재하지 않음 |
| `409 Conflict` | 데이터 충돌 | 이메일 중복, 동일 날짜 중복 출결 등록 등 |
| `500 Internal Server Error` | 서버 내부 오류 | 서버 처리 중 예외 발생 |

### 2. 표준 에러 응답 포맷
```json
{
  "message": [
    "이메일을 입력해주세요.",
    "비밀번호는 최소 6자 이상이어야 합니다."
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🏷️ Swagger DTO 작성 가이드라인

새로운 컨트롤러 및 DTO 작성 시 다음 데코레이터를 적용합니다:

### 1. Controller 레벨
```typescript
@ApiTags('Students (원생 관리)')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController { ... }
```

### 2. Endpoint 메서드 레벨
```typescript
@Post()
@Roles(UserRole.OWNER, UserRole.ADMIN)
@ApiOperation({
  summary: '원생 신규 등록',
  description: '학원에 새로운 학생을 등록합니다.',
})
@ApiResponse({ status: 201, type: StudentResponseDto, description: '등록 성공' })
@ApiResponse({ status: 400, description: '필수 입력값 누락' })
async createStudent(@Body() dto: CreateStudentDto) { ... }
```

### 3. DTO 레벨
```typescript
export class CreateStudentDto {
  @ApiProperty({ description: '학생 성명', example: '홍길동' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '학부모 연락처 (알림톡/문자 수신용)', example: '010-1234-5678' })
  @IsString()
  @IsNotEmpty()
  parentPhone: string;

  @ApiPropertyOptional({ description: '학년 정보', example: '초6' })
  @IsString()
  @IsOptional()
  grade?: string;
}
```

---

## 📡 현재 구현된 엔드포인트 목록

### 1. 인증 및 계정 관리 (`Auth`)

| Method | Endpoint | 접근 권한 | 설명 |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register-owner` | Public | 학원 신규 개설 & 원장(최고 관리자) 회원가입 |
| `POST` | `/auth/register-staff` | `OWNER`, `ADMIN` | 소속 학원에 강사/직원 계정 등록 |
| `POST` | `/auth/login` | Public | 이메일/비밀번호 로그인 및 JWT 발급 |
| `GET` | `/auth/me` | Logged In | 현재 로그인 사용자 및 소속 학원 정보 조회 |
