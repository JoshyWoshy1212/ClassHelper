export type UserRole = 'SUPER_ADMIN' | 'OWNER' | 'ADMIN' | 'TEACHER' | 'STAFF';

export interface UserProfile {
  id: number;
  academyId?: number | null;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AcademySummary {
  id: number;
  name: string;
  businessNumber?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  academy?: AcademySummary | null;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserDetailResponse extends UserProfile {
  academy?: AcademySummary | null;
}
