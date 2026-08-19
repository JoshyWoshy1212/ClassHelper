import { api } from './api';

export interface StudentItem {
  id: number;
  academyId: number;
  name: string;
  gender?: string | null;
  birthDate?: string | null;
  schoolName?: string | null;
  grade?: string | null;
  studentPhone?: string | null;
  parentPhone: string;
  parentName?: string | null;
  parentRelationship?: string | null;
  status: 'ACTIVE' | 'ON_LEAVE' | 'DISCHARGED';
  enrolledAt?: string | null;
  dischargedAt?: string | null;
  memo?: string | null;
  createdAt: string;
}

export interface PaginatedStudentsResponse {
  items: StudentItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const studentsService = {
  async getStudents(params?: {
    search?: string;
    status?: string;
    grade?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedStudentsResponse> {
    const response = await api.get<PaginatedStudentsResponse>('/students', { params });
    return response.data;
  },
};
