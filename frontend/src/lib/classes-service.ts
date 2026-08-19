import { api } from './api';

export type ClassStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';
export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'DROPPED' | 'PAUSED';

export interface ClassTeacher {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface ClassItem {
  id: number;
  academyId: number;
  name: string;
  subject?: string | null;
  targetGrade?: string | null;
  teacherId?: number | null;
  teacher?: ClassTeacher | null;
  schedule?: string | null;
  capacity?: number | null;
  monthlyFee: number;
  status: ClassStatus;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedClassesResponse {
  items: ClassItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateClassInput {
  name: string;
  subject?: string;
  targetGrade?: string;
  teacherId?: number;
  schedule?: string;
  capacity?: number;
  monthlyFee?: number;
  status?: ClassStatus;
}

export interface UpdateClassInput extends Partial<CreateClassInput> {}

export interface EnrolledStudent {
  id: number;
  name: string;
  gender?: string | null;
  grade?: string | null;
  schoolName?: string | null;
  studentPhone?: string | null;
  parentPhone: string;
  parentName?: string | null;
  status: string;
}

export interface EnrollmentItem {
  id: number;
  academyId: number;
  studentId: number;
  classId: number;
  startDate: string;
  endDate?: string | null;
  status: EnrollmentStatus;
  student: EnrolledStudent;
  createdAt: string;
}

export interface CreateEnrollmentInput {
  studentId: number;
  startDate?: string;
  endDate?: string;
  status?: EnrollmentStatus;
}

export interface UpdateEnrollmentInput {
  status?: EnrollmentStatus;
  endDate?: string;
}

export const classesService = {
  /**
   * 반 목록 조회 및 검색
   */
  async getClasses(params?: {
    search?: string;
    status?: ClassStatus;
    teacherId?: number;
    targetGrade?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedClassesResponse> {
    const response = await api.get<PaginatedClassesResponse>('/classes', { params });
    return response.data;
  },

  /**
   * 특정 반 상세 정보 및 수강생 명단 조회
   */
  async getClassDetail(classId: number): Promise<ClassItem & { enrollments: EnrollmentItem[] }> {
    const response = await api.get<ClassItem & { enrollments: EnrollmentItem[] }>(`/classes/${classId}`);
    return response.data;
  },

  /**
   * 반 신규 개설
   */
  async createClass(data: CreateClassInput): Promise<ClassItem> {
    const response = await api.post<ClassItem>('/classes', data);
    return response.data;
  },

  /**
   * 반 정보 수정
   */
  async updateClass(classId: number, data: UpdateClassInput): Promise<ClassItem> {
    const response = await api.patch<ClassItem>(`/classes/${classId}`, data);
    return response.data;
  },

  /**
   * 반 삭제
   */
  async deleteClass(classId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/classes/${classId}`);
    return response.data;
  },

  /**
   * 특정 반에 원생 수강 등록 (반 배정)
   */
  async enrollStudent(classId: number, data: CreateEnrollmentInput): Promise<EnrollmentItem> {
    const response = await api.post<EnrollmentItem>(`/classes/${classId}/enrollments`, data);
    return response.data;
  },

  /**
   * 특정 반의 수강생 목록 조회
   */
  async getEnrolledStudents(classId: number, status?: EnrollmentStatus): Promise<EnrollmentItem[]> {
    const response = await api.get<EnrollmentItem[]>(`/classes/${classId}/enrollments`, {
      params: { status },
    });
    return response.data;
  },

  /**
   * 수강 상태 변경 (종강, 퇴반, 일시정지)
   */
  async updateEnrollment(enrollmentId: number, data: UpdateEnrollmentInput): Promise<EnrollmentItem> {
    const response = await api.patch<EnrollmentItem>(`/classes/enrollments/${enrollmentId}`, data);
    return response.data;
  },

  /**
   * 수강 등록 취소/삭제
   */
  async removeEnrollment(enrollmentId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/classes/enrollments/${enrollmentId}`);
    return response.data;
  },
};
