import { useState } from 'react';
import { ArrowRight, ShoppingCart, Truck, Check } from 'lucide-react';
import { Product } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductSelectorsProps {
  product: Product;
  onColorChange?: (colorName: string) => void;
  selectedColor?: string;
}

export default function ProductSelectors({ product, onColorChange, selectedColor }: ProductSelectorsProps) {
  const { colors, sizes } = product;
  const { addItem } = useCart();
  
  const [selectedSize, setSelectedSize] = useState(sizes.find(s => s.stock)?.size);

  const handleColorClick = (colorName: string) => {
    if (onColorChange) onColorChange(colorName);
  };
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    setIsAdding(true);
    addItem(product, selectedSize, selectedColor);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  return (
    <div className="space-y-10">
      {/* Colors */}
      <div>
        <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Color</h3>
        <div className="flex gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color.name)}
              title={color.name}
              className={`w-5 h-5 rounded-full transition-all flex items-center justify-center shadow-sm ${
                selectedColor === color.name ? 'ring-2 ring-black ring-offset-2 scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Talle (US)</h3>
          <button className="text-[10px] font-bold underline uppercase tracking-widest hover:opacity-60">
            Guía de Talles
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((s) => (
            <button
              key={s.size}
              disabled={!s.stock}
              onClick={() => setSelectedSize(s.size)}
              className={`h-16 flex flex-col items-center justify-center border transition-all relative overflow-hidden ${
                !s.stock 
                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' 
                  : selectedSize === s.size 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-gray-200 hover:border-black'
              }`}
            >
              {!s.stock && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-[120%] h-[1px] bg-black rotate-[40deg]" />
                </div>
              )}
              <span className="text-[14px] font-black">{s.size}</span>
              <span className="text-[9px] font-bold opacity-50">US</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart */}
      <div>
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full h-16 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300 ${
            isAdding ? 'bg-green-600 text-white' : 'bg-[#111] text-white hover:bg-black'
          }`}
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                ¡Agregado! <Check size={18} />
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                Agregar al carrito <ArrowRight size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Shipping Info */}
      <div className="bg-[#f9f9f9] p-6 rounded-sm border border-black/5 flex items-start gap-4">
        <div className="bg-white p-2 rounded shadow-sm">
          <Truck size={20} className="text-black" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Envío Gratis</p>
          <p className="text-[12px] text-gray-500 leading-tight">
            ¿Sos de CABA o GBA? Si compras ahora lo recibís <span className="font-bold text-red-600 uppercase">Mañana</span>
          </p>
        </div>
      </div>
    </div>
  );
}
