import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import qualitySneaker from '../img/quality_sneaker.png'

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
    <span ref={ref} className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block origin-bottom"
          initial={{ y: "120%", opacity: 0, rotateX: -80, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" } : {}}
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
    <section id="calidad" className="bg-[#f9f9f9] py-24 lg:py-32 overflow-hidden">
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

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-12 text-balance overflow-hidden py-2 cursor-default">
              <AnimatedLetters text="¿Qué es la" delayOffset={0} />
              <br />
              <AnimatedLetters text="Calidad AAA?" delayOffset={0.3} className="text-gray-300" />
            </h2>

            <div className="space-y-6 text-[15px] lg:text-[16px] text-gray-500 leading-relaxed max-w-md">
              <motion.p variants={fadeUpVariants}>
                No vendemos réplicas convencionales. La categoría AAA exige precisión milimétrica en cada
                milímetro cuadrado del calzado deportivo.
              </motion.p>
              <motion.p variants={fadeUpVariants}>
                Desde el termosellado de las cápsulas de aire hasta la densidad de la espuma en la mediasuela,
                utilizamos los mismos proveedores y materiales brutos para asegurar que el peso y la pisada sean idénticos.
              </motion.p>
            </div>

            <div className="flex gap-14 mt-12 pt-12 border-t border-gray-200">
              <motion.div variants={fadeUpVariants}>
                <p className="text-5xl font-black tracking-tighter mb-1 flex items-baseline">
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
                <p className="text-5xl font-black tracking-tighter mb-1 overflow-hidden">
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
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotateZ: [0, 2, 0],
                rotateY: [0, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-[90%] lg:w-full max-w-[700px] cursor-pointer"
            >
              <img
                src={qualitySneaker}
                alt="AAA Quality Detail"
                className="w-full mix-blend-multiply drop-shadow-2xl saturate-[0.8] rounded-3xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
