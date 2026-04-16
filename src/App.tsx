import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Home sections
import Hero from './components/Hero'
import PromoStrip from './components/PromoStrip'
import QualitySection from './components/QualitySection'
import InfoSection from './components/InfoSection'
import ProductCarousel from './components/ProductCarousel'
import Newsletter from './components/Newsletter'

// Pages
import Shop from './pages/Shop'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import WhatsAppButton from './components/Common/WhatsAppButton'

function HomePage() {
  return (
    <main>
      <Hero />
      <PromoStrip />
      <QualitySection />
      <InfoSection />
      <ProductCarousel />
      <Newsletter />
    </main>
  )
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <Footer />}
    </div>
  )
}
