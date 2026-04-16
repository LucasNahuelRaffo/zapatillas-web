import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, LogOut, Package, Image as ImageIcon, Check, X, Loader2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Product } from '../../data/products'

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({})
  const [uploading, setUploading] = useState(false)

  const ADMIN_PASSWORD = 'zapas2024'

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts()
    }
  }, [isLoggedIn])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) {
        alert('Error al eliminar: ' + error.message)
      } else {
        fetchProducts()
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const productToSave = { ...currentProduct }
    
    if (productToSave.id) {
      const { error } = await supabase
        .from('products')
        .update(productToSave)
        .eq('id', productToSave.id)
      if (error) alert(error.message)
    } else {
      // For new products, we need a unique ID. 
      // In a real DB we'd use serial, but here we'll just take max + 1
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
      const { error } = await supabase
        .from('products')
        .insert([{ ...productToSave, id: newId }])
      if (error) alert(error.message)
    }
    
    setIsEditing(false)
    fetchProducts()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      setCurrentProduct(prev => ({
        ...prev,
        images: [data.publicUrl, ...(prev.images || [])]
      }))

    } catch (error: any) {
      alert('Error subiendo imagen: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

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
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 h-14 px-6 text-[13px] font-medium tracking-wide focus:outline-none focus:border-black transition-colors rounded-sm"
              />
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

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Admin Header */}
      <header className="bg-white border-b border-black/5 py-6 px-6 lg:px-12 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black uppercase tracking-tight">Admin <span className="text-gray-400">/</span> Za-pass</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              to="/shop"
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all"
            >
              <ShoppingBag size={18} /> Ver Tienda
            </Link>
            
            <button 
              onClick={() => {
                setCurrentProduct({
                  brand: '',
                  name: '',
                  price: 0,
                  category: 'Adidas',
                  description: '',
                  images: [],
                  sizes: [],
                  colors: []
                })
                setIsEditing(true)
              }}
              className="bg-black text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gray-800 transition-colors rounded-sm shadow-lg shadow-black/5"
            >
              <Plus size={16} /> Nuevo Producto
            </button>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="p-3 text-gray-400 hover:text-red-500 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-gray-200 mb-4" />
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Cargando inventario...</p>
          </div>
        ) : (
          <div className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 italic">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Producto</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categoría</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Precio</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-black uppercase leading-tight">{p.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[14px] font-black text-black">${p.price.toLocaleString('es-AR')}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setCurrentProduct(p); setIsEditing(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar"
                        >
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

      {/* Edit Modal / Slide-over */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex justify-start">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="w-full max-w-xl bg-white h-full relative z-10 shadow-2xl flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {currentProduct.id ? 'Editar Producto' : 'Cargar Nuevo'}
              </h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Marca</label>
                  <select
                    value={currentProduct.brand}
                    onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black appearance-none transition-colors rounded-sm text-center"
                  >
                    <option value="">Seleccionar Marca</option>
                    {['Adidas', 'Nike', 'Jordan', 'Travis Scott', 'Puma', 'Topper', 'John Foos', 'Vicus', 'Jaguar', 'Kioshi', 'Vans', 'Converse', 'Fila', 'DC Shoes', 'New Balance', 'Asics', 'Salomon', 'Olympikus', 'Under Armour', 'Skechers', 'Reebok', 'On'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Modelo</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name}
                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black transition-colors rounded-sm text-center"
                    placeholder="Ej: Air Max 90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Precio ($)</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={currentProduct.price ? currentProduct.price.toLocaleString('es-AR') : ''}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setCurrentProduct({...currentProduct, price: val === '' ? 0 : parseInt(val, 10)});
                      }}
                      className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black transition-colors rounded-sm text-center"
                      placeholder="150.000"
                    />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Categoría</label>
                  <select
                    value={currentProduct.category}
                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 h-14 px-5 text-[13px] font-bold focus:outline-none focus:border-black appearance-none transition-colors rounded-sm text-center"
                  >
                    {['Adidas', 'Nike', 'Jordan', 'Travis Scott', 'Puma', 'Topper', 'John Foos', 'Vicus', 'Jaguar', 'Kioshi', 'Vans', 'Converse', 'Fila', 'DC Shoes', 'New Balance', 'Asics', 'Salomon', 'Olympikus', 'Under Armour', 'Skechers', 'Reebok', 'On'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Talles */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Talles Disponibles</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {['38', '39', '40', '41', '42', '43', '44', '45'].map(size => {
                    const isSelected = currentProduct.sizes?.some(s => s.size === size && s.stock);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          const newSizes = isSelected
                            ? currentProduct.sizes?.filter(s => s.size !== size)
                            : [...(currentProduct.sizes || []), { size, stock: true }];
                          setCurrentProduct({...currentProduct, sizes: newSizes});
                        }}
                        className={`h-12 text-[12px] font-bold border transition-all rounded-sm ${
                          isSelected ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-black hover:text-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colores */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Colores</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Black',  hex: '#000000' },
                    { name: 'White',  hex: '#FFFFFF' },
                    { name: 'Red',    hex: '#FF0000' },
                    { name: 'Blue',   hex: '#0000FF' },
                    { name: 'Green',  hex: '#008000' },
                    { name: 'Gray',   hex: '#808080' },
                    { name: 'Brown',  hex: '#8B4513' },
                    { name: 'Beige',  hex: '#F5F5DC' }
                  ].map(color => {
                    const colorData = currentProduct.colors?.find(c => c.name === color.name);
                    const isSelected = !!colorData;
                    
                    return (
                      <div key={color.name} className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newColors = isSelected
                              ? currentProduct.colors?.filter(c => c.name !== color.name)
                              : [...(currentProduct.colors || []), { ...color, images: [] }];
                            setCurrentProduct({...currentProduct, colors: newColors});
                          }}
                          className={`group relative flex flex-col items-center gap-1 p-2 rounded-sm border transition-all ${
                            isSelected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black'
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded-full border border-black/10 shadow-sm" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className={`text-[9px] font-bold uppercase tracking-tighter ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                            {color.name}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 shadow-sm">
                              <Check size={8} />
                            </div>
                          )}
                        </button>

                        {/* Image picker for selected color */}
                        {isSelected && (
                          <div className="bg-gray-50/50 p-2 rounded-sm border border-dashed border-gray-200">
                            <p className="text-[8px] font-black uppercase tracking-tighter text-gray-400 mb-2">Vincular Fotos:</p>
                            {currentProduct.images && currentProduct.images.length > 0 ? (
                              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                {currentProduct.images.map((img, idx) => {
                                  // Compatibility check: handle both string and array for images
                                  const currentImages = Array.isArray(colorData.images) 
                                    ? colorData.images 
                                    : (colorData.image ? [colorData.image] : []);
                                  const isSelectedImg = currentImages.includes(img);

                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        const newImagesList = isSelectedImg
                                          ? currentImages.filter(i => i !== img)
                                          : [...currentImages, img];
                                        
                                        const newColors = currentProduct.colors?.map(c => 
                                          c.name === color.name ? { ...c, images: newImagesList } : c
                                        );
                                        setCurrentProduct({...currentProduct, colors: newColors});
                                      }}
                                      className={`w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all ${
                                        isSelectedImg ? 'border-black scale-105 shadow-md' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
                                      }`}
                                    >
                                      <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-[9px] text-gray-400 italic">Subí imágenes primero</p>
                            )}
                            {(!colorData.images || colorData.images.length === 0) && (!colorData.image) && currentProduct.images?.length > 0 && (
                              <p className="text-[8px] text-red-400 font-bold uppercase mt-1">⚠️ Sin vincular</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Descripción</label>
                <textarea
                  value={currentProduct.description}
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 p-5 text-[13px] font-medium focus:outline-none focus:border-black transition-colors rounded-sm resize-none text-center"
                  placeholder="Detalles sobre materiales, calidad, etc..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Imágenes</label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {currentProduct.images?.map((url, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-sm overflow-hidden relative group">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      <button 
                        type="button"
                        onClick={() => setCurrentProduct({
                          ...currentProduct, 
                          images: currentProduct.images?.filter((_, idx) => idx !== i)
                        })}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-gray-50">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">Sugerencia: Subir fotos con fondo limpio para mejor estética.</p>
              </div>

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
    </div>
  )
}
