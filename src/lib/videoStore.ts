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

// Generar un UUID v4 válido nativamente compatible con Postgres
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 5 UUIDs estables y 100% válidos en Postgres para los videos por defecto
const DEFAULT_UUIDS = {
  v1: 'da111111-1111-4111-a111-111111111111',
  v2: 'da222222-2222-4222-a222-222222222222',
  v3: 'da333333-3333-4333-a333-333333333333',
  v4: 'da444444-4444-4444-a444-444444444444',
  v5: 'da555555-5555-4555-a555-555555555555'
};

// Videos premium de calzado por defecto (usando links de Google Storage ultra estables, públicos y rápidos)
const DEFAULT_VIDEOS: VideoReel[] = [
  {
    id: DEFAULT_UUIDS.v1,
    title: 'Jordan 4 Retro Sail - Premium Unboxing',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    position: 'home',
    product_link: '8', // Relacionado con producto 8
    is_active: true,
  },
  {
    id: DEFAULT_UUIDS.v2,
    title: 'Nike Air Max DN - On Feet View',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    position: 'home',
    product_link: '26', // Relacionado con producto 26
    is_active: true,
  },
  {
    id: DEFAULT_UUIDS.v3,
    title: 'Adidas Forum Low x Bad Bunny - Style Check',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    position: 'home',
    product_link: '13', // Relacionado con producto 13
    is_active: true,
  },
  {
    id: DEFAULT_UUIDS.v4,
    title: 'Premium Sneakers Detail Shot',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    position: 'home',
    product_link: '',
    is_active: true,
  },
  {
    id: DEFAULT_UUIDS.v5,
    title: 'Shop Exclusive Drop Lookbook',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    position: 'shop',
    product_link: '',
    is_active: true,
  }
];

// Caché global en memoria y promesa de carga única para rendimiento extremo (0ms en llamadas repetidas)
let cachedVideos: VideoReel[] | null = null;
let activeFetchPromise: Promise<VideoReel[]> | null = null;

/**
 * Obtener videos de forma híbrida:
 * 1. Devuelve caché instantáneo si ya se cargó antes.
 * 2. Deduplica llamadas paralelas compartiendo la misma promesa de red.
 * 3. Siembra la base de datos si está vacía.
 * 4. Respalda en localStorage y valores por defecto si falla la red.
 */
export async function getVideos(forceRefresh = false): Promise<VideoReel[]> {
  if (cachedVideos && !forceRefresh) {
    return cachedVideos;
  }
  if (activeFetchPromise && !forceRefresh) {
    return activeFetchPromise;
  }

  activeFetchPromise = (async () => {
    let result: VideoReel[] = [];
    
    if (hasSupabaseCredentials) {
      try {
        const { data, error } = await supabase
          .from('videos_zapatillas')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          result = data as VideoReel[];
        } else if (!error && data && data.length === 0) {
          console.log('La tabla videos_zapatillas está vacía. Sembrando videos por defecto...');
          const seededVideos = DEFAULT_VIDEOS.map(v => ({
            id: v.id,
            title: v.title,
            url: v.url,
            position: v.position,
            product_link: v.product_link || null,
            is_active: v.is_active
          }));
          
          const { error: insertError } = await supabase.from('videos_zapatillas').insert(seededVideos);
          if (!insertError) {
            result = DEFAULT_VIDEOS;
          } else {
            console.error('Error al sembrar videos por defecto en Supabase:', insertError.message);
            result = DEFAULT_VIDEOS;
          }
        } else {
          throw new Error(error?.message || 'Error en consulta de Supabase');
        }
      } catch (e) {
        console.warn('Failed to fetch/seed videos from Supabase, falling back to local:', e);
        result = await getLocalFallback();
      }
    } else {
      result = await getLocalFallback();
    }

    cachedVideos = result;
    activeFetchPromise = null;
    return result;
  })();

  return activeFetchPromise;
}

// Auxiliar para obtener datos locales rápidamente en caso de fallos
async function getLocalFallback(): Promise<VideoReel[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VIDEOS));
  } catch (_) {}
  
  return DEFAULT_VIDEOS;
}

