import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { StudentForm } from '../components/StudentForm'
import { fetchStudent, getErrorMessage, updateStudent } from '../lib/api'
import type { StudentFormValues } from '../types/student'
import { useToast } from '../context/toast'

export function StudentEdit() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()

  const studentQuery = useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchStudent(id),
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: ({ values, photo }: { values: StudentFormValues; photo?: File | null }) =>
      updateStudent(id, values, photo),
    onSuccess: async () => {
      toast.success('Student updated successfully')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students'] }),
        queryClient.invalidateQueries({ queryKey: ['student', id] }),
        queryClient.invalidateQueries({ queryKey: ['analytics'] }),
        queryClient.invalidateQueries({ queryKey: ['activities'] }),
      ])
      navigate('/students')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  if (studentQuery.isLoading) {
    return <div className="rounded-md border border-line bg-white p-6 text-sm text-slate-500">Loading student...</div>
  }

  if (studentQuery.isError || !studentQuery.data) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Student unavailable"
        message={studentQuery.isError ? getErrorMessage(studentQuery.error) : 'The requested record was not found.'}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/students" className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Students
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Edit student</h1>
        <p className="mt-1 text-sm text-slate-500">{studentQuery.data.admissionNumber}</p>
      </div>

      <StudentForm
        student={studentQuery.data}
        submitLabel="Save changes"
        isSubmitting={mutation.isPending}
        onSubmit={(values, photo) => mutation.mutate({ values, photo })}
      />
    </div>
  )
}
