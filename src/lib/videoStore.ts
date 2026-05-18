import { supabase, hasSupabaseCredentials } from './supabase';

export interface VideoReel {
  id: string;
  title: string;
  url: string;
  position: 'home' | 'shop';
  product_link?: string; // ID o link del producto asociado
  is_active: boolean;
  created_at?: string;
}

const STORAGE_KEY = 'zapass_videos';

// Videos premium de calzado vertical por defecto (usando Mixkit con URLs directas estáticas)
const DEFAULT_VIDEOS: VideoReel[] = [
  {
    id: 'default-1',
    title: 'Jordan 4 Retro Sail - Premium Unboxing',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-pair-of-white-sneakers-40098-large.mp4',
    position: 'home',
    product_link: '8', // Jordan 4 Retro Black Cat o similar (ID correspondiente en el catálogo)
    is_active: true,
  },
  {
    id: 'default-2',
    title: 'Nike Air Max DN - On Feet View',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-sneakers-being-tied-40097-large.mp4',
    position: 'home',
    product_link: '26', // Nike Air Max DN Beige o similar
    is_active: true,
  },
  {
    id: 'default-3',
    title: 'Adidas Forum Low x Bad Bunny - Style Check',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-in-sneakers-40096-large.mp4',
    position: 'home',
    product_link: '13', // Adidas Forum Low x Bad Bunny
    is_active: true,
  },
  {
    id: 'default-4',
    title: 'Premium Sneakers Detail Shot',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-pair-of-white-sneakers-40098-large.mp4',
    position: 'home',
    product_link: '',
    is_active: true,
  },
  {
    id: 'default-5',
    title: 'Shop Exclusive Drop Lookbook',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-sneakers-being-tied-40097-large.mp4',
    position: 'shop',
    product_link: '',
    is_active: true,
  }
];

/**
 * Obtener videos de forma híbrida:
 * 1. Intenta cargar desde Supabase.
 * 2. Si falla o no está configurado, lee de localStorage.
 * 3. Si no hay nada en localStorage, devuelve los videos por defecto.
 */
export async function getVideos(): Promise<VideoReel[]> {
  if (hasSupabaseCredentials) {
    try {
      const { data, error } = await supabase
        .from('videos_zapatillas')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as VideoReel[];
      }
      if (error) {
        console.warn('Supabase videos query returned error, falling back to local:', error.message);
      }
    } catch (e) {
      console.warn('Failed to fetch videos from Supabase, falling back to local:', e);
    }
  }

  // Fallback a localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}

  // Si tampoco hay en localStorage, guardamos los valores por defecto y los devolvemos
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VIDEOS));
  } catch (_) {}
  
  return DEFAULT_VIDEOS;
}

/** Guardar localmente en localStorage para mantener coherencia */
function saveLocalVideos(videos: VideoReel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (_) {}
}

/** Agregar un video */
export async function addVideo(video: Omit<VideoReel, 'id' | 'created_at'>): Promise<VideoReel> {
  const newId = 'vid-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
  const newVideo: VideoReel = {
    ...video,
    id: newId,
    created_at: new Date().toISOString()
  };

  // Guardar localmente
  const current = await getVideos();
  saveLocalVideos([...current, newVideo]);

  // Guardar en Supabase
  if (hasSupabaseCredentials) {
    try {
      const { error } = await supabase.from('videos_zapatillas').insert([
        {
          id: newVideo.id,
          title: newVideo.title,
          url: newVideo.url,
          position: newVideo.position,
          product_link: newVideo.product_link || null,
          is_active: newVideo.is_active
        }
      ]);
      if (error) {
        console.error('Supabase error inserting video:', error.message);
      }
    } catch (e) {
      console.error('Failed to insert video into Supabase:', e);
    }
  }

  return newVideo;
}

/** Actualizar un video */
export async function updateVideo(updated: VideoReel): Promise<void> {
  // Actualizar local
  const current = await getVideos();
  saveLocalVideos(current.map(v => v.id === updated.id ? updated : v));

  // Actualizar Supabase
  if (hasSupabaseCredentials) {
    try {
      const { error } = await supabase
        .from('videos_zapatillas')
        .update({
          title: updated.title,
          url: updated.url,
          position: updated.position,
          product_link: updated.product_link || null,
          is_active: updated.is_active
        })
        .eq('id', updated.id);

      if (error) {
        console.error('Supabase error updating video:', error.message);
      }
    } catch (e) {
      console.error('Failed to update video in Supabase:', e);
    }
  }
}

/** Eliminar un video */
export async function deleteVideo(id: string): Promise<void> {
  // Eliminar local
  const current = await getVideos();
  saveLocalVideos(current.filter(v => v.id !== id));

  // Eliminar Supabase
  if (hasSupabaseCredentials) {
    try {
      const { error } = await supabase
        .from('videos_zapatillas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting video:', error.message);
      }
    } catch (e) {
      console.error('Failed to delete video from Supabase:', e);
    }
  }
}
