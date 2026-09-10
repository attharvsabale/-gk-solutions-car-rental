import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { faqItems } from '@/data/faq'
import { Accordion } from '@/components/ui/Accordion'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/cn'
import { setPageMeta } from '@/lib/seo'

const categories = Array.from(new Set(faqItems.map((item) => item.category)))

export default function Faq() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    setPageMeta('FAQ | GK Solutions', 'Answers to common questions about booking, payment, cancellation, and insurance.')
  }, [])

  const filtered = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesQuery =
        !query ||
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !activeCategory || item.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [query, activeCategory])

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-950">Frequently asked questions</h1>

      <div className="mt-6 relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions..."
          aria-label="Search FAQ"
          className="h-11 w-full rounded-md border border-ink-200 pl-9 pr-3 text-sm focus:border-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium',
            activeCategory === null ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 text-ink-700 hover:bg-ink-50',
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium',
              activeCategory === category ? 'border-ink-950 bg-ink-950 text-white' : 'border-ink-200 text-ink-700 hover:bg-ink-50',
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 max-w-3xl">
        {filtered.length === 0 ? (
          <EmptyState icon={Search} title="No results" description="Try a different search term or category." />
        ) : (
          <Accordion items={filtered.map((item) => ({ id: item.id, question: item.question, answer: item.answer }))} />
        )}
      </div>
    </div>
  )
}
