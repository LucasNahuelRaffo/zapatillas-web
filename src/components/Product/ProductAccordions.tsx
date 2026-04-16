import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between group"
      >
        <span className="text-[12px] font-bold uppercase tracking-widest text-black group-hover:opacity-60 transition-opacity">
          {title}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm text-gray-500 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductAccordions() {
  return (
    <div className="mt-12 border-y border-gray-100">
      <AccordionItem title="¿Qué es Calidad AAA?">
        Se denomina Calidad AAA a la máxima categoría en réplicas de calzado. 
        Utilizan los mismos materiales que los modelos originales (cuero genuino, gamuza, tecnología de amortiguación) 
        y mantienen una fidelidad del 99% en costuras, peso y etiquetas. Es la opción ideal para quienes buscan 
        la estética y comodidad de un par de alta gama sin pagar el sobrecosto de reventa.
      </AccordionItem>
      <AccordionItem title="Envíos y Garantía">
        Ofrecemos envío gratuito a todo el país. Para CABA y GBA, contamos con entrega en 24hs si compras antes de las 14:00. 
        Todos nuestros productos cuentan con garantía por falla de fabricación. Tenés 10 días para solicitar cambios 
        de talle o devoluciones, siempre que el producto se encuentre sin uso y en su caja original.
      </AccordionItem>
      <AccordionItem title="Detalles del Producto">
        <ul className="list-disc pl-5 space-y-1">
          <li>Capellada de cuero premium.</li>
          <li>Logotipo Wings en el talón.</li>
          <li>Logotipo Nike Air en la lengüeta.</li>
          <li>Puntera perforada para mayor transpirabilidad.</li>
          <li>Suela de goma para una tracción duradera.</li>
        </ul>
      </AccordionItem>
    </div>
  );
}
