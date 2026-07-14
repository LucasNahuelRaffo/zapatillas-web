// Thumbnails WebP generados por scripts/generate-thumbs.mjs (npm run thumbs).
// Solo aplica a las imágenes locales de /sneakers/; las URLs externas
// (ej. Supabase Storage) se devuelven tal cual.
export function thumbUrl(src: string): string {
  if (!src || !src.startsWith('/sneakers/')) return src
  if (src.startsWith('/sneakers/thumbs/')) return src
  return src
    .replace('/sneakers/', '/sneakers/thumbs/')
    .replace(/\.(jpe?g|png|webp)$/i, '.webp')
}
