import { clsx } from 'clsx'

export const cn = (...classes: Array<string | false | null | undefined>) => clsx(classes)

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

export const toInputDate = (value?: string | null) => {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

export const genderLabel = (gender: string) =>
  gender.charAt(0) + gender.slice(1).toLowerCase()
