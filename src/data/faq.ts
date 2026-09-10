export interface FaqItem {
  id: string
  category: 'Booking' | 'Payment' | 'Cancellation' | 'Insurance' | 'Driving License' | 'Pickup' | 'Vehicle' | 'Damage' | 'Fuel'
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  { id: 'faq-1', category: 'Booking', question: 'How far in advance should I book a car?', answer: 'We recommend booking at least 24 hours in advance, though instant-booking vehicles can be reserved as little as 2 hours before pickup, subject to availability.' },
  { id: 'faq-2', category: 'Booking', question: 'Can I change my booking dates after confirming?', answer: 'Yes. Go to Account → Bookings, open the booking, and use the modify option. Rate differences (if any) are recalculated automatically.' },
  { id: 'faq-3', category: 'Payment', question: 'What payment methods are accepted?', answer: 'We support credit/debit cards, UPI, net banking, and popular wallets. Payment is processed securely at the time of booking confirmation.' },
  { id: 'faq-4', category: 'Payment', question: 'Is the security deposit charged upfront?', answer: 'The security deposit is authorized separately from your rental total and is refunded within 5–7 business days after the vehicle is returned undamaged.' },
  { id: 'faq-5', category: 'Cancellation', question: 'What is your cancellation policy?', answer: 'Cancel more than 48 hours before pickup for a full refund. Between 24–48 hours, you receive a 50% refund. Inside 24 hours, bookings are non-refundable.' },
  { id: 'faq-6', category: 'Cancellation', question: 'Do I get a refund if the car is unavailable at pickup?', answer: 'Yes — if we cannot fulfil a confirmed booking, you receive a full refund plus priority rebooking on an equivalent or better vehicle.' },
  { id: 'faq-7', category: 'Insurance', question: 'Is insurance included in the rental price?', answer: 'Basic third-party insurance is included on every rental. Comprehensive premium insurance that removes your deposit liability can be added as an extra.' },
  { id: 'faq-8', category: 'Insurance', question: 'What does premium insurance cover?', answer: 'Premium insurance covers accidental damage, theft, and reduces your out-of-pocket liability to zero, subject to no violation of the rental agreement.' },
  { id: 'faq-9', category: 'Driving License', question: 'What license do I need to rent a car?', answer: 'A valid driving license held for at least 1 year is required. International visitors need an International Driving Permit alongside their home license.' },
  { id: 'faq-10', category: 'Driving License', question: 'Is there a minimum age to rent?', answer: 'The minimum age is 21 for standard vehicles and 25 for luxury vehicles. Drivers under 25 may incur a young-driver surcharge on premium categories.' },
  { id: 'faq-11', category: 'Pickup', question: 'What do I need to bring at pickup?', answer: 'Bring your driving license, a government photo ID, and the credit/debit card used for booking. A quick vehicle walkthrough is done before handover.' },
  { id: 'faq-12', category: 'Pickup', question: 'Can someone else pick up the car on my behalf?', answer: 'The primary renter must be present at pickup. Additional authorized drivers can be added as an extra during booking.' },
  { id: 'faq-13', category: 'Vehicle', question: 'What happens if the car breaks down during my rental?', answer: 'Call or WhatsApp us immediately at 9657921567. We will arrange a replacement vehicle or on-site repair at no additional cost, provided the issue isn’t due to misuse.' },
  { id: 'faq-14', category: 'Damage', question: 'What if the car is damaged during my rental?', answer: 'Report it immediately via the Account → Bookings page or by calling us directly. Without premium insurance, repair costs up to your deposit amount may apply.' },
  { id: 'faq-15', category: 'Fuel', question: 'What is the fuel policy?', answer: 'Vehicles are handed over with a full tank and should be returned full. A refuelling service charge applies if the tank isn’t topped up at return.' },
  { id: 'faq-16', category: 'Fuel', question: 'Is the Toyota Hyryder fully electric?', answer: 'No — the Hyryder uses a strong hybrid petrol engine, so it refuels at any petrol pump like our other vehicles. It simply uses less fuel in city driving thanks to the hybrid system.' },
]
