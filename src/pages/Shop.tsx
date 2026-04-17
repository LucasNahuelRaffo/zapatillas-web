import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase, hasSupabaseCredentials } from '../lib/supabase'
import { Product } from '../data/products'
import { getLocalProducts } from '../lib/productStore'

/* ───────────────────────────────────────────────
   DATA
   CATEGORIES, SIZES, COLORS are kept as filter definitions
   but PRODUCTS will be fetched from DB.
─────────────────────────────────────────────── */

const CATEGORIES = ['All Sneakers', 'Adidas', 'Nike', 'Jordan', 'Travis Scott', 'Puma', 'Topper', 'John Foos', 'Vicus', 'Jaguar', 'Kioshi', 'Vans', 'Converse', 'Fila', 'DC Shoes', 'New Balance', 'Asics', 'Salomon', 'Olympikus', 'Under Armour', 'Skechers', 'Reebok', 'On']

const SIZES = [38, 39, 40, 41, 42, 43, 44, 45]

const COLORS = [
  { name: 'Black',  hex: '#111111' },
  { name: 'White',  hex: '#FFFFFF' },
  { name: 'Red',    hex: '#E53935' },
  { name: 'Blue',   hex: '#1565C0' },
  { name: 'Gray',   hex: '#9E9E9E' },
  { name: 'Brown',  hex: '#8B4513' },
]


const BRAND_SECTIONS = [
  { key: 'Adidas',       label: 'ADIDAS' },
  { key: 'Nike',         label: 'NIKE' },
  { key: 'Jordan',       label: 'JORDAN' },
  { key: 'New Balance',  label: 'NEW BALANCE & CLASSICS' },
  { key: 'Puma',         label: 'PUMA' },
  { key: 'Topper',       label: 'TOPPER & NACIONALES' },
]

