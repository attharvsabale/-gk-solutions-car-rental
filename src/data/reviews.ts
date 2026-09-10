import { avatarPool } from '@/config/images'

export interface CustomerReview {
  id: string
  name: string
  avatar: string
  rating: number
  review: string
  carRented: string
  date: string
}

/**
 * Placeholder testimonials — GK Solutions is a small, real business and
 * doesn't have a bank of written reviews yet. Swap these for genuine
 * customer feedback as soon as it's available; don't leave these looking
 * like verified reviews once real ones exist.
 */
export const reviews: CustomerReview[] = [
  {
    id: 'review-1',
    name: 'Ananya Rao',
    avatar: avatarPool[0],
    rating: 5,
    review: 'Booked the Beat over WhatsApp for a weekend trip to Lonavala — car was clean, full tank, and pickup at Hinjewadi was quick.',
    carRented: 'Chevrolet Beat',
    date: '2026-07-18',
  },
  {
    id: 'review-2',
    name: 'Rohan Mehta',
    avatar: avatarPool[1],
    rating: 4.5,
    review: 'Rented the Spark for a few days while my own car was in service. Affordable, easy to park, and no fuss about the deposit.',
    carRented: 'Chevrolet Spark',
    date: '2026-06-02',
  },
  {
    id: 'review-3',
    name: 'Priya Nair',
    avatar: avatarPool[2],
    rating: 5,
    review: 'The BMW X3 made our anniversary weekend feel special. Girish personally walked us through the car at handover — great service.',
    carRented: 'BMW X3',
    date: '2026-05-21',
  },
  {
    id: 'review-4',
    name: 'Karan Verma',
    avatar: avatarPool[3],
    rating: 4.5,
    review: 'Took the Hyryder on an outstation trip to Mahabaleshwar. Spacious, comfortable, and the hybrid engine saved a lot on fuel.',
    carRented: 'Toyota Urban Cruiser Hyryder',
    date: '2026-04-14',
  },
  {
    id: 'review-5',
    name: 'Sneha Kulkarni',
    avatar: avatarPool[4],
    rating: 5,
    review: 'Needed a car for client visits across Hinjewadi for a week. Flexible rental plan and the Hyryder was ready whenever I needed it.',
    carRented: 'Toyota Urban Cruiser Hyryder',
    date: '2026-03-09',
  },
]
