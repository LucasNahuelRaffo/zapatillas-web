import { useEffect, useRef, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Lenis from 'lenis'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop({ lenisRef }: { lenisRef: React.MutableRefObject<Lenis | null> }) {
  const { pathname } = useLocation()

  useEffect(() => {
    // Lenis intercepta el scroll, así que window.scrollTo no alcanza:
    // hay que pedirle a Lenis que salte al tope de forma instantánea.
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, lenisRef])

  return null
}

import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Home sections (Hero stays synchronous for fastest initial LCP)
import Hero from './components/Hero'

const ReelSection = lazy(() => import('./components/ReelSection'))
const QualitySection = lazy(() => import('./components/QualitySection'))
const InfoSection = lazy(() => import('./components/InfoSection'))
const ProductCarousel = lazy(() => import('./components/ProductCarousel'))
const Newsletter = lazy(() => import('./components/Newsletter'))
import WhatsAppButton from './components/Common/WhatsAppButton'

// Pages - Lazy loaded for performance
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))

function HomePage() {
  return (
    <main className="font-skylight">
      <Helmet>
        <title>Za-pass | Sneakers Premium AAA+ | Envío Gratis Argentina</title>
        <meta name="description" content="Redefiniendo el estándar de las zapatillas premium. Calidad AAA+ con materiales originales, envío gratis a todo el país y garantía extendida." />
      </Helmet>
      <Hero />
      <Suspense fallback={<div className="w-full h-[50vh]" />}>
        <ReelSection />
        <InfoSection />
        <QualitySection />
        <ProductCarousel />
        <Newsletter />
      </Suspense>
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
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isAdmin) {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic out para fluidez total
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      infinite: false,
    })
    lenisRef.current = lenis

    // Synchronize Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      if (lenisRef.current) {
        lenis.raf(time * 1000)
      }
    }
    gsap.ticker.add(tick)

    gsap.ticker.lagSmoothing(500, 33)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isAdmin])

  return (
    <div className="min-h-screen">
      <ScrollToTop lenisRef={lenisRef} />
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
      
      {(location.pathname === '/' || location.pathname === '/shop') && <WhatsAppButton />}
      {!isAdmin && <Footer />}
    </div>
  )
}

