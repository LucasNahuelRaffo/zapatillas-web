import { motion } from 'framer-motion';
import { Phone as WhatsApp } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/5491112345678"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl z-50 group shadow-green-200"
    >
      <WhatsApp size={32} fill="white" />
      <span className="absolute right-full mr-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ¿Necesitás ayuda?
      </span>
    </motion.a>
  );
}
