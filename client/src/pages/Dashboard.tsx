import { useQuery } from '@tanstack/react-query'
import { Activity, CalendarPlus, GraduationCap, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EmptyState } from '../components/EmptyState'
import { StatCard } from '../components/StatCard'
import { fetchActivities, fetchAnalytics } from '../lib/api'
import { formatDate, genderLabel } from '../lib/utils'

const chartColors = ['#0f766e', '#e4572e', '#b7791f', '#2f855a', '#4f46e5']

export function Dashboard() {
  const analyticsQuery = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
  })
  const activitiesQuery = useQuery({
    queryKey: ['activities', 6],
    queryFn: () => fetchActivities(6),
  })

  const analytics = analyticsQuery.data
  const topCourse = analytics?.courseCounts[0]?.course ?? 'None'
  const activeYears = analytics?.yearCounts.length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Student records, distribution, and recent updates.</p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={analyticsQuery.isLoading ? '...' : analytics?.totalStudents ?? 0}
          tone="bg-teal/10 text-teal"
          icon={Users}
        />
        <StatCard
          label="Added in 30 days"
          value={analyticsQuery.isLoading ? '...' : analytics?.recentStudentCount ?? 0}
          tone="bg-coral/10 text-coral"
          icon={CalendarPlus}
        />
        <StatCard label="Active years" value={activeYears} tone="bg-amber/10 text-amber" icon={Activity} />
        <StatCard label="Top course" value={topCourse} tone="bg-leaf/10 text-leaf" icon={GraduationCap} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-md border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Students by course</h2>
          </div>
          {analytics?.courseCounts.length ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.courseCounts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={Users} title="No course data" message="Course analytics appear after students are added." />
          )}
        </div>

        <div className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Gender mix</h2>
          {analytics?.genderCounts.length ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.genderCounts.map((item) => ({
                      name: genderLabel(item.gender),
                      value: item.count,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {analytics.genderCounts.map((item, index) => (
                      <Cell key={item.gender} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon={Users} title="No gender data" message="Gender analytics appear after students are added." />
          )}
        </div>
      </section>

      <section className="rounded-md border border-line bg-white shadow-sm">
        <div className="border-b border-line p-5">
          <h2 className="text-lg font-semibold text-ink">Recent activity</h2>
        </div>
        <div className="divide-y divide-line">
          {activitiesQuery.data?.length ? (
            activitiesQuery.data.map((activity) => (
              <div key={activity.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-ink">{activity.message}</p>
                  <p className="text-sm text-slate-500">{activity.admissionNumber ?? activity.entityType}</p>
                </div>
                <span className="text-sm text-slate-500">{formatDate(activity.createdAt)}</span>
              </div>
            ))
          ) : (
            <div className="p-5">
              <EmptyState icon={Activity} title="No activity" message="Create, update, and delete actions will appear here." />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
