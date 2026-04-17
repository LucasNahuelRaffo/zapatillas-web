import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { supabase, hasSupabaseCredentials } from '../lib/supabase'
import { Product } from '../data/products'
import { getLocalProducts } from '../lib/productStore'

gsap.registerPlugin(ScrollTrigger)

function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price).replace('ARS', '$');

  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer flex flex-col h-full w-full">
      <div className="relative aspect-[4/3] bg-[#f0f0f0] mb-6 overflow-hidden flex items-center justify-center p-8 transition-colors duration-500 hover:bg-[#ebebeb] rounded-sm">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full mix-blend-multiply drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
        <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          Comprar
        </div>
      </div>
      
      <div className="flex justify-between items-start mt-auto">
        <div>
          <h3 className="text-[14px] font-black tracking-widest text-black mb-1.5 uppercase">{product.name}</h3>
          <p className="text-[12px] text-gray-500 font-medium">{product.brand}</p>
        </div>
        <p className="text-[14px] font-bold tracking-widest text-black">{formattedPrice}</p>
      </div>
    </Link>
  )
}

export default function ProductCarousel() {
  // Cargar desde localStorage (productStore) instantáneamente
  const [products, setProducts] = useState<Product[]>(
    () => getLocalProducts().slice(0, 3)
  )
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Solo consultar Supabase si hay credenciales reales
    if (!hasSupabaseCredentials) return

    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(3)
          .order('id', { ascending: true })
        
        if (error) throw error;
        if (data && data.length > 0) setProducts(data)
      } catch (err) {
        console.error('Carousel fetch error:', err);
      }
    }
    fetchProducts()
  }, [])

  useGSAP(() => {
    if (products.length === 0) return
    
    // Título Superior animado
    gsap.fromTo('.novedades-header',
      { opacity: 0, x: -50, filter: 'blur(10px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      }
    )

    // Botón / Link Ver Catálogo
    gsap.fromTo('.catalogo-link',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      }
    )

    // Tarjetas de productos entrando desde abajo flotando en cascada
    gsap.fromTo('.product-card',
      { opacity: 0, y: 150, rotateX: 20, scale: 0.9 },
      { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.product-grid',
          start: 'top 85%',
        }
      }
    )
  }, { scope: containerRef, dependencies: [products] })

  return (
    <section ref={containerRef} id="productos" className="bg-white py-24 lg:py-32 border-t border-black/5 overflow-hidden perspective-[1000px]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6 overflow-hidden">
          <div className="novedades-header">
            <h2 className="font-skylight text-5xl sm:text-6xl tracking-tight leading-none text-black">
              Novedades <span className="text-gray-200">///</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="catalogo-link group inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase text-black hover:text-gray-600 transition-colors"
          >
            Ver Catálogo
            <span className="w-12 h-px bg-black group-hover:w-16 group-hover:bg-gray-600 transition-all duration-300" />
          </Link>
        </div>

        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.length > 0 ? (
            products.map((product, i) => (
              <div key={i} className="product-card origin-bottom">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-50 animate-pulse rounded-sm" />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
