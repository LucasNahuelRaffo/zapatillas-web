import { Truck, Camera, ShieldCheck, Info, ChevronDown } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function InfoSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null)

  useGSAP(() => {
    gsap.fromTo('.size-row', 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.size-table', start: 'top 85%' }
      }
    )

    gsap.fromTo('.logistics-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.logistics-container', start: 'top 85%' }
      }
    )
    
    gsap.fromTo('.section-title',
      { opacity: 0, filter: 'blur(5px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.2,
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
      }
    )
  }, { scope: containerRef })

  const sizes = [
    { arg: '25.5', eur: '40', us: '7.5', cm: '25.5' },
    { arg: '26', eur: '41', us: '8', cm: '26.0' },
    { arg: '26.5', eur: '42', us: '8.5', cm: '26.5' },
    { arg: '27.5', eur: '43', us: '9.5', cm: '27.5' },
    { arg: '28', eur: '44', us: '10', cm: '28.0' },
  ]

  const metrics = [
    {
      icon: <Truck className="w-5 h-5 text-white" strokeWidth={2} />,
      label: 'ENVÍOS NACIONALES',
      data: 'Andreani Express',
      sub: 'Despacho en 24hs hábiles',
      description: 'Todos nuestros envíos se despachan a través de la red prioritaria de Andreani, garantizando una entrega rápida, segura y con seguimiento en tiempo real directo hasta tu casa.'
    },
    {
      icon: <Camera className="w-5 h-5 text-white" strokeWidth={2} />,
      label: 'CONTROL DE CALIDAD',
      data: 'QC Photos',
      sub: 'Fotos previas al despacho',
      description: 'Antes de empaquetar el pedido, le tomamos fotografías en alta resolución para que verifiques todos los detalles y la calidad AAA+ del par específico que vas a recibir.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2} />,
      label: 'GARANTÍA EXTENDIDA',
      data: '30 Días',
      sub: 'Cambios por talle sin cargo',
      description: 'Tu tranquilidad es nuestra prioridad. Si el talle no te convence, tenés 30 días para solicitar un cambio directo sin hacerte preguntas y sin costos ocultos.'
    }
  ]

  const toggleCard = (index: number) => {
    setOpenCardIndex(openCardIndex === index ? null : index)
  }

  return (
    <section ref={containerRef} className="bg-[#fafafa] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-14">
          
          {/* Left Column - Size Guide Table */}
          <div className="lg:col-span-7 flex flex-col">
            <h3 className="section-title text-[15px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-800">
              GUÍA DE TALLES
            </h3>
            
            <div className="size-table w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              {/* Header */}
              <div className="grid grid-cols-4 bg-[#1a1a1a] text-white py-4 sm:py-5">
                {['ARG', 'EUR', 'US', 'CM'].map(head => (
                  <div key={head} className="text-[12px] sm:text-[13px] font-bold tracking-widest uppercase text-center">{head}</div>
                ))}
              </div>
              
              {/* Rows */}
              <div className="flex flex-col">
                {sizes.map((size, i) => (
                  <div key={i} className={`size-row grid grid-cols-4 py-4 sm:py-5 text-center items-center ${i % 2 === 1 ? 'bg-[#f4f4f4]' : 'bg-white'}`}>
                    <div className="text-[13px] sm:text-[14px] font-medium text-gray-800">{size.arg}</div>
                    <div className="text-[13px] sm:text-[14px] font-medium text-gray-800">{size.eur}</div>
                    <div className="text-[13px] sm:text-[14px] font-medium text-gray-800">{size.us}</div>
                    <div className="text-[13px] sm:text-[14px] font-medium text-gray-800">{size.cm}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Logistics & Warranty Cards */}
          <div className="lg:col-span-5 flex flex-col">
            <h3 className="section-title text-[15px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-800">
              LOGÍSTICA & GARANTÍA
            </h3>

            <div className="logistics-container flex flex-col gap-5">
              {metrics.map((item, i) => {
                const isOpen = openCardIndex === i;

                return (
                <div 
                  key={i} 
                  onClick={() => toggleCard(i)}
                  className="logistics-card flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-shadow duration-300 hover:shadow-md cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    {/* Icon Box */}
                    <div className="w-14 h-14 min-w-[56px] bg-[#1a1a1a] rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      {item.icon}
                    </div>
                    
                    {/* Text Details */}
                    <div className="flex flex-col flex-1">
                      <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">
                        {item.label}
                      </span>
                      <h4 className="text-[22px] font-black tracking-tight text-gray-900 leading-none mb-1">
                        {item.data}
                      </h4>
                      <p className="text-[12px] text-gray-500 font-medium">
                        {item.sub}
                      </p>
                    </div>

                    {/* Chevron Icon */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 group-hover:text-black transition-colors"
                    >
                      <ChevronDown className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* Expandable Description */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-[13px] text-gray-600 leading-[1.6] pt-4 mt-2 border-t border-gray-100">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )})}
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer Banner */}
        <div className="mt-16 bg-[#efefef] rounded-md px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Info className="w-4 h-4 text-gray-500 min-w-[16px] relative top-[2px] sm:top-0" />
          <p className="text-[12px] text-gray-500 font-medium">
            * Recomendamos medir la plantilla de tu zapatilla más cómoda y comparar con la tabla para mayor precisión.
          </p>
        </div>

      </div>
    </section>
  )
}
