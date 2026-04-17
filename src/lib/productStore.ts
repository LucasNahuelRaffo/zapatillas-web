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
