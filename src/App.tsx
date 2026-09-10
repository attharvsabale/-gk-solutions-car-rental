import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GuestRoute } from '@/routes/GuestRoute'
import { PageLoader } from '@/components/ui/PageLoader'

const Home = lazy(() => import('@/pages/Home'))
const Cars = lazy(() => import('@/pages/Cars'))
const CarDetail = lazy(() => import('@/pages/CarDetail'))
const Locations = lazy(() => import('@/pages/Locations'))
const About = lazy(() => import('@/pages/About'))
const Faq = lazy(() => import('@/pages/Faq'))
const Contact = lazy(() => import('@/pages/Contact'))
const Deals = lazy(() => import('@/pages/Deals'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))

const BookingLayout = lazy(() => import('@/pages/booking/BookingLayout'))
const RentalDetails = lazy(() => import('@/pages/booking/RentalDetails'))
const Extras = lazy(() => import('@/pages/booking/Extras'))
const Customer = lazy(() => import('@/pages/booking/Customer'))
const Review = lazy(() => import('@/pages/booking/Review'))
const Payment = lazy(() => import('@/pages/booking/Payment'))
const Success = lazy(() => import('@/pages/booking/Success'))

const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'))
const AccountDashboard = lazy(() => import('@/pages/account/AccountDashboard'))
const AccountBookings = lazy(() => import('@/pages/account/AccountBookings'))
const AccountBookingDetail = lazy(() => import('@/pages/account/AccountBookingDetail'))
const AccountProfile = lazy(() => import('@/pages/account/AccountProfile'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cars" element={<Cars />} />
          <Route path="cars/:carId" element={<CarDetail />} />
          <Route path="locations" element={<Locations />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route path="deals" element={<Deals />} />

          <Route element={<GuestRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="booking/success/:bookingId" element={<Success />} />

          <Route path="booking" element={<BookingLayout />}>
            <Route index element={<RentalDetails />} />
            <Route path="extras" element={<Extras />} />
            <Route path="customer" element={<Customer />} />
            <Route path="review" element={<Review />} />
            <Route path="payment" element={<Payment />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<AccountDashboard />} />
              <Route path="bookings" element={<AccountBookings />} />
              <Route path="bookings/:bookingId" element={<AccountBookingDetail />} />
              <Route path="profile" element={<AccountProfile />} />
            </Route>
          </Route>

          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
