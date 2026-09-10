import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface AccordionItemData {
  id: string
  question: string
  answer: ReactNode
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="divide-y divide-ink-100 rounded-lg border border-ink-100">
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `accordion-panel-${item.id}`
        const buttonId = `accordion-button-${item.id}`
        return (
          <div key={item.id}>
            <button
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-ink-900 hover:bg-ink-50"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={cn('h-4 w-4 shrink-0 text-ink-400 transition-transform', isOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-4 text-sm leading-relaxed text-ink-600"
            >
              {item.answer}
            </div>
          </div>
        )
      })}
    </div>
  )
}
