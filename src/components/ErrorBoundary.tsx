import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertOctagon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-100">
            <AlertOctagon className="h-7 w-7 text-danger-500" />
          </div>
          <h1 className="text-xl font-semibold text-ink-900">Something went wrong.</h1>
          <p className="max-w-sm text-sm text-ink-500">
            We hit an unexpected error. Reloading the page usually fixes this.
          </p>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      )
    }

    return this.props.children
  }
}
