import { useState } from 'react'
import { motion } from 'framer-motion'

export default function PromoStrip() {
  const [isFlipped, setIsFlipped] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  }

  return (
    <section className="relative overflow-hidden bg-black text-white py-20 lg:py-32">
      {/* Background Glows (Difuminación) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.15] rounded-full blur-[120px] pointer-events-none" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 right-0 w-[800px] h-[800px] bg-white/[0.1] rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col items-start"
          >
            <motion.div variants={itemVariants} className="flex items-baseline gap-3 mb-2">
              <span className="text-8xl sm:text-[110px] lg:text-[130px] font-black tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">15%</span>
              <span className="text-6xl sm:text-[70px] lg:text-[80px] font-black tracking-tighter leading-none text-white/90">OFF</span>
            </motion.div>
            <motion.p variants={itemVariants} className="text-[17px] sm:text-[20px] lg:text-[24px] font-medium tracking-wide text-gray-400 uppercase mb-10">
              Pagando con transferencia bancaria
            </motion.p>
            <motion.div variants={itemVariants}>
              <a
                href="#"
                className="group relative inline-flex items-center justify-center border-2 border-white/80 text-white text-[12px] sm:text-[14px] font-bold tracking-[0.15em] uppercase px-8 py-4 overflow-hidden transition-all duration-300 hover:border-white"
              >
                {/* Botón con efecto shine en hover */}
                <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">Descuento Automático</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right - Modern 3D Flip Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end perspective-[1000px]"
          >
            <motion.div 
              className="w-full max-w-sm aspect-[1.586/1] relative cursor-pointer"
              onHoverStart={() => setIsFlipped(true)}
              onHoverEnd={() => setIsFlipped(false)}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              
              {/* === Front of Card === */}
              <div 
                className="absolute inset-0 rounded-2xl p-6 bg-[#0f1115] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] to-transparent pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/[0.03] rounded-full blur-[50px] pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-10 h-7 rounded bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] opacity-90 relative overflow-hidden shadow-sm">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-black/20" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20" />
                  </div>
                  <span className="text-[8px] font-bold tracking-[0.2em] text-gray-500 uppercase mt-1">Premium Bank</span>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="text-gray-300 text-xl font-mono mb-4 flex gap-4 tracking-widest">
                    <span>••••</span><span>••••</span><span>••••</span><span>4291</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[7px] text-gray-500 uppercase tracking-widest mb-0.5">Card Holder</div>
                      <div className="text-[10px] font-mono tracking-widest text-gray-300 uppercase">ZA-PASS MEMBER</div>
                    </div>
                    <div className="flex -space-x-2.5 opacity-60">
                      <div className="w-6 h-6 bg-white rounded-full mix-blend-overlay" />
                      <div className="w-6 h-6 bg-gray-400 rounded-full mix-blend-overlay" />
                    </div>
                  </div>
                </div>
              </div>

              {/* === Back of Card === */}
              <div 
                className="absolute inset-0 rounded-2xl bg-[#0f1115] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-full h-12 bg-black mt-6" />
                <div className="px-6 py-4 flex flex-col items-end">
                  <div className="w-full h-8 flex relative">
                    <div className="w-3/4 h-full bg-white max-w-[200px]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #f0f0f0 2px, #f0f0f0 4px)' }}></div>
                    <div className="h-full bg-gray-200 rounded-r flex items-center justify-center px-3 flex-1">
                      <span className="text-black font-mono text-sm block italic">123</span>
                    </div>
                  </div>
                  <p className="text-[6px] text-gray-500 mt-6 leading-relaxed tracking-wider text-right max-w-[85%]">
                    This card is property of Za-pass. If found, please return to any authorized Za-pass retailer. Valid only for exclusive drops. Use of this card constitutes acceptance of the terms and conditions.
                  </p>
                </div>
              </div>

            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
