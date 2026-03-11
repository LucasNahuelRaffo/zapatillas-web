import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // 1. Efecto Apple Full: Pinear la sección y tomar la pantalla completa.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',    // Cuando la sección toca arriba
        end: '+=1500',       // Animación más larga (1500px) para más disfrute
        scrub: 1,            // Animación atada al scroll suave
        pin: true,           // Fija la pantalla
      }
    })

    // Desaparece el texto hacia arriba
    tl.to(textRef.current, { 
      opacity: 0, 
      y: -100, 
      duration: 0.4,
      ease: 'power2.in'
    }, 0)

    // Animamos contenedor del video para que suba desde abajo y crezca a 100vw/100vh
    tl.fromTo(videoWrapperRef.current,
      { 
        y: '80vh',
        width: '40vw',
        height: '30vh',
        borderRadius: '50px',
        opacity: 0.5
      },
      { 
        y: 0,
        width: '100vw',
        height: '100vh', 
        borderRadius: '0px',
        opacity: 1,
        ease: 'power2.inOut',
        duration: 1
      },
      0
    )

    // 2. Animación de aparición de los textos antes del pinning
    gsap.fromTo('.video-text',
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%', 
        }
      }
    )

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="video" className="bg-[#111] w-full h-screen flex flex-col justify-center items-center overflow-hidden relative">
      
      {/* Textos Superiores Absolutos para permitir superposición */}
      <div ref={textRef} className="absolute w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 z-10">
        <div className="video-text">
          <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-4">
            Behind the Scenes
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase text-balance leading-none">
            Experiencia<br />Unboxing
          </h2>
        </div>
        <div className="video-text flex flex-col lg:max-w-md lg:pb-2">
          <p className="text-gray-400 text-[13px] sm:text-[14px] leading-[1.8] font-medium mb-8">
            Sentí el peso de la caja, el crujido del papel de seda premium y el olor característico de fábrica 
            directamente en tu puerta.
          </p>
          
          {/* Production Specs */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 border-t border-white/10">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase">Duration</span>
              <span className="text-white text-[13px] font-mono tracking-wider">01:24</span>
            </div>
            <div className="w-px h-6 bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase">Quality</span>
              <span className="text-white text-[13px] font-mono tracking-wider">4K HDR</span>
            </div>
            <div className="w-px h-6 bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase">Status</span>
              <span className="flex items-center gap-2 text-white text-[12px] font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
                Live Demo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Real a Pantalla Completa animada */}
      <div 
        ref={videoWrapperRef} 
        className="absolute z-20 overflow-hidden shadow-2xl flex items-center justify-center bg-black"
      >
        {/* Etiqueta de Video con reproducción automática, silenciada y en bucle */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-90"
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
        />
        
        {/* Capa sutil de oscurecimiento o decoración (Opcional) */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>
    </section>
  )
}
