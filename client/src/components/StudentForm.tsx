import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { ImagePlus, Save, X } from 'lucide-react'
import { getPhotoSrc } from '../lib/api'
import { toInputDate } from '../lib/utils'
import { studentFormSchema } from '../schemas/studentSchema'
import type { Student, StudentFormValues } from '../types/student'

interface StudentFormProps {
  student?: Student
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: StudentFormValues, photo?: File | null) => void
}

const defaultValues: StudentFormValues = {
  name: '',
  course: '',
  year: 1,
  dateOfBirth: '',
  email: '',
  mobileNo: '',
  gender: 'MALE',
  address: '',
}

export function StudentForm({ student, submitLabel, isSubmitting, onSubmit }: StudentFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const initialValues = useMemo<StudentFormValues>(
    () =>
      student
        ? {
            name: student.name,
            course: student.course,
            year: student.year,
            dateOfBirth: toInputDate(student.dateOfBirth),
            email: student.email,
            mobileNo: student.mobileNo,
            gender: student.gender,
            address: student.address,
          }
        : defaultValues,
    [student],
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialValues,
    values: initialValues,
  })

  const selectedPhotoUrl = useMemo(() => (photoFile ? URL.createObjectURL(photoFile) : ''), [photoFile])
  const existingPhotoUrl = student?.photoUrl ? getPhotoSrc(student.photoUrl) : ''
  const previewUrl = selectedPhotoUrl || existingPhotoUrl
 
  useEffect(() => {
    if (!selectedPhotoUrl) {
      return undefined
    }

    return () => URL.revokeObjectURL(selectedPhotoUrl)
  }, [selectedPhotoUrl])

  return (
    <form
      className="grid gap-6 rounded-md border border-line bg-white p-5 shadow-sm lg:grid-cols-[1fr_280px]"
      onSubmit={handleSubmit((values) => onSubmit(values, photoFile))}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">
            Name
          </label>
          <input id="name" className="field-input mt-1" {...register('name')} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="course">
            Course
          </label>
          <input id="course" className="field-input mt-1" {...register('course')} />
          {errors.course && <p className="field-error">{errors.course.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="year">
            Year
          </label>
          <input
            id="year"
            min={1}
            max={8}
            type="number"
            className="field-input mt-1"
            {...register('year', { valueAsNumber: true })}
          />
          {errors.year && <p className="field-error">{errors.year.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="dateOfBirth">
            Date of birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className="field-input mt-1"
            {...register('dateOfBirth')}
          />
          {errors.dateOfBirth && <p className="field-error">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" className="field-input mt-1" {...register('email')} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="mobileNo">
            Mobile no
          </label>
          <input id="mobileNo" className="field-input mt-1" {...register('mobileNo')} />
          {errors.mobileNo && <p className="field-error">{errors.mobileNo.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="gender">
            Gender
          </label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <select id="gender" className="field-input mt-1" {...field}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            )}
          />
          {errors.gender && <p className="field-error">{errors.gender.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="address">
            Address
          </label>
          <textarea id="address" rows={4} className="field-input mt-1" {...register('address')} />
          {errors.address && <p className="field-error">{errors.address.message}</p>}
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-md border border-line bg-mist">
          {previewUrl ? (
            <img src={previewUrl} alt="Student preview" className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 text-slate-500">
              <ImagePlus className="h-10 w-10" aria-hidden="true" />
              <span className="text-sm font-medium">Photo</span>
            </div>
          )}
        </div>

        <label className="secondary-button cursor-pointer">
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
          Upload photo
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
          />
        </label>

        {photoFile && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => setPhotoFile(null)}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Remove selection
          </button>
        )}

        <button type="submit" className="primary-button mt-auto" disabled={isSubmitting}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </aside>
    </form>
  )
}
