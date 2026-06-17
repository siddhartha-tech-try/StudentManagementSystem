import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Edit, PlusCircle, Search, Trash2, UserRound, Users } from 'lucide-react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { deleteStudent, fetchStudents, getErrorMessage, getPhotoSrc } from '../lib/api'
import { formatDate, genderLabel } from '../lib/utils'
import type { Gender, Student, StudentListParams } from '../types/student'
import { useToast } from '../context/toast'

const initialParams: StudentListParams = {
  search: '',
  course: '',
  year: '',
  gender: '',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export function StudentList() {
  const [params, setParams] = useState<StudentListParams>(initialParams)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const queryClient = useQueryClient()
  const toast = useToast()

  const query = useQuery({
    queryKey: ['students', params],
    queryFn: () => fetchStudents(params),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: async () => {
      toast.success('Student deleted successfully')
      setStudentToDelete(null)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students'] }),
        queryClient.invalidateQueries({ queryKey: ['analytics'] }),
        queryClient.invalidateQueries({ queryKey: ['activities'] }),
      ])
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const students = query.data?.data ?? []
  const pagination = query.data?.pagination

  const updateFilter = (key: keyof StudentListParams, value: string | number) => {
    setParams((current) => ({
      ...current,
      [key]: value,
      page: 1,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Students</h1>
          <p className="mt-1 text-sm text-slate-500">Manage admissions, profiles, and records.</p>
        </div>
        <Link to="/students/new" className="primary-button">
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          Add student
        </Link>
      </div>

      <section className="rounded-md border border-line bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_120px_150px]">
          <label className="relative">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="field-input pl-9"
              placeholder="Search name, email, mobile, admission no"
              value={params.search}
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </label>
          <input
            className="field-input"
            placeholder="Course"
            value={params.course}
            onChange={(event) => updateFilter('course', event.target.value)}
          />
          <input
            className="field-input"
            placeholder="Year"
            type="number"
            min={1}
            max={8}
            value={params.year}
            onChange={(event) => updateFilter('year', event.target.value ? Number(event.target.value) : '')}
          />
          <select
            className="field-input"
            value={params.gender}
            onChange={(event) => updateFilter('gender', event.target.value as Gender | '')}
          >
            <option value="">All genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-left">
            <thead className="bg-mist/70">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Student</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Admission</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Course</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Year</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">Gender</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">DOB</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex min-w-56 items-center gap-3">
                      {student.photoUrl ? (
                        <img
                          src={getPhotoSrc(student.photoUrl)}
                          alt={student.name}
                          className="h-11 w-11 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-mist text-teal">
                          <UserRound className="h-5 w-5" aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-ink">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.email}</p>
                        <p className="text-sm text-slate-500">{student.mobileNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-700">{student.admissionNumber}</td>
                  <td className="px-4 py-4 text-slate-600">{student.course}</td>
                  <td className="px-4 py-4 text-slate-600">{student.year}</td>
                  <td className="px-4 py-4 text-slate-600">{genderLabel(student.gender)}</td>
                  <td className="px-4 py-4 text-slate-600">{formatDate(student.dateOfBirth)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/students/${student.id}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-slate-600 hover:bg-mist hover:text-teal"
                        aria-label={`Edit ${student.name}`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-100 bg-white text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${student.name}`}
                        onClick={() => setStudentToDelete(student)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!query.isLoading && students.length === 0 && (
          <div className="p-5">
            <EmptyState icon={Users} title="No students found" message="Adjust filters or add the first student record." />
          </div>
        )}

        {query.isLoading && <div className="p-6 text-sm text-slate-500">Loading students...</div>}
        {query.isError && <div className="p-6 text-sm text-red-600">{getErrorMessage(query.error)}</div>}

        {pagination && (
          <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} records
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="secondary-button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setParams((current) => ({ ...current, page: current.page - 1 }))}
              >
                Previous
              </button>
              <button
                type="button"
                className="secondary-button"
                disabled={!pagination.hasNextPage}
                onClick={() => setParams((current) => ({ ...current, page: current.page + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(studentToDelete)}
        title="Delete student"
        message={studentToDelete ? `${studentToDelete.name} will be removed from the system.` : ''}
        confirmLabel="Delete student"
        isLoading={deleteMutation.isPending}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) {
            deleteMutation.mutate(studentToDelete.id)
          }
        }}
      />
    </div>
  )
}
