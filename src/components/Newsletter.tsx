import { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useGSAP(() => {
    // 1. Efecto Parallax súper premium para la imagen izquierda
    gsap.fromTo(imageRef.current,
      { y: '-15%' }, // Empieza movida hacia arriba a propósito
      {
        y: '15%',    // Va deslizando hacia abajo a medida que haces scroll
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom', // Arranca cuando la sección apenas toca la pantalla desde abajo
          end: 'bottom top',   // Termina cuando la sección se va por arriba
          scrub: true          // Amarrado exactamente a la rueda del mouse
        }
      }
    )

    // 2. Revelación Dramática del Título (Efecto Clip-Path de cortina)
    gsap.fromTo('.nl-title',
      { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 },
      { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    )

    // 3. Subtítulos y logo desvaneciéndose hacia la derecha
    gsap.fromTo('.nl-fade-right',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    )

    // 4. Formulario subiendo sutilmente
    gsap.fromTo('.nl-form',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      }
    )
  }, { scope: sectionRef })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <section ref={sectionRef} className="bg-[#f4f4f4] w-full flex flex-col lg:flex-row min-h-[600px] lg:h-[750px] overflow-hidden">
      {/* Left Column - Image Container */}
      <div className="w-full lg:w-1/2 h-[450px] lg:h-full relative overflow-hidden group">
        <img 
          ref={imageRef}
          src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1500&auto=format&fit=crop" 
          alt="Archive Sneaker" 
          // Hacemos la imagen más alta (scale-125) para darle margen físico para desplazarse con el parallax
          className="w-full h-[130%] object-cover grayscale contrast-[1.1] brightness-[0.8] transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 mix-blend-overlay opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
      </div>

      {/* Right Column - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 sm:p-16 lg:p-24 bg-[#f4f4f4]">
        <div className="max-w-[480px] w-full flex flex-col items-start text-left">
          
          <div className="nl-fade-right flex items-center gap-3 mb-8">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
              Club Za-pass
            </h2>
          </div>
          
          <h2 className="nl-title text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tighter uppercase leading-[0.9] mb-8 text-black">
            Access The<br />Archive.
          </h2>
          
          <p className="nl-fade-right text-[12px] sm:text-[13px] text-gray-500 mb-12 font-medium leading-[1.8] max-w-[400px]">
            Recibí acceso prioritario a drops exclusivos y catálogo secreto antes que nadie.
          </p>

          <form onSubmit={handleSubmit} className="nl-form flex flex-col gap-4 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu dirección de email"
              className="w-full px-6 py-4 sm:py-5 bg-white border border-gray-200/60 shadow-sm text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 font-medium"
              required
            />
            <button
              type="submit"
              className="w-full bg-black hover:bg-[#1a1a1a] text-white text-[11px] font-bold tracking-[0.2em] uppercase px-10 py-5 transition-colors"
            >
              Suscribirse
            </button>
          </form>

          {submitted && (
            <p className="mt-6 text-[11px] font-bold tracking-widest text-[#111] uppercase animate-fade-up">
              Bienvenido al club. Pronto recibirás noticias.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
