import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Effect to handle scroll state for navbar border/shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Shop', href: '#productos' },
    { name: 'About', href: '#calidad' },
  ]

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled ? 'bg-[#f9f9f9]/90 backdrop-blur-xl border-black/5 shadow-sm' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div 
            animate={{ height: scrolled ? 60 : 120 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center justify-between"
          >
            
            {/* Logo */}
            <motion.a 
              href="#" 
              animate={{ scale: scrolled ? 0.85 : 1, y: scrolled ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 text-2xl font-black tracking-tighter uppercase transition-opacity hover:opacity-70 z-50 relative origin-left"
            >
              Za-pass
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-14 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="group relative text-[11px] font-bold tracking-[0.2em] uppercase text-black"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 ease-out group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6 z-50 relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-black hover:opacity-60 transition-opacity" 
                aria-label="Buscar"
              >
                <Search size={20} strokeWidth={2} />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative text-black hover:opacity-60 transition-opacity" 
                aria-label="Carrito"
              >
                <ShoppingBag size={20} strokeWidth={2} />
                <span className="absolute -top-1.5 -right-2 text-[9px] font-bold bg-black text-white w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </motion.button>
              
              {/* Mobile toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden ml-1 text-black"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menú"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                      <X size={24} strokeWidth={1.5} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                      <Menu size={24} strokeWidth={1.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Slide-over */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 p-8 shadow-2xl md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-8 mt-20">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  className="text-4xl font-black tracking-tighter uppercase border-b border-gray-100 pb-4 flex justify-between items-center group"
                >
                  {link.name}
                  <span className="text-gray-300 group-hover:text-black transition-colors transform group-hover:translate-x-2">→</span>
                </motion.a>
              ))}
              
              {/* Additional Mobile Elements */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 space-y-4"
              >
                <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Contacto</div>
                <a href="#" className="block text-sm font-medium">soporte@zapass.com</a>
                <a href="#" className="block text-sm font-medium">WhatsApp: +54 9 11 1234 5678</a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
