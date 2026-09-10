# GK Solutions — Car Rental Platform (Frontend)

A production-quality, **frontend-only** car rental platform: browse and search
cars, configure a rental, add extras, enter customer details, pay (simulated),
get a confirmation, and manage bookings from an account dashboard.

There is **no real backend**. Every "API" call is a Promise-based mock service
that simulates network latency and persists to `localStorage`. The app is
architected so a real backend can be swapped in later by rewriting only the
`services/api/*` implementations — no component would need to change.

## Tech stack

- React 19 + TypeScript (strict) + Vite
- React Router (client-side routing, URL-driven search state)
- Tailwind CSS v4 (design tokens via `@theme` in `src/index.css`)
- Zustand (auth session, booking draft, favorites, toasts)
- React Hook Form + Zod (all form validation)
- date-fns (date math)
- lucide-react (icons)
- Vitest (unit tests for business logic)

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check + production build
npm run test      # run the unit test suite (vitest)
npm run lint      # oxlint
```

No environment variables are required to run the app. `.env.development` sets
`VITE_ENABLE_DEBUG=true`, which enables the debug panel (see below) only in
development.

## Architecture

The app is layered so UI code never touches persistence or business rules
directly:

```
pages/ & components/   → presentation only
        ↓
hooks/                 → data-fetching + local UI state (useCars, useAuth, …)
        ↓
