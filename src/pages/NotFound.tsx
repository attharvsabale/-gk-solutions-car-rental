import { useEffect } from 'react'
import { Compass } from 'lucide-react'
import { LinkButton } from '@/components/ui/LinkButton'
import { setPageMeta } from '@/lib/seo'

export default function NotFound() {
  useEffect(() => {
    setPageMeta('Page Not Found | GK Solutions', 'The page you are looking for does not exist.')
  }, [])

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-50">
        <Compass className="h-8 w-8 text-ink-400" />
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink-950">404 — Page not found</h1>
      <p className="max-w-sm text-ink-500">The page you're looking for doesn't exist or may have moved.</p>
      <div className="flex gap-3">
        <LinkButton to="/">Back to home</LinkButton>
        <LinkButton to="/cars" variant="outline">Browse cars</LinkButton>
      </div>
    </div>
  )
}
