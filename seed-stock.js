// Script para poblar stock_zapatillas en Supabase con todos los productos del catálogo
// Ejecutar con: node seed-stock.js

const SUPABASE_URL = 'https://jjjyalyyjqsksbigdfxf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_t9zI3Bb5ph9rwQBXQy3BMw_JoBP2Rci';

const SIZES = ['38', '39', '40', '41', '42', '43'];
const STOCK_DEFAULT = 5;
const PRECIO = 120000;

const PRODUCTS = [
  { name: 'Adidas Forum Low', colors: ['Blanco Azul', 'Blanco Negro', 'Blanco Verde'] },
  { name: 'Adidas Forum Low x Bad Bunny', colors: ['Azul'] },
  { name: 'Adidas Superstar', colors: ['Blanco Burdeos'] },
  { name: 'Amiri MA-1', colors: ['Blanco Lila'] },
  { name: 'Nike Air Force 1 High', colors: ['Blanco Naranja'] },
  { name: 'Nike Air Force 1 Low', colors: ['Blanco Negro', 'Blanco Turquesa', 'Negro', 'x Louis Vuitton'] },
  { name: 'Nike Air Griffey Max 1', colors: ['Negro Naranja', 'Negro Rojo Azul', 'Negro Total', 'Safari'] },
  { name: 'Nike Air Jordan 1 High', colors: ['Dusted Clay', 'Hyper Royal', 'Shattered Backboard', 'x Off-White Blanco'] },
  { name: 'Nike Air Jordan 1 Low', colors: ['Blanco Rojo', 'Blanco Total', 'Gris', 'White Cement'] },
  { name: 'Nike Air Jordan 11', colors: ['72-10 Negro', 'Bred', 'Concord Blanco Negro', 'Concord', 'Cool Grey', 'Gamma Blue', 'Gratitude DMP'] },
  { name: 'Nike Air Jordan 13', colors: ['Black Flint', 'Chicago Rojo', 'Flint Azul'] },
  { name: 'Nike Air Jordan 4', colors: ['Black Cat', 'Fire Red', 'Frozen Moments', 'Hot Punch Rosa', 'LE Neon 95', 'Rosa', 'University Blue', 'x Off-White Sail'] },
  { name: 'Nike Air Jordan 6', colors: ['Quai 54 Negro', 'Rings Naranja'] },
  { name: 'Nike Air Max 97', colors: ['Blanco Beige', 'Marrón Rosa', 'Negro', 'Verde Oliva'] },
  { name: 'Nike Air Max DN', colors: ['Beige', 'Blanco'] },
  { name: 'Nike Air Max Furyosa', colors: ['Multicolor Amarillo', 'Negro Animal Print', 'Negro Total', 'Negro Verde', 'Turquesa Rosa'] },
  { name: 'Nike Air Max Plus 3', colors: ['Morado Rosa'] },
  { name: 'Nike Air Max Plus TN', colors: ['Negro Blanco', 'Negro'] },
  { name: 'Nike Air More Uptempo', colors: ['Blanco Celeste', 'Blanco Negro Naranja', 'Gris Rojo', 'Italy Negro', 'Negro Morado'] },
  { name: 'Nike Air More Uptempo Low', colors: ['Blanco'] },
  { name: 'Nike Air VaporMax 2', colors: ['Negro Dorado'] },
  { name: 'Nike Air VaporMax 360', colors: ['Negro', 'Rosa'] },
  { name: 'Nike Dunk Low', colors: ['Azul Verde', 'Paisley Negro Blanco', 'Sun Club Multicolor'] },
  { name: 'Nike Shox NZ', colors: ['Blanco', 'Negro'] },
  { name: 'Nike Shox R4', colors: ['Blanco Plateado', 'Blanco', 'Negro'] },
  { name: 'Nike Shox Enigma', colors: ['Blanco'] },
  { name: 'Nike Shox R1', colors: ['Negro Plateado Rojo'] },
  { name: 'Nike Shox TL', colors: ['Blanco'] },
  { name: 'Valentino VL7N', colors: ['Blanco Rosa'] },
];

// Generar todas las filas
const rows = [];
for (const product of PRODUCTS) {
  for (const color of product.colors) {
    for (const talle of SIZES) {
      rows.push({
        modelo: product.name,
        color,
        talle,
        precio: PRECIO,
        stock: STOCK_DEFAULT,
      });
    }
  }
}

console.log(`Total filas a insertar: ${rows.length}`);

async function deleteOld() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock_zapatillas?id=gte.1`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (res.ok || res.status === 204) {
    console.log('Registros viejos eliminados.');
  } else {
    const text = await res.text();
    console.warn('No se pudieron eliminar registros viejos:', text);
  }
}

async function insertBatch(batch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock_zapatillas`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok && res.status !== 201) {
    const text = await res.text();
    throw new Error(`Error insertando batch: ${res.status} ${text}`);
  }
}

async function main() {
  await deleteOld();

  // Insertar en batches de 50
  const BATCH_SIZE = 50;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await insertBatch(batch);
    console.log(`Insertados ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length}`);
  }

  console.log('✓ Listo. Todos los productos cargados en stock_zapatillas.');
}

main().catch(console.error);
