import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeItem, updateQuantity, getTotalPrice, checkoutWhatsApp } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="font-skylight text-2xl">Tu Carrito</h2>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Tu carrito está vacío</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-[10px] font-bold uppercase underline tracking-widest"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[12px] font-bold uppercase truncate pr-4">{item.product.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                        Talle: {item.selectedSize} US | {item.selectedColor}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-100 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 px-2 hover:bg-gray-50 text-gray-400"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[11px] font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 px-2 hover:bg-gray-50 text-gray-400"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-[13px] font-bold">
                          ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subtotal</p>
                  <p className="text-2xl font-black">${getTotalPrice().toLocaleString('es-AR')}</p>
                </div>
                <p className="text-[10px] text-gray-400 text-center">Envío gratis incluido en tu compra</p>
                <button 
                  onClick={checkoutWhatsApp}
                  className="w-full bg-black text-white h-16 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-90 transition-opacity"
                >
                  Pagar por WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
