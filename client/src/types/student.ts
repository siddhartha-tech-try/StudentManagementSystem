export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE'

export interface Student {
  id: string
  admissionNumber: string
  name: string
  course: string
  year: number
  dateOfBirth: string
  email: string
  mobileNo: string
  gender: Gender
  address: string
  photoUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface StudentFormValues {
  name: string
  course: string
  year: number
  dateOfBirth: string
  email: string
  mobileNo: string
  gender: Gender
  address: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface StudentListResponse {
  data: Student[]
  pagination: Pagination
}

export interface ActivityLog {
  id: string
  action: ActivityAction
  entityType: string
  entityId: string | null
  admissionNumber: string | null
  message: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface Analytics {
  totalStudents: number
  recentStudentCount: number
  courseCounts: Array<{ course: string; count: number }>
  yearCounts: Array<{ year: number; count: number }>
  genderCounts: Array<{ gender: Gender; count: number }>
}

export interface StudentListParams {
  search?: string
  course?: string
  year?: number | ''
  gender?: Gender | ''
  page: number
  limit: number
  sortBy: 'createdAt' | 'updatedAt' | 'name' | 'course' | 'year' | 'admissionNumber'
  sortOrder: 'asc' | 'desc'
}
