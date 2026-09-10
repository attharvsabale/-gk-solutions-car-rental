import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { useAuth } from '@/hooks/useAuth'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navLinks: { to: string; label: string }[]
}

export function MobileNav({ isOpen, onClose, navLinks }: MobileNavProps) {
  const { user, logout } = useAuth()

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Menu" side="right">
      <nav className="flex flex-col gap-1" aria-label="Mobile">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="rounded-md px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50"
          >
            {link.label}
          </Link>
        ))}
        <Link to="/account?tab=favorites" onClick={onClose} className="rounded-md px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50">
          Favorites
        </Link>
      </nav>

      <div className="mt-6 border-t border-ink-100 pt-6">
        {user ? (
          <div className="flex flex-col gap-1">
            <Link to="/account" onClick={onClose} className="rounded-md px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50">
              Account
            </Link>
            <Link to="/account/bookings" onClick={onClose} className="rounded-md px-3 py-3 text-base font-medium text-ink-800 hover:bg-ink-50">
              My bookings
            </Link>
            <button
              onClick={async () => {
                onClose()
                await logout()
              }}
              className="flex items-center gap-2 rounded-md px-3 py-3 text-left text-base font-medium text-danger-600 hover:bg-danger-100/40"
            >
              <LogOut className="h-5 w-5" /> Log out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              onClick={onClose}
              className="rounded-md border border-ink-200 px-3 py-3 text-center text-base font-medium text-ink-800 hover:bg-ink-50"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="rounded-md bg-brand-500 px-3 py-3 text-center text-base font-semibold text-ink-950 hover:bg-brand-400"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </Drawer>
  )
}
