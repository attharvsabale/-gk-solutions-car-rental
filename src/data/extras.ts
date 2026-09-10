import type { Extra } from '@/types/extras'

export const extras: Extra[] = [
  {
    id: 'extra-child-seat',
    name: 'Child seat',
    description: 'Forward-facing seat suitable for children aged 1–4 years.',
    pricePerDay: 300,
    icon: 'Baby',
    available: true,
  },
  {
    id: 'extra-additional-driver',
    name: 'Additional driver',
    description: 'Register a second driver authorized to drive this vehicle.',
    pricePerDay: 500,
    icon: 'UserPlus',
    available: true,
  },
  {
    id: 'extra-gps',
    name: 'GPS navigation',
    description: 'Dedicated GPS unit with offline maps for your route.',
    pricePerDay: 200,
    icon: 'MapPin',
    available: true,
  },
  {
    id: 'extra-premium-insurance',
    name: 'Premium insurance',
    description: 'Reduces your security deposit liability to zero on damage claims.',
    pricePerDay: 700,
    icon: 'ShieldCheck',
    available: true,
  },
  {
    id: 'extra-roadside-assistance',
    name: 'Roadside assistance',
    description: '24/7 breakdown cover including towing and flat-tyre support.',
    pricePerDay: 250,
    icon: 'LifeBuoy',
    available: true,
  },
  {
    id: 'extra-wifi-hotspot',
    name: 'WiFi hotspot',
    description: 'Portable 4G hotspot device with unlimited data for your trip.',
    pricePerDay: 350,
    icon: 'Wifi',
    available: true,
  },
]

export function getExtraById(id: string): Extra | undefined {
  return extras.find((extra) => extra.id === id)
}
