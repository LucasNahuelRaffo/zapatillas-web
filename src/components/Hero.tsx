import heroSneaker from '../img/hero_sneaker-removebg-preview.png'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f9f9f9]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 pb-20 lg:pt-10 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">

          {/* Left Content */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="animate-fade-up inline-flex text-[10px] font-bold tracking-[0.25em] uppercase text-black mb-6 px-3 py-1 bg-gray-200/50 rounded-sm">
              Triple A Premium
            </span>
            <h1 className="animate-fade-up delay-100 font-skylight text-6xl sm:text-7xl lg:text-8xl xl:text-[7.5rem] leading-[0.9] tracking-tight mb-8 text-balance">
              LAS MÁS<br />
              <span className="text-gray-300">CANCHERAS.</span>
            </h1>
            <p className="animate-fade-up delay-200 text-[15px] lg:text-[17px] text-gray-500 max-w-md mb-12 leading-[1.6] font-medium text-balance">
              Zapatillas de primera, precio de barrio. Calidad AAA que se nota a una cuadra, máquina.
            </p>

            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-5 w-full sm:w-auto overflow-hidden">
              <a
                href="#productos"
                className="btn-black inline-flex items-center justify-center gap-3 text-[13px] font-bold tracking-[0.15em] uppercase px-12 py-5 rounded-full"
              >
                Ver Catálogo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Image - Levitating 3D red sneaker */}
          <div className="order-1 lg:order-2 flex justify-center -mb-10 lg:mb-0 relative z-10 perspective-[2000px]">
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              className="relative w-[85%] sm:w-[500px] lg:w-[650px] drop-shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.img
                animate={{
                  y: [0, -20, 0],
                  rotateZ: [0, 1, 0],
                  rotateY: [0, -4, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                src={heroSneaker}
                alt="Za-pass Premium Sneaker"
                className="w-full mix-blend-multiply"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
