import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import productPegasus from '../img/product_pegasus.png'
import productJordan from '../img/product_jordan.png'
import productUltraboost from '../img/product_ultraboost.png'

gsap.registerPlugin(ScrollTrigger)

interface Product {
  name: string
  model: string
  price: string
  image: string
}

const products: Product[] = [
  {
    name: 'AIR ZOOM',
    model: 'Pegasus 39',
    price: '$89.990',
    image: productPegasus,
  },
  {
    name: 'RETRO HIGH',
    model: 'Air Jordan 1',
    price: '$124.990',
    image: productJordan,
  },
  {
    name: 'ULTRABOOST',
    model: 'DNA Core Black',
    price: '$94.990',
    image: productUltraboost,
  },
]

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group cursor-pointer flex flex-col h-full w-full">
      <div className="relative aspect-[4/3] bg-[#f0f0f0] mb-6 overflow-hidden flex items-center justify-center p-8 transition-colors duration-500 hover:bg-[#ebebeb] rounded-sm">
        <img
          src={product.image}
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
          <p className="text-[12px] text-gray-500 font-medium">{product.model}</p>
        </div>
        <p className="text-[14px] font-bold tracking-widest text-black">{product.price}</p>
      </div>
    </div>
  )
}

export default function ProductCarousel() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
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
  }, { scope: containerRef })

  return (
    <section ref={containerRef} id="productos" className="bg-white py-24 lg:py-32 border-t border-black/5 overflow-hidden perspective-[1000px]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6 overflow-hidden">
          <div className="novedades-header">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none text-black">
              Novedades <span className="text-gray-200">///</span>
            </h2>
          </div>
          <a
            href="#"
            className="catalogo-link group inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase text-black hover:text-gray-600 transition-colors"
          >
            Ver Catálogo
            <span className="w-12 h-px bg-black group-hover:w-16 group-hover:bg-gray-600 transition-all duration-300" />
          </a>
        </div>

        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, i) => (
            <div key={i} className="product-card origin-bottom">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