// Disparar pre-fetch inmediato al cargar la aplicación para calentar la caché del navegador
if (typeof window !== 'undefined') {
  getVideos().catch(() => {});
}

/** Guardar localmente en localStorage para mantener coherencia */
function saveLocalVideos(videos: VideoReel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (_) {}
}

/** 
 * Sube un archivo de video al Storage Bucket público de Supabase ('videos').
 * Si tiene éxito, devuelve la URL de streaming pública. 
 * Si falla o está offline, hace fallback a Base64 local.
 */
export async function uploadVideoFile(file: File): Promise<string> {
  if (!hasSupabaseCredentials) {
    // Fallback local a Base64 offline
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  try {
    // 1. Asegurar la existencia del bucket público 'videos'
    try {
      await supabase.storage.createBucket('videos', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024 // Permitir hasta 50MB
      });
    } catch (_) {
      // Ignorar error si ya existe el bucket
    }

    // 2. Generar nombre de archivo único
    const fileExt = file.name.split('.').pop() || 'mp4';
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `reels/${fileName}`;

    // 3. Subir archivo
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // 4. Obtener URL de acceso público
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    if (urlData?.publicUrl) {
      return urlData.publicUrl;
    }

    throw new Error('No se pudo obtener la URL pública');
  } catch (err: any) {
    console.error('Error al subir video a Supabase Storage, fallback a Base64:', err);
    // Fallback a Base64 si falla el Storage (ej: RLS deshabilitado)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
}

/** Resetear todos los videos de la base de datos a sus valores iniciales rápidos */
export async function resetVideosToDefault(): Promise<VideoReel[]> {
  // Limpiar caché en memoria y local
  cachedVideos = DEFAULT_VIDEOS;
  saveLocalVideos(DEFAULT_VIDEOS);

  // Limpiar Supabase
  if (hasSupabaseCredentials) {
    try {
      // Eliminar registros existentes
      await supabase.from('videos_zapatillas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Volver a insertar la lista limpia por defecto
      const seededVideos = DEFAULT_VIDEOS.map(v => ({
        id: v.id,
        title: v.title,
        url: v.url,
        position: v.position,
        product_link: v.product_link || null,
        is_active: v.is_active
      }));
      await supabase.from('videos_zapatillas').insert(seededVideos);
    } catch (e) {
      console.error('Failed to reset videos in Supabase:', e);
    }
  }

  return DEFAULT_VIDEOS;
}

/** Agregar un video */
export async function addVideo(video: Omit<VideoReel, 'id' | 'created_at'>): Promise<VideoReel> {
  const newId = generateUUID(); // Generamos un UUID v4 válido
  const newVideo: VideoReel = {
    ...video,
    id: newId,
    created_at: new Date().toISOString()
  };

  // Guardar localmente y calentar caché
  const current = await getVideos();
  const nextList = [...current, newVideo];
  cachedVideos = nextList;
  saveLocalVideos(nextList);

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
  // Actualizar local y calentar caché
  const current = await getVideos();
  const nextList = current.map(v => v.id === updated.id ? updated : v);
  cachedVideos = nextList;
  saveLocalVideos(nextList);

  // Actualizar Supabase
  if (hasSupabaseCredentials) {
    try {
      // Usamos UPSERT en lugar de UPDATE para garantizar que si un video aún no existe
      // físicamente en la tabla de Supabase (por ejemplo, si se configuró después),
      // se cree directamente con su ID correcto sin fallar silenciosamente.
      const { error } = await supabase
        .from('videos_zapatillas')
        .upsert({
          id: updated.id,
          title: updated.title,
          url: updated.url,
          position: updated.position,
          product_link: updated.product_link || null,
          is_active: updated.is_active
        });

      if (error) {
        console.error('Supabase error updating/upserting video:', error.message);
      }
    } catch (e) {
      console.error('Failed to update/upsert video in Supabase:', e);
    }
  }
}

/** Eliminar un video */
export async function deleteVideo(id: string): Promise<void> {
  // Eliminar local y calentar caché
  const current = await getVideos();
  const nextList = current.filter(v => v.id !== id);
  cachedVideos = nextList;
  saveLocalVideos(nextList);

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
