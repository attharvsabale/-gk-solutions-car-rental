import { NavLink, Outlet } from 'react-router-dom'
import { CalendarDays, Heart, LayoutDashboard, UserRound } from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/account', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/account/bookings', label: 'My bookings', icon: CalendarDays, end: false },
  { to: '/account?tab=favorites', label: 'Favorites', icon: Heart, end: false },
  { to: '/account/profile', label: 'Profile', icon: UserRound, end: false },
]

export default function AccountLayout() {
  return (
    <div className="container-page py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Account" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50',
                  isActive && 'bg-ink-950 text-white hover:bg-ink-950',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
