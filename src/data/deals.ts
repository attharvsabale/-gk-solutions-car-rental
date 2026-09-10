export interface Deal {
  id: string
  title: string
  description: string
  badge: string
  filterQuery: string
}

export const deals: Deal[] = [
  { id: 'deal-weekend', title: 'Weekend getaway', description: 'Flat pricing on Friday–Sunday pickups for a quick trip out of Pune.', badge: '15% off', filterQuery: '?sort=price-asc' },
  { id: 'deal-weekly', title: 'Weekly discount', description: 'Automatic weekly discount applied for rentals of 7 days or more.', badge: '10% off', filterQuery: '?sort=recommended' },
  { id: 'deal-longterm', title: 'Long-term rental', description: 'Best-in-class monthly rates for rentals of 30 days or more.', badge: '20% off', filterQuery: '?sort=recommended' },
  { id: 'deal-business', title: 'Business travel', description: 'Instant-booking vehicles for client visits and outstation work trips.', badge: 'Instant', filterQuery: '?instant=true' },
  { id: 'deal-luxury', title: 'Special occasion', description: 'Book the BMW X3 for anniversaries, celebrations, or client pickups.', badge: 'Premium', filterQuery: '?type=Luxury' },
]
