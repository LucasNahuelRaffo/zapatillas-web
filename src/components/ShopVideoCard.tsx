import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { getVideos, VideoReel } from '../lib/videoStore';

export default function ShopVideoCard() {
  const [video, setVideo] = useState<VideoReel | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function loadShopVideo() {
      try {
        const allVideos = await getVideos();
        // Filtrar videos destinados al Shop que estén activos
        const shopVideos = allVideos.filter(v => v.position === 'shop' && v.is_active);
        
        if (shopVideos.length > 0) {
          // Tomar el primero o seleccionar uno al azar para variedad
          setVideo(shopVideos[0]);
        }
      } catch (err) {
        console.error("Error al cargar video de tienda:", err);
      } finally {
        setLoading(false);
      }
    }
    loadShopVideo();
  }, []);

  // Efecto robusto para forzar autoplay en navegadores móviles y de escritorio sin bloqueos de reproducción
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl && video) {
      videoEl.muted = isMuted;
      videoEl.defaultMuted = true;
      videoEl.play().catch(err => {
        console.warn("Autoplay bloqueado temporalmente por política de navegador:", err);
      });
    }
  }, [video, isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (videoEl) {
      const nextMuted = !videoEl.muted;
      videoEl.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleScrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const searchEl = document.getElementById('shop-search');
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        searchEl.focus();
      }, 500);
    } else {
      window.scrollTo({ top: 480, behavior: 'smooth' });
    }
  };

  if (loading || !video) {
    if (loading) {
      return (
        <div className="col-span-1 row-span-2 aspect-[9/16] bg-zinc-950 text-white relative overflow-hidden rounded-sm border border-zinc-800 shadow-md group select-none flex flex-col justify-end p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 animate-pulse animate-duration-1000" />
          <div className="space-y-3 z-10 relative">
            <div className="h-3 w-1/3 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse" />
            <div className="h-10 w-full bg-zinc-800/40 rounded-sm animate-pulse" />
          </div>
        </div>
      );
    }
    return null; // Si no hay video asignado para el Shop, no renderiza nada (la grilla sigue normal)
  }

  return (
    <div className="col-span-1 row-span-2 aspect-[9/16] bg-black text-white relative overflow-hidden rounded-sm border border-black/5 shadow-md group select-none">
      {/* Video de Fondo */}
      <video
        ref={videoRef}
        src={video.url}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Capa de oscurecimiento superior e inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 pointer-events-none transition-opacity duration-300 group-hover:via-black/45" />

      {/* Botón flotante de Sonido */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/90 hover:scale-105 transition-all text-white flex items-center justify-center cursor-pointer shadow-lg"
        title={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>

      {/* Tag de "En Vivo / Destacado" */}
      <div className="absolute top-4 left-4 z-20 bg-red-600 text-white font-mono text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm shadow flex items-center gap-1.5 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        REEL
      </div>

      {/* Información del Video */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end gap-3 z-10">
        <div className="space-y-1">
          <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-zinc-400">
            Za-pass Lookbook
          </span>
          <h3 className="text-[13px] sm:text-[14px] font-bold tracking-wide uppercase leading-tight line-clamp-2 text-white drop-shadow-md">
            {video.title}
          </h3>
        </div>

        {/* Enlace o Call To Action */}
        {video.product_link ? (
          <Link
            to={`/product/${video.product_link}`}
            className="flex items-center justify-between bg-white text-black px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-black hover:text-white border border-transparent hover:border-white shadow-lg"
          >
            Ver Producto
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </Link>
        ) : (
          <button
            onClick={handleScrollToProducts}
            className="w-full flex items-center justify-between bg-white/10 border border-white/20 backdrop-blur-md text-white px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:bg-white hover:text-black shadow-lg cursor-pointer text-left font-common"
          >
            Explorar Drops
            <ShoppingBag size={12} />
          </button>
        )}
      </div>

      {/* Capa de borde fino decorativo al hacer hover */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 pointer-events-none transition-all duration-300" />
    </div>
  );
}
