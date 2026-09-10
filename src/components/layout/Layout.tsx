import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Toaster } from '@/components/ui/Toaster'
import { DebugPanel } from '@/components/DebugPanel'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <DebugPanel />
    </div>
  )
}
