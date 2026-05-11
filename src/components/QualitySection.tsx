import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { lazy, Suspense } from 'react'
import qualitySneaker from '../img/quality_sneaker.png'

const SneakerCanvas = lazy(() => import('./SneakerCanvas'))

// Componente para animar números progresivamente
function AnimatedNumber({ value }: { value: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, Math.round)

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, { duration: 1.5 })
      return controls.stop
    }
  }, [motionValue, isInView, value])

  return <motion.span ref={nodeRef}>{rounded}</motion.span>
}

// Componente para animar cada letra individualmente con efecto 3D y blur
const AnimatedLetters = ({ text, delayOffset = 0, className = "" }: { text: string, delayOffset?: number, className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <span ref={ref} className={`inline-block px-1 ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block origin-bottom"
          initial={{ y: "120%", opacity: 0, rotateX: -80 }}
          animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
          transition={{ duration: 0.7, delay: delayOffset + index * 0.025 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function QualitySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1 } }
  }


  return (
    <section id="calidad" className="bg-[#f9f9f9] py-10 lg:py-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <motion.span variants={fadeUpVariants} className="block text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 mb-5">
              Materiales & Confección
            </motion.span>

            <h2 className="font-skylight text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-6 text-balance py-4 cursor-default">
              <AnimatedLetters text="¿Qué es la" delayOffset={0} />
              <br />
              <AnimatedLetters text="Calidad Premium?" delayOffset={0.3} className="text-gray-300" />
            </h2>

            <div className="space-y-6 text-[15px] lg:text-[16px] text-gray-500 leading-relaxed max-w-md">
              <motion.p variants={fadeUpVariants}>
                Nuestros productos son seleccionados cuidadosamente. La categoría Premium exige precisión milimétrica en cada
                detalle del calzado.
              </motion.p>
              <motion.p variants={fadeUpVariants}>
                Desde el termosellado de las cápsulas de aire hasta la densidad de la espuma en la mediasuela,
                aseguramos que los materiales y la construcción ofrezcan una experiencia superior.
              </motion.p>
            </div>

            <div className="flex gap-14 mt-12 pt-12 border-t border-gray-200">
              <motion.div variants={fadeUpVariants}>
                <p className="text-4xl font-black tracking-tighter mb-1 flex items-baseline">
                  <AnimatedNumber value={99} />
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6, type: 'spring' }}
                    className="text-3xl text-gray-400 ml-1"
                  >
                    %
                  </motion.span>
                </p>
                <p className="text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase mt-2">
                  Fidelidad Visual
                </p>
              </motion.div>

              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: 64 }} /* h-16 = 64px */
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                className="w-px bg-gray-300 relative top-2"
              />

              <motion.div variants={fadeUpVariants}>
                <p className="text-4xl font-black tracking-tighter mb-1 overflow-hidden">
                  <AnimatedLetters text="1:1" delayOffset={0.5} />
                </p>
                <p className="text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase mt-2">
                  Escala Física & Peso
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image - 3D Falling Effect */}
          <motion.div
            initial={{ opacity: 0, y: -200, rotate: -15, scale: 0.8, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
            className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end perspective-[2000px]"
          >
            <div
              className="relative w-full h-[400px] lg:h-[600px] flex flex-col justify-center items-center"
            >
              <div className="w-full h-full absolute inset-0 z-0">
                <Suspense fallback={
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="text-black font-skylight text-2xl animate-pulse">Cargando 3D...</div>
                  </div>
                }>
                  <SneakerCanvas />
                </Suspense>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
