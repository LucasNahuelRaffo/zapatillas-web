import { useEffect, Suspense, lazy } from 'react'
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

// Home sections (we'll keep HomePage components synchronous for fast initial paint, except heavy ones if we want)
import Hero from './components/Hero'
import PromoStrip from './components/PromoStrip'
import QualitySection from './components/QualitySection'
import InfoSection from './components/InfoSection'
import ProductCarousel from './components/ProductCarousel'
import Newsletter from './components/Newsletter'
import WhatsAppButton from './components/Common/WhatsAppButton'

// Pages - Lazy loaded for performance
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))

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

// Minimal Loading screen for route suspense
function PageLoader() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#f9f9f9]">
      <div className="text-black font-skylight text-4xl animate-pulse">Cargando...</div>
    </div>
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
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
      
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <Footer />}
    </div>
  )
}
