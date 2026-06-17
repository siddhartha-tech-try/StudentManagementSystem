import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StudentForm } from '../components/StudentForm'
import { createStudent, getErrorMessage } from '../lib/api'
import type { StudentFormValues } from '../types/student'
import { useToast } from '../context/toast'

export function StudentCreate() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()

  const mutation = useMutation({
    mutationFn: ({ values, photo }: { values: StudentFormValues; photo?: File | null }) =>
      createStudent(values, photo),
    onSuccess: async () => {
      toast.success('Student created successfully')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students'] }),
        queryClient.invalidateQueries({ queryKey: ['analytics'] }),
        queryClient.invalidateQueries({ queryKey: ['activities'] }),
      ])
      navigate('/students')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/students" className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Students
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Add student</h1>
        </div>
      </div>

      <StudentForm
        submitLabel="Create student"
        isSubmitting={mutation.isPending}
        onSubmit={(values, photo) => mutation.mutate({ values, photo })}
      />
    </div>
  )
}
