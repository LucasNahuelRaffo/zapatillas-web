import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PromoStrip from './components/PromoStrip'
import QualitySection from './components/QualitySection'
import InfoSection from './components/InfoSection'
import VideoSection from './components/VideoSection'
import ProductCarousel from './components/ProductCarousel'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <PromoStrip />
        <QualitySection />
        <InfoSection />
        <VideoSection />
        <ProductCarousel />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
