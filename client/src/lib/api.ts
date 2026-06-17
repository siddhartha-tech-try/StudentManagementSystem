import axios from 'axios'
import type {
  ActivityLog,
  Analytics,
  Student,
  StudentFormValues,
  StudentListParams,
  StudentListResponse,
} from '../types/student'

interface ApiDataResponse<T> {
  data: T
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '')

export const api = axios.create({
  baseURL: API_URL,
})

export const getPhotoSrc = (photoUrl?: string | null) => {
  if (!photoUrl) {
    return ''
  }

  if (photoUrl.startsWith('http')) {
    return photoUrl
  }

  return `${API_ORIGIN}${photoUrl}`
}

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

const toStudentFormData = (values: StudentFormValues, photo?: File | null) => {
  const formData = new FormData()
  formData.append('name', values.name)
  formData.append('course', values.course)
  formData.append('year', String(values.year))
  formData.append('dateOfBirth', values.dateOfBirth)
  formData.append('email', values.email)
  formData.append('mobileNo', values.mobileNo)
  formData.append('gender', values.gender)
  formData.append('address', values.address)

  if (photo) {
    formData.append('photo', photo)
  }

  return formData
}

export const fetchStudents = async (params: StudentListParams) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined),
  )
  const response = await api.get<StudentListResponse>('/students', { params: cleanedParams })
  return response.data
}

export const fetchStudent = async (id: string) => {
  const response = await api.get<ApiDataResponse<Student>>(`/students/${id}`)
  return response.data.data
}

export const createStudent = async (values: StudentFormValues, photo?: File | null) => {
  const response = await api.post<ApiDataResponse<Student>>('/students', toStudentFormData(values, photo))
  return response.data.data
}

export const updateStudent = async (id: string, values: StudentFormValues, photo?: File | null) => {
  const response = await api.put<ApiDataResponse<Student>>(
    `/students/${id}`,
    toStudentFormData(values, photo),
  )
  return response.data.data
}

export const deleteStudent = async (id: string) => {
  await api.delete(`/students/${id}`)
}

export const fetchAnalytics = async () => {
  const response = await api.get<ApiDataResponse<Analytics>>('/analytics/students')
  return response.data.data
}

export const fetchActivities = async (limit = 20) => {
  const response = await api.get<ApiDataResponse<ActivityLog[]>>('/activities', { params: { limit } })
  return response.data.data
}
