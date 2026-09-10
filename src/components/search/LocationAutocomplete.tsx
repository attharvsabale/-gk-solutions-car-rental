import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { MapPin } from 'lucide-react'
import { locations } from '@/data/locations'
import { cn } from '@/lib/cn'

interface LocationAutocompleteProps {
  label: string
  value: string
  onChange: (locationId: string) => void
  placeholder?: string
  error?: string
  theme?: 'light' | 'dark'
}

export function LocationAutocomplete({ label, value, onChange, placeholder, error, theme = 'light' }: LocationAutocompleteProps) {
  const selectedLocation = locations.find((location) => location.id === value)
  const [query, setQuery] = useState(selectedLocation ? `${selectedLocation.name}` : '')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = `location-${label.replace(/\s/g, '-').toLowerCase()}`

  const matches = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(query.toLowerCase()) || location.city.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectLocation(locationId: string) {
    const location = locations.find((l) => l.id === locationId)
    if (!location) return
    onChange(locationId)
    setQuery(location.name)
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.min(index + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const match = matches[highlightedIndex]
      if (match) selectLocation(match.id)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={cn(
          'text-[13px] font-medium',
          theme === 'dark' ? 'text-white/60' : 'text-ink-700',
        )}
      >
        {label}
      </label>
      <div className="relative">
        <MapPin
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
            theme === 'dark' ? 'text-white/40' : 'text-ink-400',
          )}
        />
        <input
          id={inputId}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-listbox`}
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(0)
          }}
          onKeyDown={handleKeyDown}
          className={
            theme === 'dark'
              ? cn(
                  'h-11 w-full rounded-lg border border-transparent bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/40',
                  'transition-[border-color,box-shadow,background-color] duration-150 hover:bg-white/15',
                  'focus:border-brand-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-brand-400/20',
                  error && 'border-danger-400',
                )
              : cn(
                  'h-11 w-full rounded-lg border border-ink-200 bg-ink-50/60 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400',
                  'transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300',
                  'focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12',
                  error && 'border-danger-500 bg-white',
                )
          }
        />
      </div>
      {error && (
        <p className={cn('text-xs font-medium', theme === 'dark' ? 'text-danger-300' : 'text-danger-600')}>{error}</p>
      )}

      {isOpen && matches.length > 0 && (
        <ul
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute top-full z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-ink-100 bg-white py-1 shadow-panel"
        >
          {matches.map((location, index) => (
            <li key={location.id} role="option" aria-selected={value === location.id}>
              <button
                type="button"
                onClick={() => selectLocation(location.id)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  'flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-ink-50',
                  highlightedIndex === index && 'bg-ink-50',
                )}
              >
                <span className="font-medium text-ink-900">{location.name}</span>
                <span className="text-xs text-ink-500">{location.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
