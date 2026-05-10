import { motion } from 'framer-motion'

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-black py-2 px-4 flex justify-center items-center overflow-hidden"
    >
      <p className="text-white text-[11px] font-semibold tracking-[0.15em] uppercase">
        Envío gratis a todo el país. Olvidate, te llega al toque.
      </p>
    </motion.div>
  )
}
