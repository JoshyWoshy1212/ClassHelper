export type UserRole = 'OWNER' | 'ADMIN' | 'TEACHER' | 'STAFF';

export interface UserProfile {
  id: number;
  academyId: number;
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
  academy: AcademySummary;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserDetailResponse extends UserProfile {
  academy: AcademySummary;
}
