import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, LogOut, Package, Check, X, Link as LinkIcon, ShoppingBag, LayoutGrid, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Product } from '../../data/products'
import {
  getLocalProducts,
  addLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
} from '../../lib/productStore'
import { supabase } from '../../lib/supabase'

// Sincroniza un producto con stock_zapatillas: borra filas viejas y re-inserta
async function syncStockZapatillas(product: Partial<Product>, oldName?: string) {
  const modeloToDelete = oldName ?? product.name
  if (!modeloToDelete) return

  // 1. Eliminar filas existentes del modelo
  await supabase.from('stock_zapatillas').delete().eq('modelo', modeloToDelete)

  if (!product.name || !product.colors?.length || !product.sizes?.length) return

  // 2. Insertar una fila por cada combinación color × talle
  const rows = product.colors.flatMap(color =>
    product.sizes!
      .filter(s => s.stock)
      .map(s => ({
        modelo: product.name!,
        color: color.name,
        talle: s.size,
        precio: product.price ?? 120000,
        stock: 5,
      }))
  )

  if (rows.length > 0) {
    await supabase.from('stock_zapatillas').insert(rows)
  }
}

async function removeStockZapatillas(productName: string) {
  await supabase.from('stock_zapatillas').delete().eq('modelo', productName)
}

const ADMIN_PASSWORD = 'zapas2024'

const BRANDS = ['Adidas', 'Nike', 'Jordan', 'Travis Scott', 'Puma', 'Topper', 'John Foos',
  'Vicus', 'Jaguar', 'Kioshi', 'Vans', 'Converse', 'Fila', 'DC Shoes', 'New Balance',
  'Asics', 'Salomon', 'Olympikus', 'Under Armour', 'Skechers', 'Reebok', 'On']

const COLORS_LIST = [
  { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' }, { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' }, { name: 'Gray', hex: '#808080' },
  { name: 'Brown', hex: '#8B4513' }, { name: 'Beige', hex: '#F5F5DC' },
]

const ALL_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45']

function emptyProduct(): Omit<Product, 'id'> {
  return {
    brand: '', name: '', price: 0, subtitle: '', description: '',
    images: [], sizes: [], colors: [], category: '',
  }
}

