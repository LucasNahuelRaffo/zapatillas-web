import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, ArrowUpRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getVideos, VideoReel } from '../lib/videoStore';

gsap.registerPlugin(ScrollTrigger);

export default function ReelSection() {
  const [reels, setReels] = useState<VideoReel[]>([]);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const [playingStates, setPlayingStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    async function loadReels() {
      try {
        const allVideos = await getVideos();
        // Filtrar solo los videos asignados al home que estén activos
        const homeVideos = allVideos.filter(v => v.position === 'home' && v.is_active);
        setReels(homeVideos);
        
        // Inicializar estados de silencio y reproducción
        const initialMute: Record<string, boolean> = {};
        const initialPlay: Record<string, boolean> = {};
        homeVideos.forEach(v => {
          initialMute[v.id] = true; // Por defecto siempre silenciados para que el navegador permita autoplay
          initialPlay[v.id] = false;
        });
        setMutedStates(initialMute);
        setPlayingStates(initialPlay);
      } catch (err) {
        console.error("Error al cargar los reels:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReels();
  }, []);

  // IntersectionObserver para reproducir automáticamente al entrar en pantalla y pausar al salir
  useEffect(() => {
    if (reels.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '600px 0px', // Expandido para anticipar descarga inteligente de los videos
      threshold: 0.3 // Al menos 30% del reel visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const reelId = entry.target.getAttribute('data-reel-id');
        if (!reelId) return;

        const video = videoRefs.current[reelId];
        if (!video) return;

        if (entry.isIntersecting) {
          // Entró en pantalla -> Reproducir
          video.play()
            .then(() => {
              setPlayingStates(prev => ({ ...prev, [reelId]: true }));
            })
            .catch(() => {
              // Si falla (por políticas de autoplay), nos aseguramos que esté silenciado y reintentamos
              video.muted = true;
              setMutedStates(prev => ({ ...prev, [reelId]: true }));
              video.play().then(() => {
                setPlayingStates(prev => ({ ...prev, [reelId]: true }));
              });
            });
        } else {
          // Salió de pantalla -> Pausar
          video.pause();
          setPlayingStates(prev => ({ ...prev, [reelId]: false }));
        }
      });
    }, observerOptions);

    // Observar cada contenedor de reel
    const elements = document.querySelectorAll('.reel-card-container');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [reels]);

  // Animaciones de entrada con GSAP
  useGSAP(() => {
    if (reels.length === 0) return;

    // Animación rápida del encabezado
    gsap.fromTo('.reels-header-anim', 
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%'
        }
      }
    );

    // Animación rápida de las tarjetas de reels en cascada
    gsap.fromTo('.reel-card-anim',
      { opacity: 0, y: 25, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sliderRef.current,
          start: 'top 88%'
        }
      }
    );
  }, { scope: containerRef, dependencies: [reels] });

  // Controladores de volumen y play manuales
  const toggleMute = (reelId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRefs.current[reelId];
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setMutedStates(prev => ({ ...prev, [reelId]: nextMuted }));
    }
  };

  const togglePlay = (reelId: string) => {
    const video = videoRefs.current[reelId];
    if (video) {
      if (video.paused) {
        video.play()
          .then(() => setPlayingStates(prev => ({ ...prev, [reelId]: true })))
          .catch(err => console.error(err));
      } else {
        video.pause();
        setPlayingStates(prev => ({ ...prev, [reelId]: false }));
      }
    }
  };

  // Desplazamiento del carrusel con botones de control
  const scrollSlider = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (slider) {
      const scrollAmount = 320 + 24; // ancho tarjeta + gap
      slider.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || reels.length === 0) {
    if (loading) {
      return (
        <section className="py-16 lg:py-24 bg-black overflow-hidden relative text-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neutral-900/40 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neutral-950/60 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col gap-10">
            {/* Header de la Sección Esqueleto */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-3">
                <div className="h-4 w-40 bg-zinc-800 rounded-sm animate-pulse" />
                <div className="h-10 w-72 sm:w-96 bg-zinc-800 rounded-sm animate-pulse" />
                <div className="h-5 w-80 sm:w-[500px] bg-zinc-800 rounded-sm animate-pulse" />
              </div>
            </div>

            {/* Carrusel de Tarjetas Esqueleto */}
            <div className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory touch-pan-x">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-2xl relative snap-start"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 animate-pulse" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
                    <div className="h-3 w-1/3 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-5 w-5/6 bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null; // Si no hay videos activos para el home, no mostramos la sección
  }

  return (
    <section ref={containerRef} className="py-16 lg:py-24 bg-black overflow-hidden relative text-white">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neutral-900/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neutral-950/60 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col gap-10">
        
        {/* Header de la Sección */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <span className="reels-header-anim block text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">
              Drop Reels & Unboxings
            </span>
            <h2 className="reels-header-anim font-skylight text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-none">
              Zapas <span className="text-zinc-500">en Acción</span>
            </h2>
            <p className="reels-header-anim text-[13px] text-zinc-400 max-w-lg leading-relaxed font-medium">
              Mirá el calce, los materiales y la calidad real de tus sneakers favoritas directamente en video. Variedad al 100%.
            </p>
          </div>
          
          {/* Botones de Control del Slider */}
          <div className="reels-header-anim flex items-center gap-3 self-end md:self-auto">
            <button 
              onClick={() => scrollSlider('left')}
              className="w-12 h-12 rounded-full border border-zinc-800 hover:border-white flex items-center justify-center text-zinc-400 hover:text-white transition-all bg-zinc-950/50 backdrop-blur-sm cursor-pointer"
              aria-label="Reel anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scrollSlider('right')}
              className="w-12 h-12 rounded-full border border-zinc-800 hover:border-white flex items-center justify-center text-zinc-400 hover:text-white transition-all bg-zinc-950/50 backdrop-blur-sm cursor-pointer"
              aria-label="Siguiente reel"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carrusel de Tarjetas Reels */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory touch-pan-x"
          style={{ scrollbarWidth: 'none' }}
        >
          {reels.map((reel) => {
            const isMuted = mutedStates[reel.id] ?? true;
            const isPlaying = playingStates[reel.id] ?? false;
            
            return (
              <div 
                key={reel.id}
                data-reel-id={reel.id}
                className="reel-card-anim reel-card-container flex-shrink-0 w-[280px] sm:w-[320px] aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-2xl relative snap-start group transition-all duration-500 hover:border-zinc-500/50 hover:shadow-zinc-500/5"
              >
                {/* Video HTML5 */}
                <video
                  ref={el => { videoRefs.current[reel.id] = el; }}
                  src={reel.url}
                  loop
                  muted={isMuted}
                  playsInline
                  preload="metadata" // Cambiado a metadata para precarga fluida sin bloquear red
                  onClick={() => togglePlay(reel.id)}
                  className="w-full h-full object-cover cursor-pointer select-none transition-transform duration-700 ease-out group-hover:scale-[1.03] bg-zinc-900"
                />

                {/* Capa de degrade premium superior/inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 pointer-events-none" />

                {/* Botón flotante superior de Sonido */}
                <button
                  onClick={(e) => toggleMute(reel.id, e)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/90 hover:scale-105 transition-all text-white flex items-center justify-center cursor-pointer shadow-lg"
                  title={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Overlay de Pausado */}
                {!isPlaying && (
                  <div 
                    onClick={() => togglePlay(reel.id)}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-opacity"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white scale-90 hover:scale-100 transition-transform shadow-2xl">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                )}

                {/* Contenido / Textos al pie del Reel */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3 pointer-events-none z-15">
                  <div className="space-y-1">
                    <h3 className="text-[14px] sm:text-[15px] font-bold tracking-wide uppercase line-clamp-2 text-white drop-shadow-md">
                      {reel.title}
                    </h3>
                  </div>

                  {/* Botón de Enlace a Producto */}
                  {reel.product_link && (
                    <Link
                      to={`/product/${reel.product_link}`}
                      className="pointer-events-auto self-start mt-1 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:bg-black hover:text-white hover:border-white border border-transparent shadow-lg"
                    >
                      Ver Producto <ArrowUpRight size={12} strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
