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

interface ProductAccordionsProps {
  description?: string;
}

export default function ProductAccordions({ description }: ProductAccordionsProps) {
  return (
    <div className="mt-12 border-y border-gray-100">
      {description && (
        <AccordionItem title="Descripción">
          {description}
        </AccordionItem>
      )}
      <AccordionItem title="Calidad Premium">
        Nuestros productos cumplen con los más altos estándares de calidad. 
        Utilizamos materiales seleccionados (cuero genuino, gamuza, tecnología de amortiguación) 
        y garantizamos una fidelidad excepcional en cada detalle, costura y terminación. Es la opción ideal para quienes buscan 
        máxima comodidad y el mejor estilo en calzado importado.
      </AccordionItem>
      <AccordionItem title="Envíos y Garantía">
        Ofrecemos envío gratuito a todo el país. Para CABA y GBA, contamos con entrega en 24hs si compras antes de las 14:00. 
        Todos nuestros productos cuentan con garantía por falla de fabricación. Tenés 5 días hábiles para solicitar cambios
        de talle o devoluciones, siempre que las zapatillas se encuentren sin uso y en su caja original.
      </AccordionItem>
      <AccordionItem title="Detalles del Producto">
        <ul className="list-disc pl-5 space-y-1">
          <li>Capellada de cuero premium.</li>
          <li>Logotipo Wings en el talón.</li>
          <li>Logotipo Nike Air en la lengüeta.</li>
          <li>Puntera perforada para mayor transpirabilidad.</li>
          <li>Suela de goma para una tracción duradera.</li>
          <li>Logos y etiquetas de autenticidad.</li>
        </ul>
      </AccordionItem>
    </div>
  );
}