services/api/*         → the "backend" contract (CarsApi, BookingsApi, …)
        ↓
services/*Service.ts   → business logic (pricing, cancellation, availability)
        ↓
data/*                 → mock inventory (cars, locations, extras, FAQs…)
        ↓
lib/storageService.ts  → the only module allowed to touch localStorage directly
```

Key rules this codebase follows:

- **No business logic in components.** Pricing math lives in
  `services/pricingService.ts`, refund rules in
  `services/cancellationService.ts`, availability/double-booking checks in
  `services/availabilityService.ts`. Components call these, they don't
  reimplement them.
- **No magic numbers.** Tax rate, service fee, discount thresholds, minimum
  driver age, cancellation windows, etc. live in `config/businessRules.ts`
  and `config/pricingConfig.ts`.
- **No direct `localStorage` calls in UI code.** Everything goes through
  `lib/storageService.ts` (plain reads/writes) or the Zustand stores in
  `store/` (which use a `persist` adapter built on the same principle).
- **Components depend on interfaces, not mock details.** `services/api/types.ts`
  defines `CarsApi`, `BookingsApi`, `AuthApi`, `LocationsApi`, `PaymentsApi`.
  The `mock*Api` objects in `services/api/*.ts` implement those interfaces.
  Hooks (`useCars`, `useBooking`, …) import from `services/api` — never from
  `data/*` directly — so swapping mocks for real HTTP calls later is a
  find-and-replace, not a rewrite.

## Folder structure

```
src/
  components/
    ui/          Reusable primitives — Button, Input, Modal, Drawer, Toaster,
                 Skeleton, EmptyState, ErrorState, Accordion, StarRating…
    layout/      Header, Footer, MobileNav, Layout (the app shell)
    cars/        CarCard, CarGrid, CarFilters, CarSort, CarGallery, …
    booking/     BookingStepper, BookingSummary, ExtrasSelector,
                 PaymentMethodTabs, CardPaymentForm, BookingReceipt, …
    home/        Hero, PopularCars, WhyChooseUs, HowItWorks, Destinations, …
    search/      SearchWidget, LocationAutocomplete
    account/     (account-specific bits used by pages/account/*)
    DebugPanel.tsx, ErrorBoundary.tsx
  pages/         One file per route; booking/ and account/ have nested
                 layouts (BookingLayout, AccountLayout) that render an
                 <Outlet />
  hooks/         useCars, useCar, useSearchCars, useAuth, useFavorites,
                 useBooking, useDebounce, useLocalStorage…
  services/
    api/         The backend-shaped contract + mock implementations
    pricingService.ts, cancellationService.ts, availabilityService.ts,
    favoritesService.ts, newsletterService.ts
  store/         Zustand stores (auth, booking draft, favorites, toasts)
  data/          Mock inventory: 41 cars, 8 locations, 6 extras, reviews,
                 FAQs, deals, destinations
  config/        businessRules.ts, pricingConfig.ts, debugConfig.ts,
                 bookingStatus.ts, images.ts
  lib/           format.ts, date.ts, id.ts, validation.ts (Zod schemas),
                 storageService.ts, searchParams.ts, seo.ts, cn.ts
  types/         car.ts, booking.ts, user.ts, location.ts, payment.ts,
                 pricing.ts, filters.ts, extras.ts, common.ts
  routes/        ProtectedRoute, GuestRoute
```

## How the mock API works

Every function in `services/api/*.ts` is `async`, returns
`Promise<ApiResult<T>>` (`{ success: true, data } | { success: false, error }`),
and awaits an artificial `delay()` before resolving — exactly like a real
fetch call. Hooks (`useCars`, `useCar`, `useSearchCars`, `useBooking`, …)
consume these and expose `{ data, isLoading, error }` to components, which
render skeletons / error states / empty states accordingly.

`config/debugConfig.ts` exposes a shared `mockConfig` object
(`simulateApiError`, `simulatePaymentFailure`, `simulateSlowNetwork`) that
every mock endpoint checks before resolving, so you can exercise error paths
deterministically instead of relying on random flakiness.

## How localStorage is used

| Key | Purpose |
|---|---|
| `car-rental:users` / `car-rental:credentials` | Mock user accounts (see security note below) |
| `car-rental:session` | Currently "logged in" user id |
| `car-rental:bookings` | All bookings ever created, across all users |
| `car-rental:favorites` | Favorited car ids, per user id (or a `guest` bucket) |
| `car-rental:booking-draft` | The in-progress booking wizard state (survives refresh) |
| `car-rental:availability-overrides` | Debug-panel car availability toggles |
| `car-rental:newsletter` | Newsletter signups from the footer form |

Because bookings are read back when checking availability
(`services/availabilityService.ts`), refreshing mid-booking or double-booking
the same car for overlapping dates is handled without a real backend.

## The booking flow

`store/useBookingStore.ts` holds a single "draft" (car, pickup/drop-off
location + dates, extras, insurance, customer) persisted to `localStorage` via
Zustand's `persist` middleware, so a refresh mid-flow doesn't lose progress.

1. **Select vehicle** — `/cars/:carId`, "Reserve this car" seeds the draft.
2. **Rental details** — `/booking` — confirms dates/locations, re-checks
   availability.
3. **Extras** — `/booking/extras` — quantity-steppers per extra + insurance
   toggle.
4. **Customer** — `/booking/customer` — React Hook Form + Zod, prefilled from
   the logged-in user if available.
5. **Review** — `/booking/review` — calls `bookingsApi.createBooking()`
   (status `pending`), stores the returned id.
6. **Payment** — `/booking/payment` — card/UPI/net-banking/wallet tabs;
   `paymentsApi.processPayment()` simulates processing → success/failure.
   Test card `4242 4242 4242 4242` always succeeds; `4000 0000 0000 0002`
   always declines. On success the booking is updated to `confirmed`.
7. **Success** — `/booking/success/:bookingId` — receipt, printable via the
   browser's print dialog (no fake server-generated PDF), clears the draft.

`BookingLayout` guards every step: if there's no car in the draft, it
redirects to `/cars`. All state changes flow one direction (draft → booking →
payment) to avoid races between resetting the draft and navigating away —
see the comment in `pages/booking/Success.tsx` if you're touching that code.

## Debug mode

With `VITE_ENABLE_DEBUG=true` (the default in dev), a small bug-icon button
appears bottom-left. It lets you: reset the entire mock database, generate a
sample booking, mark every car unavailable, clear availability overrides, and
flip the failure-simulation flags described above. It's intentionally
unobtrusive and excluded from production if the env var is unset.

## Security note (read this before assuming anything is "real")

Authentication (`services/api/authApi.ts`) stores credentials in
**plain text in localStorage**. This is a prototype convenience to simulate a
signed-in session with no backend — it is not, and must never be treated as,
a real authentication system. A real backend needs hashed passwords, server
sessions or JWTs, and HTTPS-only storage. Similarly, the payment flow never
transmits card data anywhere; it only simulates success/failure locally.

## Replacing the mock API with a real backend

Nothing outside `services/api/*.ts` should need to change. The plan:

1. Implement `HttpCarsApi implements CarsApi` (and the same for
   `BookingsApi`, `AuthApi`, `LocationsApi`, `PaymentsApi`) calling real REST
   endpoints, e.g.:

   ```
   GET  /api/cars                  POST /api/cars/search
   GET  /api/cars/:id               GET /api/locations
   POST /api/auth/login             POST /api/auth/register
   GET  /api/users/me
   GET  /api/bookings               GET /api/bookings/:id
   POST /api/bookings                POST /api/bookings/:id/cancel
   POST /api/payments/create         POST /api/payments/confirm
   ```

2. Swap the exports in `services/api/index.ts` from `mock*Api` to the new
   `http*Api` implementations.
3. Delete `services/availabilityService.ts`'s localStorage-based conflict
   check (the backend now owns availability) and
   `lib/storageService.ts`'s booking/user/session keys (replaced by real
   sessions/cookies).
4. Keep `pricingService.ts` and `cancellationService.ts` as the source of
   truth for display formatting, but mirror their rules server-side so the
   backend is authoritative on price/refund calculation.

Suggested backend stack: Node.js (Express/NestJS) + PostgreSQL + Redis for
session/cache, JWT or OAuth for auth, Stripe/Razorpay for payments, S3 +
CloudFront for vehicle images, and Google Maps/Mapbox in place of the static
location cards in `pages/Locations.tsx`.

## Testing

`npm run test` runs Vitest unit tests covering the business logic that
matters most: pricing (discount tiers, fees, taxes), date validation,
cancellation/refund rules, car search filtering + sorting, availability/double-
booking protection, booking creation, and form validation schemas.
