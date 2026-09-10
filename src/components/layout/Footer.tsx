import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AtSign, Car, MessageCircle, ThumbsUp } from 'lucide-react'
import { subscribeToNewsletter } from '@/services/newsletterService'
import { useToastStore } from '@/store/useToastStore'

const columns = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Rental',
    links: [
      { to: '/cars', label: 'Browse cars' },
      { to: '/locations', label: 'Pickup location' },
      { to: '/deals', label: 'Deals' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/faq', label: 'Cancellation' },
      { to: '/faq', label: 'Terms' },
      { to: '/faq', label: 'Privacy' },
    ],
  },
]

const socialLinks = [
  { icon: AtSign, label: 'Instagram', href: 'https://instagram.com/gksolutions_pune' },
  { icon: ThumbsUp, label: 'Facebook', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/919657921567' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const showToast = useToastStore((state) => state.show)

  function handleSubscribe(event: FormEvent) {
    event.preventDefault()
    if (!email.includes('@')) {
      showToast('Enter a valid email address.', 'error')
      return
    }
    subscribeToNewsletter(email)
    setSubscribed(true)
    showToast('Subscribed to newsletter', 'success')
  }

  return (
    <footer className="border-t border-ink-100 bg-ink-950 text-ink-300">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_2fr_1.3fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-ink-950">
              <Car className="h-5 w-5" />
            </span>
            GK Solutions
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
            Self-drive car rental in Hinjewadi, Pune. No driver needed, affordable rates, on your terms.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 hover:bg-white/10 hover:text-white"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link, index) => (
                  <li key={`${link.label}-${index}`}>
                    <Link to={link.to} className="text-sm text-ink-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Stay in the loop</h3>
          <p className="mt-3 text-sm text-ink-400">Get notified about new deals and updates.</p>
          {subscribed ? (
            <p className="mt-4 rounded-md bg-white/10 px-3 py-2 text-sm text-white">You're subscribed — thank you!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-ink-500 focus:border-white/30 focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 rounded-md bg-brand-500 px-4 text-sm font-semibold text-ink-950 hover:bg-brand-400"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} GK Solutions. All rights reserved.</p>
          <p>Contact us via call or WhatsApp for current rates.</p>
        </div>
      </div>
    </footer>
  )
}
