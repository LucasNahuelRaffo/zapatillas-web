export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  subtitle?: string;
  description?: string;
  images: string[];
  sizes: { size: string; stock: boolean }[];
  colors: { name: string; hex: string; images: string[] }[];
  category: string;
}

const SIZES_DEFAULT = [
  { size: '38', stock: true },
  { size: '39', stock: true },
  { size: '40', stock: true },
  { size: '41', stock: true },
  { size: '42', stock: true },
  { size: '43', stock: true },
];

export const PRODUCTS: Product[] = [
  // ─── ADIDAS ───────────────────────────────────────────────────────────────
  {
    id: 1,
    brand: 'Adidas',
    name: 'Adidas Forum Low',
    subtitle: 'Calidad AAA • 3 colorways disponibles',
    price: 120000,
    description: 'La Adidas Forum Low es un clásico reinterpretado para el streetwear moderno. Corte bajo, suela de goma y la icónica tira de cierre lateral. Disponible en tres combinaciones exclusivas.',
    images: [
      '/sneakers/Adidas Forum Low Blanco Azul.jpeg',
      '/sneakers/Adidas Forum Low Blanco Negro.jpeg',
      '/sneakers/Adidas Forum Low Blanco Verde.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Azul', hex: '#1565C0', images: ['/sneakers/Adidas Forum Low Blanco Azul.jpeg'] },
      { name: 'Blanco Negro', hex: '#111111', images: ['/sneakers/Adidas Forum Low Blanco Negro.jpeg'] },
      { name: 'Blanco Verde', hex: '#2E7D32', images: ['/sneakers/Adidas Forum Low Blanco Verde.jpeg'] },
    ],
    category: 'Adidas',
  },
  {
    id: 2,
    brand: 'Adidas',
    name: 'Adidas Forum Low x Bad Bunny',
    subtitle: 'Calidad AAA • Collab exclusiva',
    price: 120000,
    description: 'La colaboración entre Adidas y Bad Bunny lleva la Forum Low a otro nivel. Detalles únicos, materiales premium y la energía del artista más grande del reggaetón.',
    images: ['/sneakers/Adidas Forum Low x Bad Bunny Azul.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Azul', hex: '#1565C0', images: ['/sneakers/Adidas Forum Low x Bad Bunny Azul.jpeg'] },
    ],
    category: 'Adidas',
  },
  {
    id: 3,
    brand: 'Adidas',
    name: 'Adidas Superstar',
    subtitle: 'Calidad AAA • Edición especial',
    price: 120000,
    description: 'La Adidas Superstar es una leyenda del calzado urbano desde 1969. Esta versión Blanco Burdeos combina el clásico shell toe con un colorway sofisticado y atemporal.',
    images: ['/sneakers/Adidas Superstar Blanco Burdeos.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Burdeos', hex: '#800020', images: ['/sneakers/Adidas Superstar Blanco Burdeos.jpeg'] },
    ],
    category: 'Adidas',
  },

  // ─── AMIRI ────────────────────────────────────────────────────────────────
  {
    id: 4,
    brand: 'Amiri',
    name: 'Amiri MA-1',
    subtitle: 'Calidad AAA • Lujo streetwear',
    price: 120000,
    description: 'La Amiri MA-1 es la definición del lujo streetwear. Materiales de cuero premium, construcción artesanal y el logo icónico de la marca. Una pieza codiciada por coleccionistas.',
    images: ['/sneakers/Amiri MA-1 Blanco Lila.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Lila', hex: '#9C27B0', images: ['/sneakers/Amiri MA-1 Blanco Lila.jpeg'] },
    ],
    category: 'Amiri',
  },

  // ─── NIKE AIR FORCE 1 ─────────────────────────────────────────────────────
  {
    id: 5,
    brand: 'Nike',
    name: 'Nike Air Force 1 High',
    subtitle: 'Calidad AAA • Corte alto clásico',
    price: 120000,
    description: 'La Nike Air Force 1 High en Blanco Naranja trae el calor del verano a un diseño atemporal. Corte alto, suela de aire visible y cuero de primera calidad.',
    images: ['/sneakers/Nike Air Force 1 High Blanco Naranja.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Naranja', hex: '#FF6F00', images: ['/sneakers/Nike Air Force 1 High Blanco Naranja.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 6,
    brand: 'Nike',
    name: 'Nike Air Force 1 Low',
    subtitle: 'Calidad AAA • 4 colorways disponibles',
    price: 120000,
    description: 'La Nike Air Force 1 Low es el sneaker más vendido de la historia. Corte bajo, cuero premium y amortiguación Air que nunca falla. Incluye la edición x Louis Vuitton.',
    images: [
      '/sneakers/Nike Air Force 1 Low Blanco Negro.jpeg',
      '/sneakers/Nike Air Force 1 Low Blanco Turquesa.jpeg',
      '/sneakers/Nike Air Force 1 Low Negro.jpeg',
      '/sneakers/Nike Air Force 1 Low x Louis Vuitton.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Negro', hex: '#111111', images: ['/sneakers/Nike Air Force 1 Low Blanco Negro.jpeg'] },
      { name: 'Blanco Turquesa', hex: '#00BCD4', images: ['/sneakers/Nike Air Force 1 Low Blanco Turquesa.jpeg'] },
      { name: 'Negro', hex: '#111111', images: ['/sneakers/Nike Air Force 1 Low Negro.jpeg'] },
      { name: 'x Louis Vuitton', hex: '#D4AF37', images: ['/sneakers/Nike Air Force 1 Low x Louis Vuitton.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE AIR GRIFFEY MAX 1 ───────────────────────────────────────────────
  {
    id: 7,
    brand: 'Nike',
    name: 'Nike Air Griffey Max 1',
    subtitle: 'Calidad AAA • 4 colorways disponibles',
    price: 120000,
    description: 'La Nike Air Griffey Max 1, la zapatilla del beisbolista más icónico de todos los tiempos. Diseño retro con amortiguación Air Max, disponible en cuatro colorways únicos.',
    images: [
      '/sneakers/Nike Air Griffey Max 1 Negro Naranja.jpeg',
      '/sneakers/Nike Air Griffey Max 1 Negro Rojo Azul.jpeg',
      '/sneakers/Nike Air Griffey Max 1 Negro Total.jpeg',
      '/sneakers/Nike Air Griffey Max 1 Safari.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Negro Naranja', hex: '#FF6F00', images: ['/sneakers/Nike Air Griffey Max 1 Negro Naranja.jpeg'] },
      { name: 'Negro Rojo Azul', hex: '#E53935', images: ['/sneakers/Nike Air Griffey Max 1 Negro Rojo Azul.jpeg'] },
      { name: 'Negro Total', hex: '#111111', images: ['/sneakers/Nike Air Griffey Max 1 Negro Total.jpeg'] },
      { name: 'Safari', hex: '#8D6E63', images: ['/sneakers/Nike Air Griffey Max 1 Safari.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE AIR JORDAN 1 HIGH ───────────────────────────────────────────────
  {
    id: 8,
    brand: 'Jordan',
    name: 'Nike Air Jordan 1 High',
    subtitle: 'Calidad AAA • 4 colorways disponibles',
    price: 120000,
    description: 'La Air Jordan 1 High es el sneaker más influyente de la historia. Cada colorway es una obra maestra: Dusted Clay, Hyper Royal, Shattered Backboard y la codiciada x Off-White.',
    images: [
      '/sneakers/Nike Air Jordan 1 High Dusted Clay.jpeg',
      '/sneakers/Nike Air Jordan 1 High Hyper Royal.jpeg',
      '/sneakers/Nike Air Jordan 1 High Shattered Backboard.jpeg',
      '/sneakers/Nike Air Jordan 1 High x Off-White Blanco.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Dusted Clay', hex: '#C19A6B', images: ['/sneakers/Nike Air Jordan 1 High Dusted Clay.jpeg'] },
      { name: 'Hyper Royal', hex: '#1565C0', images: ['/sneakers/Nike Air Jordan 1 High Hyper Royal.jpeg'] },
      { name: 'Shattered Backboard', hex: '#FF6F00', images: ['/sneakers/Nike Air Jordan 1 High Shattered Backboard.jpeg'] },
      { name: 'x Off-White Blanco', hex: '#FFFFFF', images: ['/sneakers/Nike Air Jordan 1 High x Off-White Blanco.jpeg'] },
    ],
    category: 'Jordan',
  },

  // ─── NIKE AIR JORDAN 1 LOW ────────────────────────────────────────────────
  {
    id: 9,
    brand: 'Jordan',
    name: 'Nike Air Jordan 1 Low',
    subtitle: 'Calidad AAA • 4 colorways disponibles',
    price: 120000,
    description: 'La Air Jordan 1 Low lleva el DNA de la Jordan 1 en un perfil bajo perfecto para el día a día. Cuatro colorways clásicos para todos los estilos.',
    images: [
      '/sneakers/Nike Air Jordan 1 Low Blanco Rojo.jpeg',
      '/sneakers/Nike Air Jordan 1 Low Blanco Total.jpeg',
      '/sneakers/Nike Air Jordan 1 Low Gris.jpeg',
      '/sneakers/Nike Air Jordan 1 Low White Cement.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Rojo', hex: '#E53935', images: ['/sneakers/Nike Air Jordan 1 Low Blanco Rojo.jpeg'] },
      { name: 'Blanco Total', hex: '#FFFFFF', images: ['/sneakers/Nike Air Jordan 1 Low Blanco Total.jpeg'] },
      { name: 'Gris', hex: '#9E9E9E', images: ['/sneakers/Nike Air Jordan 1 Low Gris.jpeg'] },
      { name: 'White Cement', hex: '#BDBDBD', images: ['/sneakers/Nike Air Jordan 1 Low White Cement.jpeg'] },
    ],
    category: 'Jordan',
  },

  // ─── NIKE AIR JORDAN 11 ───────────────────────────────────────────────────
  {
    id: 10,
    brand: 'Jordan',
    name: 'Nike Air Jordan 11',
    subtitle: 'Calidad AAA • 7 colorways disponibles',
    price: 120000,
    description: 'La Air Jordan 11 es la silueta más lujosa de toda la línea Jordan. Cuero patentado, cordones Jumpman y una presencia en cancha inigualable. Siete ediciones para elegir.',
    images: [
      '/sneakers/Nike Air Jordan 11 72-10 Negro.jpeg',
      '/sneakers/Nike Air Jordan 11 Bred.jpeg',
      '/sneakers/Nike Air Jordan 11 Concord Blanco Negro.jpeg',
      '/sneakers/Nike Air Jordan 11 Concord.jpeg',
      '/sneakers/Nike Air Jordan 11 Cool Grey.jpeg',
      '/sneakers/Nike Air Jordan 11 Gamma Blue.jpeg',
      '/sneakers/Nike Air Jordan 11 Gratitude DMP.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: '72-10 Negro', hex: '#111111', images: ['/sneakers/Nike Air Jordan 11 72-10 Negro.jpeg'] },
      { name: 'Bred', hex: '#E53935', images: ['/sneakers/Nike Air Jordan 11 Bred.jpeg'] },
      { name: 'Concord Blanco Negro', hex: '#111111', images: ['/sneakers/Nike Air Jordan 11 Concord Blanco Negro.jpeg'] },
      { name: 'Concord', hex: '#FFFFFF', images: ['/sneakers/Nike Air Jordan 11 Concord.jpeg'] },
      { name: 'Cool Grey', hex: '#9E9E9E', images: ['/sneakers/Nike Air Jordan 11 Cool Grey.jpeg'] },
      { name: 'Gamma Blue', hex: '#1565C0', images: ['/sneakers/Nike Air Jordan 11 Gamma Blue.jpeg'] },
      { name: 'Gratitude DMP', hex: '#C19A6B', images: ['/sneakers/Nike Air Jordan 11 Gratitude DMP.jpeg'] },
    ],
    category: 'Jordan',
  },

  // ─── NIKE AIR JORDAN 13 ───────────────────────────────────────────────────
  {
    id: 11,
    brand: 'Jordan',
    name: 'Nike Air Jordan 13',
    subtitle: 'Calidad AAA • 3 colorways disponibles',
    price: 120000,
    description: 'La Air Jordan 13 fue inspirada en la pantera negra, el animal totémico de Michael Jordan. Diseño futurista, suela translúcida y tres colorways clásicos.',
    images: [
      '/sneakers/Nike Air Jordan 13 Black Flint.jpeg',
      '/sneakers/Nike Air Jordan 13 Chicago Rojo.jpeg',
      '/sneakers/Nike Air Jordan 13 Flint Azul.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Black Flint', hex: '#111111', images: ['/sneakers/Nike Air Jordan 13 Black Flint.jpeg'] },
      { name: 'Chicago Rojo', hex: '#E53935', images: ['/sneakers/Nike Air Jordan 13 Chicago Rojo.jpeg'] },
      { name: 'Flint Azul', hex: '#1565C0', images: ['/sneakers/Nike Air Jordan 13 Flint Azul.jpeg'] },
    ],
    category: 'Jordan',
  },

  // ─── NIKE AIR JORDAN 4 ────────────────────────────────────────────────────
  {
    id: 12,
    brand: 'Jordan',
    name: 'Nike Air Jordan 4',
    subtitle: 'Calidad AAA • 8 colorways disponibles',
    price: 120000,
    description: 'La Air Jordan 4 es una de las siluetas más buscadas del mundo sneaker. Malla en el upper, alas laterales y suela visible de Air. Ocho colorways incluyendo la codiciada x Off-White.',
    images: [
      '/sneakers/Nike Air Jordan 4 Black Cat.jpeg',
      '/sneakers/Nike Air Jordan 4 Fire Red.jpeg',
      '/sneakers/Nike Air Jordan 4 Frozen Moments Gris.jpeg',
      '/sneakers/Nike Air Jordan 4 Hot Punch Rosa.jpeg',
      '/sneakers/Nike Air Jordan 4 LE Neon 95.jpeg',
      '/sneakers/Nike Air Jordan 4 Rosa.jpeg',
      '/sneakers/Nike Air Jordan 4 University Blue.jpeg',
      '/sneakers/Nike Air Jordan 4 x Off-White Sail.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Black Cat', hex: '#111111', images: ['/sneakers/Nike Air Jordan 4 Black Cat.jpeg'] },
      { name: 'Fire Red', hex: '#E53935', images: ['/sneakers/Nike Air Jordan 4 Fire Red.jpeg'] },
      { name: 'Frozen Moments', hex: '#9E9E9E', images: ['/sneakers/Nike Air Jordan 4 Frozen Moments Gris.jpeg'] },
      { name: 'Hot Punch Rosa', hex: '#E91E63', images: ['/sneakers/Nike Air Jordan 4 Hot Punch Rosa.jpeg'] },
      { name: 'LE Neon 95', hex: '#CDDC39', images: ['/sneakers/Nike Air Jordan 4 LE Neon 95.jpeg'] },
      { name: 'Rosa', hex: '#F48FB1', images: ['/sneakers/Nike Air Jordan 4 Rosa.jpeg'] },
      { name: 'University Blue', hex: '#1565C0', images: ['/sneakers/Nike Air Jordan 4 University Blue.jpeg'] },
      { name: 'x Off-White Sail', hex: '#F5F0E8', images: ['/sneakers/Nike Air Jordan 4 x Off-White Sail.jpeg'] },
    ],
    category: 'Jordan',
  },

  // ─── NIKE AIR JORDAN 6 ────────────────────────────────────────────────────
  {
    id: 13,
    brand: 'Jordan',
    name: 'Nike Air Jordan 6',
    subtitle: 'Calidad AAA • 2 colorways disponibles',
    price: 120000,
    description: 'La Air Jordan 6 fue el modelo con el que Michael Jordan ganó su primer campeonato de la NBA en 1991. Tiradores de goma, ventana de Air visible y dos colorways únicos.',
    images: [
      '/sneakers/Nike Air Jordan 6 Quai 54 Negro.jpeg',
      '/sneakers/Nike Air Jordan 6 Rings Naranja.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Quai 54 Negro', hex: '#111111', images: ['/sneakers/Nike Air Jordan 6 Quai 54 Negro.jpeg'] },
      { name: 'Rings Naranja', hex: '#FF6F00', images: ['/sneakers/Nike Air Jordan 6 Rings Naranja.jpeg'] },
    ],
    category: 'Jordan',
  },

  // ─── NIKE AIR MAX 97 ──────────────────────────────────────────────────────
  {
    id: 14,
    brand: 'Nike',
    name: 'Nike Air Max 97',
    subtitle: 'Calidad AAA • 4 colorways disponibles',
    price: 120000,
    description: 'La Nike Air Max 97 con su icónico diseño de olas metálicas y cámara de aire visible en toda la suela. Cuatro colorways trendy para cada estilo.',
    images: [
      '/sneakers/Nike Air Max 97 Blanco Beige.jpeg',
      '/sneakers/Nike Air Max 97 Marron Rosa.jpeg',
      '/sneakers/Nike Air Max 97 Negro.jpeg',
      '/sneakers/Nike Air Max 97 Verde Oliva.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Beige', hex: '#F5F0E8', images: ['/sneakers/Nike Air Max 97 Blanco Beige.jpeg'] },
      { name: 'Marrón Rosa', hex: '#795548', images: ['/sneakers/Nike Air Max 97 Marron Rosa.jpeg'] },
      { name: 'Negro', hex: '#111111', images: ['/sneakers/Nike Air Max 97 Negro.jpeg'] },
      { name: 'Verde Oliva', hex: '#558B2F', images: ['/sneakers/Nike Air Max 97 Verde Oliva.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE AIR MAX DN ──────────────────────────────────────────────────────
  {
    id: 15,
    brand: 'Nike',
    name: 'Nike Air Max DN',
    subtitle: 'Calidad AAA • 2 colorways disponibles',
    price: 120000,
    description: 'La Nike Air Max DN es la evolución futurista del sistema Air. Diseño moderno, líneas fluidas y cámara de doble nivel de nitrógeno para máxima amortiguación.',
    images: [
      '/sneakers/Nike Air Max DN Beige.jpeg',
      '/sneakers/Nike Air Max DN Blanco.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Beige', hex: '#F5F0E8', images: ['/sneakers/Nike Air Max DN Beige.jpeg'] },
      { name: 'Blanco', hex: '#FFFFFF', images: ['/sneakers/Nike Air Max DN Blanco.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE AIR MAX FURYOSA ─────────────────────────────────────────────────
  {
    id: 16,
    brand: 'Nike',
    name: 'Nike Air Max Furyosa',
    subtitle: 'Calidad AAA • 5 colorways disponibles',
    price: 120000,
    description: 'La Nike Air Max Furyosa es atrevida, audaz y sin miedo. Cinco colorways que van del negro total al turquesa rosa, pasando por prints animales y multicolores imposibles de ignorar.',
    images: [
      '/sneakers/Nike Air Max Furyosa Multicolor Amarillo.jpeg',
      '/sneakers/Nike Air Max Furyosa Negro Animal Print.jpeg',
      '/sneakers/Nike Air Max Furyosa Negro Total.jpeg',
      '/sneakers/Nike Air Max Furyosa Negro Verde.jpeg',
      '/sneakers/Nike Air Max Furyosa Turquesa Rosa.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Multicolor Amarillo', hex: '#FDD835', images: ['/sneakers/Nike Air Max Furyosa Multicolor Amarillo.jpeg'] },
      { name: 'Negro Animal Print', hex: '#5D4037', images: ['/sneakers/Nike Air Max Furyosa Negro Animal Print.jpeg'] },
      { name: 'Negro Total', hex: '#111111', images: ['/sneakers/Nike Air Max Furyosa Negro Total.jpeg'] },
      { name: 'Negro Verde', hex: '#2E7D32', images: ['/sneakers/Nike Air Max Furyosa Negro Verde.jpeg'] },
      { name: 'Turquesa Rosa', hex: '#00BCD4', images: ['/sneakers/Nike Air Max Furyosa Turquesa Rosa.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE AIR MAX PLUS ────────────────────────────────────────────────────
  {
    id: 17,
    brand: 'Nike',
    name: 'Nike Air Max Plus 3',
    subtitle: 'Calidad AAA • Edición especial',
    price: 120000,
    description: 'La Nike Air Max Plus 3 combina la silueta TN clásica con una tercera unidad de Air visible. Colorway Morado Rosa vibrante e imposible de pasar desapercibido.',
    images: ['/sneakers/Nike Air Max Plus 3 Morado Rosa.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Morado Rosa', hex: '#6A1B9A', images: ['/sneakers/Nike Air Max Plus 3 Morado Rosa.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 18,
    brand: 'Nike',
    name: 'Nike Air Max Plus TN',
    subtitle: 'Calidad AAA • 2 colorways disponibles',
    price: 120000,
    description: 'La Nike Air Max Plus TN, también conocida como la "Tuned Air", es un símbolo del estilo urbano. Líneas aerodinámicas, Air visible y dos colorways negros para todas las ocasiones.',
    images: [
      '/sneakers/Nike Air Max Plus TN Negro Blanco.jpeg',
      '/sneakers/Nike Air Max Plus TN Negro.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Negro Blanco', hex: '#111111', images: ['/sneakers/Nike Air Max Plus TN Negro Blanco.jpeg'] },
      { name: 'Negro', hex: '#111111', images: ['/sneakers/Nike Air Max Plus TN Negro.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE AIR MORE UPTEMPO ────────────────────────────────────────────────
  {
    id: 19,
    brand: 'Nike',
    name: 'Nike Air More Uptempo',
    subtitle: 'Calidad AAA • 5 colorways disponibles',
    price: 120000,
    description: 'La Nike Air More Uptempo es la zapatilla más bold de la historia: la palabra AIR gigante bordada en el lateral. Cinco colorways incluyendo la codiciada Italy Negro.',
    images: [
      '/sneakers/Nike Air More Uptempo Blanco Celeste.jpeg',
      '/sneakers/Nike Air More Uptempo Blanco Negro Naranja.jpeg',
      '/sneakers/Nike Air More Uptempo Gris Rojo.jpeg',
      '/sneakers/Nike Air More Uptempo Italy Negro.jpeg',
      '/sneakers/Nike Air More Uptempo Negro Morado.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Celeste', hex: '#00B0FF', images: ['/sneakers/Nike Air More Uptempo Blanco Celeste.jpeg'] },
      { name: 'Blanco Negro Naranja', hex: '#FFFFFF', images: ['/sneakers/Nike Air More Uptempo Blanco Negro Naranja.jpeg'] },
      { name: 'Gris Rojo', hex: '#E53935', images: ['/sneakers/Nike Air More Uptempo Gris Rojo.jpeg'] },
      { name: 'Italy Negro', hex: '#111111', images: ['/sneakers/Nike Air More Uptempo Italy Negro.jpeg'] },
      { name: 'Negro Morado', hex: '#6A1B9A', images: ['/sneakers/Nike Air More Uptempo Negro Morado.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 20,
    brand: 'Nike',
    name: 'Nike Air More Uptempo Low',
    subtitle: 'Calidad AAA • Corte bajo',
    price: 120000,
    description: 'La versión Low de la icónica Nike Air More Uptempo. La misma statement con el AIR bordado en un perfil más bajo y cotidiano. Colorway Blanco total.',
    images: ['/sneakers/Nike Air More Uptempo Low Blanco.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco', hex: '#FFFFFF', images: ['/sneakers/Nike Air More Uptempo Low Blanco.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE AIR VAPORMAX ────────────────────────────────────────────────────
  {
    id: 21,
    brand: 'Nike',
    name: 'Nike Air VaporMax 2',
    subtitle: 'Calidad AAA • Edición especial',
    price: 120000,
    description: 'La Nike Air VaporMax 2 lleva la amortiguación al máximo. Suela completamente de Air sin espuma intermedia, upper de Flyknit y el exclusivo colorway Negro Dorado.',
    images: ['/sneakers/Nike Air VaporMax 2 Negro Dorado.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Negro Dorado', hex: '#FFD700', images: ['/sneakers/Nike Air VaporMax 2 Negro Dorado.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 22,
    brand: 'Nike',
    name: 'Nike Air VaporMax 360',
    subtitle: 'Calidad AAA • 2 colorways disponibles',
    price: 120000,
    description: 'La Nike Air VaporMax 360 fusiona la tecnología Air 360 con el diseño futurista de la VaporMax. Vista de Air en 360 grados y dos colorways para elegir.',
    images: [
      '/sneakers/Nike Air VaporMax 360 Negro.jpeg',
      '/sneakers/Nike Air VaporMax 360 Rosa.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Negro', hex: '#111111', images: ['/sneakers/Nike Air VaporMax 360 Negro.jpeg'] },
      { name: 'Rosa', hex: '#E91E63', images: ['/sneakers/Nike Air VaporMax 360 Rosa.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE DUNK LOW ────────────────────────────────────────────────────────
  {
    id: 23,
    brand: 'Nike',
    name: 'Nike Dunk Low',
    subtitle: 'Calidad AAA • 3 colorways disponibles',
    price: 120000,
    description: 'La Nike Dunk Low es el sneaker del momento. Nacida en las canchas de basket en los 80s, hoy es la reina del streetwear global. Tres colorways únicos incluyendo Sun Club y Paisley.',
    images: [
      '/sneakers/Nike Dunk Low Azul Verde.jpeg',
      '/sneakers/Nike Dunk Low Paisley Negro Blanco.jpeg',
      '/sneakers/Nike Dunk Low Sun Club Multicolor.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Azul Verde', hex: '#1565C0', images: ['/sneakers/Nike Dunk Low Azul Verde.jpeg'] },
      { name: 'Paisley Negro Blanco', hex: '#111111', images: ['/sneakers/Nike Dunk Low Paisley Negro Blanco.jpeg'] },
      { name: 'Sun Club Multicolor', hex: '#FF6F00', images: ['/sneakers/Nike Dunk Low Sun Club Multicolor.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── NIKE SHOX ────────────────────────────────────────────────────────────
  {
    id: 24,
    brand: 'Nike',
    name: 'Nike Shox NZ',
    subtitle: 'Calidad AAA • 2 colorways disponibles',
    price: 120000,
    description: 'La Nike Shox NZ con su tecnología de columnas de espuma de alta densidad que revolucionó la amortiguación. Disponible en Blanco y Negro.',
    images: [
      '/sneakers/Nike Shox NZ Blanco.jpeg',
      '/sneakers/Nike Shox NZ Negro.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco', hex: '#FFFFFF', images: ['/sneakers/Nike Shox NZ Blanco.jpeg'] },
      { name: 'Negro', hex: '#111111', images: ['/sneakers/Nike Shox NZ Negro.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 25,
    brand: 'Nike',
    name: 'Nike Shox R4',
    subtitle: 'Calidad AAA • 3 colorways disponibles',
    price: 120000,
    description: 'La Nike Shox R4 es la silueta Shox más icónica. Cuatro columnas traseras, upper de cuero y mesh. Disponible en Blanco Plateado, Blanco total y Negro.',
    images: [
      '/sneakers/Nike Shox R4 Blanco Plateado.jpeg',
      '/sneakers/Nike Shox R4 Blanco.jpeg',
      '/sneakers/Nike Shox R4 Negro.jpeg',
    ],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Plateado', hex: '#BDBDBD', images: ['/sneakers/Nike Shox R4 Blanco Plateado.jpeg'] },
      { name: 'Blanco', hex: '#FFFFFF', images: ['/sneakers/Nike Shox R4 Blanco.jpeg'] },
      { name: 'Negro', hex: '#111111', images: ['/sneakers/Nike Shox R4 Negro.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 26,
    brand: 'Nike',
    name: 'Nike Shox Enigma',
    subtitle: 'Calidad AAA • Edición especial',
    price: 120000,
    description: 'La Nike Shox Enigma combina el sistema de columnas Shox con un diseño enigmático y moderno. Colorway Blanco total para máxima versatilidad.',
    images: ['/sneakers/Nike Shox Enigma Blanco.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco', hex: '#FFFFFF', images: ['/sneakers/Nike Shox Enigma Blanco.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 27,
    brand: 'Nike',
    name: 'Nike Shox R1',
    subtitle: 'Calidad AAA • Edición especial',
    price: 120000,
    description: 'La Nike Shox R1, el modelo original que inició la revolución Shox. Colorway Negro Plateado Rojo para una presencia imponente en cada paso.',
    images: ['/sneakers/Nike Shox R1 Negro Plateado Rojo.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Negro Plateado Rojo', hex: '#E53935', images: ['/sneakers/Nike Shox R1 Negro Plateado Rojo.jpeg'] },
    ],
    category: 'Nike',
  },
  {
    id: 28,
    brand: 'Nike',
    name: 'Nike Shox TL',
    subtitle: 'Calidad AAA • Edición especial',
    price: 120000,
    description: 'La Nike Shox TL, la versión más refinada de la línea Shox. Upper de cuero full, columnas cromadas y el exclusivo colorway Blanco que la hace única.',
    images: ['/sneakers/Nike Shox TL Blanco.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco', hex: '#FFFFFF', images: ['/sneakers/Nike Shox TL Blanco.jpeg'] },
    ],
    category: 'Nike',
  },

  // ─── VALENTINO ────────────────────────────────────────────────────────────
  {
    id: 29,
    brand: 'Valentino',
    name: 'Valentino VL7N',
    subtitle: 'Calidad AAA • Alta moda italiana',
    price: 120000,
    description: 'La Valentino VL7N es la fusión perfecta entre la alta costura italiana y el sneaker culture. Logo Valentino Garavani, materiales premium y el exclusivo colorway Blanco Rosa.',
    images: ['/sneakers/Valentino VL7N Blanco Rosa.jpeg'],
    sizes: SIZES_DEFAULT,
    colors: [
      { name: 'Blanco Rosa', hex: '#E91E63', images: ['/sneakers/Valentino VL7N Blanco Rosa.jpeg'] },
    ],
    category: 'Valentino',
  },
];
