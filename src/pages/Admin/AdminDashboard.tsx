import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, LogOut, Package, Check, X, Link as LinkIcon, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Product } from '../../data/products'
import {
  getLocalProducts,
  addLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
} from '../../lib/productStore'

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

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(emptyProduct())
  const [newImageUrl, setNewImageUrl] = useState('')

  // Cargar productos desde localStorage al hacer login
  useEffect(() => {
    if (isLoggedIn) setProducts(getLocalProducts())
  }, [isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setIsLoggedIn(true)
    else alert('Contraseña incorrecta')
  }

  const openNew = () => {
    setCurrentProduct(emptyProduct())
    setNewImageUrl('')
    setIsEditing(true)
  }

  const openEdit = (p: Product) => {
    setCurrentProduct({ ...p })
    setNewImageUrl('')
    setIsEditing(true)
  }

  const handleDelete = (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    deleteLocalProduct(id)
    setProducts(getLocalProducts())
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if ((currentProduct.images?.length ?? 0) === 0) {
      alert('Agregá al menos una imagen (URL).')
      return
    }
    if (currentProduct.id) {
      updateLocalProduct(currentProduct as Product)
    } else {
      addLocalProduct(currentProduct as Omit<Product, 'id'>)
    }
    setProducts(getLocalProducts())
    setIsEditing(false)
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
          <h2 className="text-2xl font-black text-center uppercase tracking-tight mb-2">Panel de Control</h2>
          <p className="text-center text-gray-500 text-[11px] uppercase tracking-widest mb-8">Acceso Restringido</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 h-14 px-6 text-[13px] font-medium tracking-wide focus:outline-none focus:border-black transition-colors rounded-sm"
            />
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
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tight">Admin <span className="text-gray-400">/</span> Za-pass</h1>
          <div className="flex items-center gap-6">
            <Link to="/shop" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all">
              <ShoppingBag size={18} /> Ver Tienda
            </Link>
            <button
              onClick={openNew}
              className="bg-black text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gray-800 transition-colors rounded-sm shadow-lg shadow-black/5"
            >
              <Plus size={16} /> Nuevo Producto
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="p-3 text-gray-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Product Table */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {products.length === 0 ? (
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

                {/* Imágenes por URL */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Imágenes (URL)</label>

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

                  {/* URL input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
                        className="w-full bg-gray-50 border border-gray-200 h-12 pl-10 pr-4 text-[13px] focus:outline-none focus:border-black transition-colors rounded-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="bg-black text-white px-4 h-12 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Agregar
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2">Pegá la URL de la foto (Google Drive, Cloudinary, Unsplash, etc.)</p>
                </div>

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
    </div>
  )
}
