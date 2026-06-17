import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  tone: string
  icon: LucideIcon
}

export function StatCard({ label, value, tone, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-md border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-md ${tone}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