export interface Reserva {
  id: number;
  reserva_id?: string;
  telefono?: string;
  nombre?: string;
  modelo: string;
  talle: string;
  fecha_entrega?: string;
  hora_entrega?: string;
  punto_encuentro?: string;
  metodo_pago?: string;
  total?: number;
  estado?: string;
  fecha_reserva?: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(emptyProduct())
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newColorImageUrls, setNewColorImageUrls] = useState<Record<string, string>>({})
  const [imageMode, setImageMode] = useState<'general' | 'color'>('general')

  // Estados del Calendario / Solicitudes
  const [activeTab, setActiveTab] = useState<'productos' | 'solicitudes'>('productos')
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loadingReservas, setLoadingReservas] = useState(false)

  // Cargar productos desde localStorage al hacer login
  useEffect(() => {
    if (isLoggedIn) setProducts(getLocalProducts())
  }, [isLoggedIn])

  // Cargar reservas
  useEffect(() => {
    if (isLoggedIn && activeTab === 'solicitudes') {
      const fetchReservas = async () => {
        setLoadingReservas(true)
        const { data, error } = await supabase.from('reservas_zapatillas').select('*').order('fecha_reserva', { ascending: false })
        if (error) {
          console.error("Error al cargar reservas:", error)
        }
        if (data) {
          console.log("Reservas cargadas:", data)
          setReservas(data as Reserva[])
        }
        setLoadingReservas(false)
      }
      fetchReservas()
    }
  }, [isLoggedIn, activeTab])

  const getProductImage = (modelo: string) => {
    if (!modelo) return null;
    const prod = products.find(p => modelo.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(modelo.toLowerCase()));
    return prod?.images?.[0] || null;
  }

  const getProductId = (modelo: string) => {
    if (!modelo) return null;
    const prod = products.find(p => modelo.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(modelo.toLowerCase()));
    return prod?.id || null;
  }

  // Lógica del Calendario
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const emptyDays = Array(firstDay).fill(null)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const isSameDay = (date1: string | Date, date2: Date) => {
    if (typeof date1 === 'string') {
      const datePart = date1.split('T')[0]
      const [year, month, day] = datePart.split('-').map(Number)
      return year === date2.getFullYear() &&
             month === date2.getMonth() + 1 &&
             day === date2.getDate()
    } else {
      return date1.getDate() === date2.getDate() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getFullYear() === date2.getFullYear()
    }
  }

  const getReservasForDate = (date: Date) => {
    return reservas.filter(r => {
      const targetDate = r.fecha_entrega || r.fecha_reserva || r.created_at
      if (!targetDate) return false
      return isSameDay(targetDate, date)
    })
  }

  const getReservasForDay = (day: number) => {
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return getReservasForDate(dateObj)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setLoginError(false)
      setIsLoggedIn(true)
    } else {
      setLoginError(true)
    }
  }

  const openNew = () => {
    setCurrentProduct(emptyProduct())
    setNewImageUrl('')
    setNewColorImageUrls({})
    setImageMode('general')
    setIsEditing(true)
  }

  const openEdit = (p: Product) => {
    setCurrentProduct({ ...p })
    setNewImageUrl('')
    setNewColorImageUrls({})
    setImageMode(p.colors?.some(c => c.images?.length > 0) ? 'color' : 'general')
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    const product = products.find(p => p.id === id)
    deleteLocalProduct(id)
    setProducts(getLocalProducts())
    if (product) await removeStockZapatillas(product.name)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((currentProduct.images?.length ?? 0) === 0) {
      alert('Agregá al menos una imagen (URL).')
      return
    }
    // Guardar el nombre original antes de editar (por si cambió)
    const originalName = currentProduct.id
      ? products.find(p => p.id === currentProduct.id)?.name
      : undefined

    if (currentProduct.id) {
      updateLocalProduct(currentProduct as Product)
    } else {
      addLocalProduct(currentProduct as Omit<Product, 'id'>)
    }
    setProducts(getLocalProducts())
    setIsEditing(false)

    // Sincronizar con Supabase stock_zapatillas
    await syncStockZapatillas(currentProduct, originalName)
  }

  const addImageUrl = () => {
    const url = newImageUrl.trim()
    if (!url) return
    setCurrentProduct(prev => ({ ...prev, images: [...(prev.images || []), url] }))
    setNewImageUrl('')
  }

  const removeImage = (idx: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx),
    }))
  }

  const addColorImageUrl = (colorName: string) => {
    const url = (newColorImageUrls[colorName] || '').trim()
    if (!url) return
    setCurrentProduct(prev => ({
      ...prev,
      colors: (prev.colors || []).map(c => 
        c.name === colorName ? { ...c, images: [...(c.images || []), url] } : c
      ),
      images: prev.images?.includes(url) ? prev.images : [...(prev.images || []), url]
    }))
    setNewColorImageUrls(prev => ({ ...prev, [colorName]: '' }))
  }

  const handleColorFileChange = (colorName: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        setCurrentProduct(prev => ({
          ...prev,
          colors: (prev.colors || []).map(c => 
            c.name === colorName ? { ...c, images: [...(c.images || []), result] } : c
          ),
          images: prev.images?.includes(result) ? prev.images : [...(prev.images || []), result]
        }))
      }
    };
    reader.readAsDataURL(file);
  }

  const removeColorImage = (colorName: string, idx: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      colors: (prev.colors || []).map(c => 
        c.name === colorName ? { ...c, images: (c.images || []).filter((_, i) => i !== idx) } : c
      )
    }))
  }

  const toggleSize = (size: string) => {
    const sizes = currentProduct.sizes || []
    const has = sizes.some(s => s.size === size)
    setCurrentProduct(prev => ({
      ...prev,
      sizes: has ? sizes.filter(s => s.size !== size) : [...sizes, { size, stock: true }],
    }))
  }

  const toggleColor = (colorName: string, hex: string) => {
    const colors = currentProduct.colors || []
    const has = colors.some(c => c.name === colorName)
    setCurrentProduct(prev => ({
      ...prev,
      colors: has ? colors.filter(c => c.name !== colorName) : [...colors, { name: colorName, hex, images: [] }],
    }))
  }

  // ─── LOGIN SCREEN ────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-xl border border-black/5">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center">
              <Package size={32} />
            </div>
          </div>
          <h2 className="font-skylight text-4xl text-center mb-4">Panel de Control</h2>
          <p className="text-center text-gray-500 text-[11px] uppercase tracking-widest mb-8">Acceso Restringido</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(false) }}
                className={`w-full bg-gray-50 h-14 px-6 text-[13px] font-medium tracking-wide focus:outline-none transition-colors rounded-sm border ${
                  loginError
                    ? 'border-red-500 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 focus:border-black'
                }`}
              />
              {loginError && (
                <p className="mt-2 text-[12px] font-semibold text-red-500">Contraseña incorrecta</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white h-14 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors rounded-sm"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <header className="bg-white border-b border-black/5 py-6 px-6 lg:px-12 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto gap-8">
            <h1 className="font-skylight text-2xl text-black">Admin <span className="text-gray-400">/</span> Za-pass</h1>
            
            <div className="flex items-center bg-gray-100 p-1 rounded-sm">
              <button 
                onClick={() => setActiveTab('productos')} 
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2 ${activeTab === 'productos' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <LayoutGrid size={14}/> Productos
              </button>
              <button 
                onClick={() => setActiveTab('solicitudes')} 
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2 ${activeTab === 'solicitudes' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <Calendar size={14}/> Solicitudes
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
            <Link to="/shop" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all hidden sm:flex">
              <ShoppingBag size={18} /> Ver Tienda
            </Link>
            {activeTab === 'productos' && (
              <button
                onClick={openNew}
                className="bg-black text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gray-800 transition-colors rounded-sm shadow-lg shadow-black/5"
              >
                <Plus size={16} /> Nuevo
              </button>
            )}
            <button onClick={() => setIsLoggedIn(false)} className="p-3 text-gray-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {activeTab === 'productos' ? (
          products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Package size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm font-medium">No hay productos aún.</p>
            <button onClick={openNew} className="mt-4 text-[11px] font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity">
              Agregar el primero
            </button>
          </div>
        ) : (
          <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Producto</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categoría</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Precio</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={16} /></div>
                          }
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-black uppercase leading-tight">{p.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500">{p.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[14px] font-black text-black">${p.price.toLocaleString('es-AR')}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        ) : (
          <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"><ChevronLeft size={20}/></button>
                <button onClick={nextMonth} className="p-2 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"><ChevronRight size={20}/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="bg-gray-50 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {day}
                </div>
              ))}
              
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="bg-white min-h-[120px]" />
              ))}
              
              {daysArray.map(day => {
                const dayReservas = getReservasForDay(day)
                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const isToday = isSameDay(dateObj, new Date())
                const isSelected = selectedDate && isSameDay(dateObj, selectedDate)

                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDate(dateObj)}
                    className={`bg-white min-h-[120px] p-2 border-t border-transparent hover:border-black/10 transition-colors cursor-pointer relative group ${isSelected ? 'ring-2 ring-black ring-inset z-10' : ''}`}
                  >
                    <span className={`text-[12px] font-bold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-black text-white' : 'text-gray-500 group-hover:text-black'}`}>
                      {day}
                    </span>
                    
                    <div className="mt-2 flex flex-wrap gap-1 justify-center sm:justify-start">
                      {dayReservas.slice(0, 5).map((r, i) => {
                        const imgUrl = getProductImage(r.modelo);
                        return (
                          <div key={i} className="relative w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm overflow-hidden" title={`${r.modelo} - ${r.talle}`}>
                            {imgUrl ? (
                              <img src={imgUrl} alt={r.modelo} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={12} className="text-gray-400" />
                            )}
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${r.estado === 'confirmado' ? 'bg-green-500' : r.estado === 'cancelado' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                          </div>
                        )
                      })}
                      {dayReservas.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shadow-sm border border-gray-200">
                          +{dayReservas.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Edit / Create Slide-over */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex justify-start">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="w-full max-w-xl bg-white h-full relative z-10 shadow-2xl flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  {currentProduct.id ? 'Editar Producto' : 'Cargar Nuevo'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                {/* Marca + Modelo */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Marca</label>
                    <select
                      required
                      value={currentProduct.brand}
                      onChange={e => setCurrentProduct({ ...currentProduct, brand: e.target.value, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black appearance-none transition-colors rounded-sm"
                    >
                      <option value="">Seleccionar</option>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Modelo</label>
                    <input
                      type="text" required
                      value={currentProduct.name}
                      onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black transition-colors rounded-sm"
                      placeholder="Ej: Air Max 90"
                    />
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Precio ($ARS)</label>
                  <input
                    type="text" required
                    value={currentProduct.price ? currentProduct.price.toLocaleString('es-AR') : ''}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '')
                      setCurrentProduct({ ...currentProduct, price: val === '' ? 0 : parseInt(val, 10) })
                    }}
                    className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black transition-colors rounded-sm"
                    placeholder="150.000"
                  />
                </div>

                {/* Talles */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Talles Disponibles</label>
                  <div className="grid grid-cols-8 gap-2">
                    {ALL_SIZES.map(size => {
                      const selected = currentProduct.sizes?.some(s => s.size === size)
                      return (
                        <button
                          key={size} type="button"
                          onClick={() => toggleSize(size)}
                          className={`h-12 text-[12px] font-bold border transition-all rounded-sm ${selected ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Colores */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Colores</label>
                  <div className="flex flex-wrap gap-3">
                    {COLORS_LIST.map(c => {
                      const selected = currentProduct.colors?.some(col => col.name === c.name)
                      return (
                        <button
                          key={c.name} type="button"
                          onClick={() => toggleColor(c.name, c.hex)}
                          className={`relative flex flex-col items-center gap-1 p-2 rounded-sm border transition-all ${selected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'}`}
                        >
                          <div className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c.hex }} />
                          <span className={`text-[9px] font-bold uppercase ${selected ? 'text-black' : 'text-gray-400'}`}>{c.name}</span>
                          {selected && (
                            <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5">
                              <Check size={8} />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Descripción</label>
                  <textarea
                    value={currentProduct.description}
                    onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 p-5 text-[13px] font-medium focus:outline-none focus:border-black transition-colors rounded-sm resize-none"
                    placeholder="Detalles del producto..."
                  />
                </div>

                {/* Modalidad de Imágenes */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block border-t border-gray-100 pt-6">Modalidad de Imágenes</label>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setImageMode('general')}
                      className={`flex-1 py-3 border text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors ${imageMode === 'general' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                    >
                      Generales
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setImageMode('color')}
                      className={`flex-1 py-3 border text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors ${imageMode === 'color' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                    >
                      Por Color
                    </button>
                  </div>
                </div>

                {/* Imágenes Generales */}
                {imageMode === 'general' && (
                  <div className="mt-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Imágenes Generales</label>

                    {/* Previews */}
                    {(currentProduct.images?.length ?? 0) > 0 && (
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {currentProduct.images!.map((url, i) => (
                          <div key={i} className="aspect-square bg-gray-100 rounded-sm overflow-hidden relative group">
                            <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '')} />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inputs para imagen */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={e => setNewImageUrl(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
                          className="w-full bg-gray-50 border border-gray-200 h-12 pl-10 pr-4 text-[13px] focus:outline-none focus:border-black transition-colors rounded-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); addImageUrl(); }}
                        className="bg-black text-white px-4 h-12 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Plus size={14} /> URL
                      </button>
                      
                      <label className="bg-black text-white px-4 h-12 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0">
                        <Plus size={14} /> ARCHIVO
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setCurrentProduct(prev => ({ ...prev, images: [...(prev.images || []), ev.target!.result as string] }));
                              }
                            };
                            reader.readAsDataURL(file);
                            e.target.value = ''; // Reset input
                          }} 
                        />
                      </label>
                    </div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2">Pegá una URL o seleccioná un archivo desde tu computadora</p>
                  </div>
                )}

                {/* Imágenes por Color */}
                {imageMode === 'color' && (currentProduct.colors?.length ?? 0) === 0 && (
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-6 border border-dashed border-gray-200 p-4 text-center rounded-sm">
                    Seleccioná al menos un color arriba para poder asignarle imágenes específicas.
                  </p>
                )}
                {imageMode === 'color' && (currentProduct.colors?.length ?? 0) > 0 && (
                  <div className="mt-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Imágenes por Color</label>
                    <div className="space-y-6">
                      {currentProduct.colors!.map(color => (
                        <div key={color.name} className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                            <span className="text-[11px] font-bold uppercase text-black">{color.name}</span>
                          </div>
                          
                          {/* Previews del color */}
                          {(color.images?.length ?? 0) > 0 && (
                            <div className="grid grid-cols-4 gap-2 mb-3">
                              {color.images!.map((url, i) => (
                                <div key={i} className="aspect-square bg-white border border-gray-200 rounded-sm overflow-hidden relative group">
                                  <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '')} />
                                  <button
                                    type="button"
                                    onClick={() => removeColorImage(color.name, i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Inputs del color */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={newColorImageUrls[color.name] || ''}
                                onChange={e => setNewColorImageUrls(prev => ({ ...prev, [color.name]: e.target.value }))}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColorImageUrl(color.name) } }}
                                className="w-full bg-white border border-gray-200 h-10 pl-8 pr-3 text-[12px] focus:outline-none focus:border-black transition-colors rounded-sm"
                                placeholder="https://..."
                              />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); addColorImageUrl(color.name); }}
                              className="bg-black text-white px-3 h-10 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors shrink-0"
                            >
                              URL
                            </button>
                            <label className="bg-black text-white px-3 h-10 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center cursor-pointer shrink-0">
                              PC
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleColorFileChange(color.name, file);
                                  e.target.value = '';
                                }} 
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full bg-black text-white h-16 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 rounded-sm"
                  >
                    <Check size={18} /> {currentProduct.id ? 'Guardar Cambios' : 'Publicar Producto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selected Date Slide-over */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDate(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="w-full max-w-md bg-white h-full relative z-10 shadow-2xl flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Solicitudes</h2>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1">
                    {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </p>
                </div>
                <button onClick={() => setSelectedDate(null)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {getReservasForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-[11px] font-bold uppercase tracking-widest border border-dashed border-gray-200 rounded-sm">
                    No hay solicitudes este día
                  </div>
                ) : (
                  getReservasForDate(selectedDate).map(r => {
                    const prodId = getProductId(r.modelo);
                    const CardContent = (
                      <div className={`border border-gray-100 p-5 rounded-sm transition-all shadow-sm bg-white ${prodId ? 'hover:border-black/30 hover:shadow-md cursor-pointer' : 'hover:border-black/20'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${r.estado === 'confirmado' ? 'bg-green-100 text-green-700' : r.estado === 'cancelado' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {r.estado || 'pendiente'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-sm">
                            {r.hora_entrega || (r.fecha_reserva ? new Date(r.fecha_reserva).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3 relative">
                          <div className="w-12 h-12 rounded-sm bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {getProductImage(r.modelo) ? (
                              <img src={getProductImage(r.modelo)!} alt={r.modelo} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={16} className="text-gray-300" />
                            )}
                          </div>
                          <p className={`font-bold text-[13px] leading-tight text-black uppercase ${prodId ? 'group-hover:underline decoration-2 underline-offset-2' : ''}`}>{r.modelo}</p>
                        </div>
                        
                        <div className="flex flex-col gap-1 pt-2 border-t border-gray-50">
                          <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                            <span className="font-bold text-gray-800">Talle:</span> {r.talle}
                          </p>
                          {r.telefono && (
                            <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                              <span className="font-bold text-gray-800">WhatsApp:</span> {r.telefono}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-2">
                            ID: {r.reserva_id?.substring(0, 8) || r.id}
                          </p>
                        </div>
                      </div>
                    );

                    return prodId ? (
                      <Link key={r.id} to={`/product/${prodId}`} target="_blank" className="block group">
                        {CardContent}
                      </Link>
                    ) : (
                      <div key={r.id} className="block group">
                        {CardContent}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
