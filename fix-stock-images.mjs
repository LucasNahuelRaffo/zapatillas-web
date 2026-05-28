import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && key.trim()) env[key.trim()] = value.join('=').trim();
});

const supabase = createClient(
  env['VITE_SUPABASE_URL'],
  env['VITE_SUPABASE_PUBLISHABLE_KEY']
);

const SITE_BASE_URL = 'https://tuviejasneakers.com';
function toAbsoluteUrl(p) {
  if (!p || p.startsWith('http') || p.startsWith('data:')) return p;
  return `${SITE_BASE_URL}${p}`;
}

async function main() {
  console.log('Leyendo catálogo...');
  const { data: catalogo, error: catError } = await supabase
    .from('catalogo_zapatillas')
    .select('name, images, colors');
  if (catError) { console.error('Error leyendo catálogo:', catError.message); process.exit(1); }

  // Índice rápido: modelo -> datos del catálogo
  const catalogoMap = {};
  for (const prod of catalogo) {
    catalogoMap[prod.name] = prod;
  }

  console.log('Leyendo stock sin imagen...');
  const { data: stockSinImg, error: stockError } = await supabase
    .from('stock_zapatillas')
    .select('id, modelo, color, imagen_url')
    .or('imagen_url.is.null,imagen_url.eq.');
  if (stockError) { console.error('Error leyendo stock:', stockError.message); process.exit(1); }

  console.log(`Filas de stock sin imagen: ${stockSinImg.length}`);
  if (stockSinImg.length === 0) {
    console.log('Nada que reparar.');
    return;
  }

  let actualizados = 0;
  let sinCoincidencia = 0;

  for (const row of stockSinImg) {
    const prod = catalogoMap[row.modelo];
    if (!prod) { sinCoincidencia++; continue; }

    // Buscar imagen del color específico
    const colorEntry = (prod.colors || []).find(
      c => c.name?.toLowerCase() === row.color?.toLowerCase()
    );
    const rawImg = colorEntry?.images?.[0] || prod.images?.[0] || null;
    const imgUrl = rawImg ? toAbsoluteUrl(rawImg) : null;

    if (!imgUrl) { sinCoincidencia++; continue; }

    const { error: updateError } = await supabase
      .from('stock_zapatillas')
      .update({ imagen_url: imgUrl })
      .eq('id', row.id);

    if (updateError) {
      console.error(`Error actualizando fila id=${row.id}:`, updateError.message);
    } else {
      actualizados++;
    }
  }

  console.log(`✓ Actualizados: ${actualizados}`);
  if (sinCoincidencia > 0) {
    console.log(`⚠ Sin coincidencia en catálogo: ${sinCoincidencia}`);
  }
}

main();