/* ───────────────────────────────────────────────
   PRICE RANGE SLIDER COMPONENT
─────────────────────────────────────────────── */
function PriceSlider({
  min, max, value, onChange
}: {
  min: number; max: number; value: [number, number];
  onChange: (v: [number, number]) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const pct = (v: number) => ((v - min) / (max - min)) * 100

  const handleDown = (thumb: 0 | 1) => (eDown: React.MouseEvent | React.TouchEvent) => {
    eDown.preventDefault()
    const track = trackRef.current
    if (!track) return
    const { left, width } = track.getBoundingClientRect()

    const move = (eMove: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in eMove ? eMove.touches[0].clientX : eMove.clientX
      const raw = Math.round(((clientX - left) / width) * (max - min) + min)
      const clamped = Math.max(min, Math.min(max, raw))
      const next: [number, number] = [...value] as [number, number]
      if (thumb === 0) next[0] = Math.min(clamped, value[1] - 1)
      else             next[1] = Math.max(clamped, value[0] + 1)
      onChange(next)
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
  }

  return (
    <div className="px-1 py-2">
      <div ref={trackRef} className="relative h-1 bg-gray-200 rounded-full">
        {/* filled range */}
        <div
          className="absolute top-0 h-1 bg-black rounded-full"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        {/* thumb 0 */}
        <button
          onMouseDown={handleDown(0)}
          onTouchStart={handleDown(0)}
          style={{ left: `${pct(value[0])}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black border-2 border-white shadow cursor-pointer focus:outline-none"
        />
        {/* thumb 1 */}
        <button
          onMouseDown={handleDown(1)}
          onTouchStart={handleDown(1)}
          style={{ left: `${pct(value[1])}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black border-2 border-white shadow cursor-pointer focus:outline-none"
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-400 tracking-wide">
        <span>${value[0]}</span>
        <span>${value[1]}+</span>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────
   PRODUCT CARD
─────────────────────────────────────────────── */
function ProductCard({ product, activeColors }: { product: Product, activeColors?: string[] }) {
  // Encontrar si algún color activo en los filtros coincide con un color del producto que tenga imagen
  const matchingColor = product.colors.find(c => 
    activeColors?.some(ac => c.name.toLowerCase().includes(ac.toLowerCase())) && 
    ((Array.isArray(c.images) && c.images.length > 0) || (c as any).image)
  );

  const displayImage = matchingColor 
    ? (Array.isArray(matchingColor.images) ? matchingColor.images[0] : (matchingColor as any).image) 
    : product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer"
    >
      <Link to={`/product/${product.id}${matchingColor ? `?color=${matchingColor.name}` : ''}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden mb-3 relative">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <p className="text-[13px] font-medium text-black leading-snug">{product.name}</p>
        <p className="text-[13px] text-black mt-0.5">${(product.price).toLocaleString('es-AR')}</p>
      </Link>
    </motion.div>
  )
}

/* ───────────────────────────────────────────────
   BRAND SECTION
─────────────────────────────────────────────── */
function BrandSection({
  label, brandKey, products, activeColors
}: { label: string; brandKey: string; products: Product[]; activeColors?: string[] }) {
  const items = products.filter(p => p.brand.toLowerCase() === brandKey.toLowerCase()).slice(0, 3)
  if (items.length === 0) return null

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-black tracking-tight uppercase">{label}</h2>
        <button className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-black hover:opacity-60 transition-opacity">
          See All <ArrowRight size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-3 gap-5">
        {items.map(p => <ProductCard key={p.id} product={p} activeColors={activeColors} />)}
      </div>
    </section>
  )
}

/* ───────────────────────────────────────────────
   SIDEBAR LABEL
─────────────────────────────────────────────── */
function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
      {children}
    </p>
  )
}

/* ───────────────────────────────────────────────
   SHOP PAGE
─────────────────────────────────────────────── */
export default function Shop() {
  // Cargar desde localStorage (productStore) instantáneamente
  const [products, setProducts]       = useState<Product[]>(() => getLocalProducts())
  const [loading, setLoading]         = useState(false)
  const [activeCategory, setActiveCategory] = useState('All Sneakers')
  const [priceRange, setPriceRange]         = useState<[number, number]>([0, 300])
  const [activeSizes, setActiveSizes]       = useState<number[]>([])
  const [activeColors, setActiveColors]     = useState<string[]>([])
  const [searchQuery, setSearchQuery]       = useState('')

  useEffect(() => {
    // Si hay Supabase real, intentar sincronizar desde la DB
    if (!hasSupabaseCredentials) return

    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) setProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
      }
    }

    fetchProducts()
  }, [])

  const toggleSize = (s: number) =>
    setActiveSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const toggleColor = (c: string) =>
    setActiveColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  /* Filter products */
  const filteredProducts = products.filter(p => {
    const catOk   = activeCategory === 'All Sneakers' || p.category === activeCategory
    const priceOk = p.price/1000 >= priceRange[0] && p.price/1000 <= priceRange[1]
    const sizeOk  = activeSizes.length === 0 || activeSizes.some(s => p.sizes.some((ps: any) => ps.size === s.toString() && ps.stock))
    const colorOk = activeColors.length === 0 || activeColors.some(c => 
      p.colors.some((pc: any) => pc.name.toLowerCase().includes(c.toLowerCase()))
    )
    const searchMatch = searchQuery.trim() === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    return catOk && priceOk && sizeOk && colorOk && searchMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9]">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Cargando catálogo...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#f9f9f9] min-h-screen">
      {/* ── Hero banner ─────────────────────────── */}
      <div className="bg-[#f0f0f0] border-b border-black/5 py-12 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight max-w-xl"
          >
            Find Your<br />Perfect Sneakers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mt-3"
          >
            Explore the latest drops and iconic classics
          </motion.p>
        </div>
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 flex gap-10">

        {/* ── SIDEBAR ────────────────────────────── */}
        <aside className="w-[200px] flex-shrink-0 hidden md:block">

          {/* Categories */}
          <SidebarLabel>Categorías</SidebarLabel>
          <ul className="mb-8 space-y-2">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[13px] leading-snug transition-colors ${
                    activeCategory === cat
                      ? 'font-bold text-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          {/* Price range */}
          <SidebarLabel>Rango de Precio</SidebarLabel>
          <div className="mb-8">
            <PriceSlider min={0} max={300} value={priceRange} onChange={setPriceRange} />
          </div>

          {/* Sizes */}
          <SidebarLabel>Tallas</SidebarLabel>
          <div className="grid grid-cols-4 gap-1.5 mb-8">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`h-8 text-[11px] font-semibold border transition-all ${
                  activeSizes.includes(s)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-200 hover:border-black'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Colors */}
          <SidebarLabel>Colores</SidebarLabel>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => toggleColor(c.name)}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full border-[1.5px] transition-all ${
                  activeColors.includes(c.name)
                    ? 'border-black scale-110 ring-2 ring-black ring-offset-1'
                    : 'border-gray-300 hover:border-black'
                }`}
              />
            ))}
          </div>
        </aside>

        {/* ── PRODUCT GRID ───────────────────────── */}
        <main className="flex-1 min-w-0">
          
          {/* Search Bar */}
          <div className="mb-10 relative">
            <input
              id="shop-search"
              type="text"
              placeholder="Buscar modelos, marcas, estilo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/5 h-14 pl-12 pr-6 text-[13px] font-medium tracking-wide focus:outline-none focus:border-black transition-colors rounded-sm shadow-sm"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
          </div>
          {activeCategory === 'All Sneakers' ? (
            /* All: show brand sections */
            BRAND_SECTIONS.map(section => (
              <BrandSection
                key={section.key}
                label={section.label}
                brandKey={section.key}
                products={filteredProducts}
                activeColors={activeColors}
              />
            ))
          ) : (
            /* Single category: flat grid */
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {activeCategory.toUpperCase()}
                </h2>
                <span className="text-sm text-gray-400">{filteredProducts.length} productos</span>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <p className="text-gray-400 text-sm">No se encontraron productos con los filtros seleccionados.</p>
                  <button
                    onClick={() => { setActiveCategory('All Sneakers'); setActiveSizes([]); setActiveColors([]); setPriceRange([0, 300]) }}
                    className="mt-4 text-[11px] font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredProducts.map(p => <ProductCard key={p.id} product={p} activeColors={activeColors} />)}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
