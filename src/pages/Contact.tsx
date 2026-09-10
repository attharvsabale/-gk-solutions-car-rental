import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { contactSchema, type ContactFormValues } from '@/lib/validation'
import { setPageMeta } from '@/lib/seo'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setPageMeta('Contact Us | GK Solutions', 'Call, WhatsApp, or email GK Solutions to book a self-drive rental in Hinjewadi, Pune.')
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  function onSubmit() {
    setSubmitted(true)
    reset()
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-950">Contact us</h1>
      <p className="mt-2 max-w-xl text-ink-500">Call or WhatsApp for the fastest response — Girish usually replies within a few hours.</p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <ContactInfo icon={Phone} title="Call / WhatsApp" detail="9657921567" href="tel:+919657921567" />
          <ContactInfo icon={Mail} title="Email" detail="gksolution567@gmail.com" href="mailto:gksolution567@gmail.com" />
          <ContactInfo icon={Clock} title="Hours" detail="7:00 AM – 9:00 PM, every day" />
          <ContactInfo icon={MapPin} title="Pickup location" detail="Hinjewadi, Pune" />
          <ContactInfo icon={AtSign} title="Instagram" detail="@gksolutions_pune" href="https://instagram.com/gksolutions_pune" />
        </div>

        <div className="rounded-lg border border-ink-100 p-6 shadow-card">
          {submitted ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="text-lg font-semibold text-ink-900">Message sent</p>
              <p className="text-sm text-ink-500">Thanks for reaching out — we'll be in touch shortly.</p>
              <Button variant="outline" className="mt-3" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" {...register('name')} error={errors.name?.message} />
                <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              </div>
              <Input label="Phone (optional)" type="tel" {...register('phone')} error={errors.phone?.message} />
              <Input label="Subject" {...register('subject')} error={errors.subject?.message} />
              <Textarea label="Message" rows={5} {...register('message')} error={errors.message?.message} />
              <Button type="submit" size="lg" className="self-start">Send message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactInfo({
  icon: Icon,
  title,
  detail,
  href,
}: {
  icon: typeof Phone
  title: string
  detail: string
  href?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-medium text-ink-900">{title}</p>
        {href ? (
          <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-sm text-ink-500 hover:text-brand-700">
            {detail}
          </a>
        ) : (
          <p className="text-sm text-ink-500">{detail}</p>
        )}
      </div>
    </div>
  )
}
