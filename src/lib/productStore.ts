import { supabase, hasSupabaseCredentials } from './supabase';
import { Product, PRODUCTS } from '../data/products';

const STORAGE_KEY = 'zapass_products';

/** Leer productos del localStorage, con fallback a los estáticos */
export function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Product[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return PRODUCTS;
}

export function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (_) {}
}

export function addLocalProduct(product: Omit<Product, 'id'>): Product {
  const existing = getLocalProducts();
  const newId = existing.length > 0 ? Math.max(...existing.map(p => p.id)) + 1 : 1;
  const newProduct: Product = { ...product, id: newId } as Product;
  saveLocalProducts([...existing, newProduct]);
  return newProduct;
}

export function updateLocalProduct(updated: Product): void {
  const existing = getLocalProducts();
  saveLocalProducts(existing.map(p => p.id === updated.id ? updated : p));
}

export function deleteLocalProduct(id: number): void {
  saveLocalProducts(getLocalProducts().filter(p => p.id !== id));
}

/**
 * Sube una imagen al bucket 'product-images' de Supabase Storage.
 * Si falla o no hay credenciales, hace fallback a DataURL local.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!hasSupabaseCredentials) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
  try {
    try {
      await supabase.storage.createBucket('product-images', { public: true });
    } catch (_) {}
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '31536000', upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    if (urlData?.publicUrl) return urlData.publicUrl;
    throw new Error('No public URL');
  } catch (err) {
    console.error('Image upload failed, falling back to DataURL:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
}

export const SITE_BASE_URL = 'https://lucasnahuelraffo.github.io/Za-Pass'

export function toAbsoluteUrl(path: string): string {
  if (!path || path.startsWith('http') || path.startsWith('data:')) return path
  return `${SITE_BASE_URL}${path}`
}

/**
 * Guarda (upsert) un producto completo en la tabla catalogo_zapatillas de Supabase.
 * Incluye colores con sus imágenes específicas. Las rutas relativas se convierten a URLs absolutas.
 */
export async function saveProductToSupabase(product: Product): Promise<void> {
  if (!hasSupabaseCredentials) return;
  try {
    const { error } = await supabase.from('catalogo_zapatillas').upsert({
      id: product.id,
      brand: product.brand,
      name: product.name,
      price: product.price,
      subtitle: product.subtitle ?? '',
      description: product.description ?? '',
      category: product.category ?? product.brand,
      images: product.images.map(toAbsoluteUrl),
      colors: product.colors.map(c => ({ ...c, images: c.images.map(toAbsoluteUrl) })),
      sizes: product.sizes,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error('Error saving product to Supabase:', error.message);
  } catch (e) {
    console.error('Failed to save product to Supabase:', e);
  }
}

/** Elimina un producto de catalogo_zapatillas */
export async function deleteProductFromSupabase(id: number): Promise<void> {
  if (!hasSupabaseCredentials) return;
  try {
    const { error } = await supabase.from('catalogo_zapatillas').delete().eq('id', id);
    if (error) console.error('Error deleting product from Supabase:', error.message);
  } catch (e) {
    console.error('Failed to delete product from Supabase:', e);
  }
}

/**
 * Lee productos desde Supabase (fuente de verdad), con fallback a localStorage.
 * También actualiza el localStorage como caché local.
 */
export async function getProducts(): Promise<Product[]> {
  if (!hasSupabaseCredentials) return getLocalProducts();
  try {
    const { data, error } = await supabase
      .from('catalogo_zapatillas')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      saveLocalProducts(data as Product[]);
      return data as Product[];
    }

    if (!error && data && data.length === 0) {
      // Tabla vacía: sembrar todos los productos locales en Supabase
      const local = getLocalProducts();
      const rows = local.map(p => ({
        id: p.id,
        brand: p.brand,
        name: p.name,
        price: p.price,
        subtitle: p.subtitle ?? '',
        description: p.description ?? '',
        category: p.category ?? p.brand,
        images: p.images.map(toAbsoluteUrl),
        colors: p.colors.map(c => ({ ...c, images: c.images.map(toAbsoluteUrl) })),
        sizes: p.sizes,
      }));
      const { error: insertError } = await supabase.from('catalogo_zapatillas').insert(rows);
      if (insertError) {
        console.error('Error al sembrar catálogo en Supabase:', insertError.message);
      }
      return local;
    }
  } catch (e) {
    console.error('Failed to fetch products from Supabase:', e);
  }
  return getLocalProducts();
}
