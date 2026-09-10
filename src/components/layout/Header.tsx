import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Car, Heart, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'
import { MobileNav } from './MobileNav'

const navLinks = [
  { to: '/cars', label: 'Cars' },
  { to: '/locations', label: 'Locations' },
  { to: '/deals', label: 'Deals' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'Help' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow',
        isScrolled ? 'border-ink-100 shadow-card' : 'border-transparent',
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-ink-950 shadow-[0_4px_10px_-3px_rgb(202_138_4_/_0.5)]">
            <Car className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span>GK Solutions</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink-400">Drive Your Way</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-950',
                  isActive && 'text-ink-950',
                  "after:absolute after:inset-x-3 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-brand-500 after:transition-transform after:duration-200",
                  isActive ? 'after:scale-x-100' : 'after:scale-x-0',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/account?tab=favorites"
            aria-label="View favorites"
            className="rounded-md p-2 text-ink-500 hover:bg-ink-50 hover:text-ink-900"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-ink-800 hover:bg-ink-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                  {user.firstName.charAt(0)}
                </span>
                {user.firstName}
              </button>
              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-48 rounded-md border border-ink-100 bg-white py-1 shadow-panel"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <Link role="menuitem" to="/account" className="block px-4 py-2 text-sm text-ink-700 hover:bg-ink-50" onClick={() => setIsUserMenuOpen(false)}>
                    Account
                  </Link>
                  <Link role="menuitem" to="/account/bookings" className="block px-4 py-2 text-sm text-ink-700 hover:bg-ink-50" onClick={() => setIsUserMenuOpen(false)}>
                    My bookings
                  </Link>
                  <button
                    role="menuitem"
                    onClick={async () => {
                      setIsUserMenuOpen(false)
                      await logout()
                      navigate('/')
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-100/40"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-950 shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 text-ink-700 hover:bg-ink-50 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} navLinks={navLinks} />
    </header>
  )
}
