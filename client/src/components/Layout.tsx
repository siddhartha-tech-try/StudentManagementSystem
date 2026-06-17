import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, GraduationCap, PlusCircle, Users } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/students', label: 'Students', icon: Users, end: false },
  { to: '/students/new', label: 'Add Student', icon: PlusCircle, end: true },
]

export function Layout() {
  return (
    <div className="min-h-screen bg-[#f6f8f7] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-white px-5 py-6 lg:block">
        <div className="flex items-center gap-3 border-b border-line pb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal text-white">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold">StudentMS</p>
            <p className="text-sm text-slate-500">Administration</p>
          </div>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition',
                    isActive ? 'bg-mist text-teal' : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
                  )
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold">
              <GraduationCap className="h-6 w-6 text-teal" aria-hidden="true" />
              StudentMS
            </div>
            <NavLink to="/students/new" className="primary-button px-3">
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Add
            </NavLink>
          </div>
          <nav className="mt-3 grid grid-cols-2 gap-2">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold',
                      isActive
                        ? 'border-teal bg-teal text-white'
                        : 'border-line bg-white text-slate-600',
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </header>

        <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
