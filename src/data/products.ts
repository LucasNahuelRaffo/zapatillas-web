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

import jordanNew from '../img/jordan_1_new.png';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    brand: 'Jordan',
    name: 'Jordan 1 Retro High OG',
    subtitle: 'Calidad AAA • Triple White Collection',
    price: 180000,
    description: 'La Jordan 1 Retro High OG es un ícono de la cultura sneaker. Esta versión cuenta con materiales de primera calidad y una combinación de colores clásica que nunca pasa de moda.',
    images: [
      'https://images.unsplash.com/photo-1556906781-9a414e2a9c5f?w=800&q=80', 
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'
    ],
    sizes: [
      { size: '7', stock: true },
      { size: '7.5', stock: true },
      { size: '8', stock: true },
      { size: '8.5', stock: true },
      { size: '9', stock: true },
      { size: '9.5', stock: true },
      { size: '10', stock: false },
      { size: '11', stock: true },
    ],
    colors: [
      { name: 'Brown', hex: '#8B4513', images: ['https://images.unsplash.com/photo-1556906781-9a414e2a9c5f?w=800&q=80'] },
      { name: 'Black/White', hex: '#000000', images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80'] },
      { name: 'Panda', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'] },
    ],
    category: 'Jordan',
  },
  {
    id: 2, brand: 'Jordan',
    name: 'Jordan 1 Mid SE',
    price: 140000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    sizes: [{ size: '40', stock: true }, { size: '41', stock: true }],
    colors: [{ name: 'White', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80'] }],
    category: 'Jordan',
  },
  {
    id: 3, brand: 'Jordan',
    name: 'Jordan 1 Low',
    price: 125000,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80'],
    sizes: [{ size: '39', stock: true }, { size: '41', stock: true }],
    colors: [{ name: 'Blue', hex: '#1565C0', images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=100&q=80'] }],
    category: 'Jordan',
  },
  {
    id: 4, brand: 'Nike',
    name: 'Nike Dunk Low Retro',
    price: 115000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    sizes: [{ size: '38', stock: true }, { size: '39', stock: true }],
    colors: [{ name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80'] }],
    category: 'Nike',
  },
  {
    id: 5, brand: 'Nike',
    name: 'Nike Air Max 97',
    price: 180000,
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80'],
    sizes: [{ size: '40', stock: true }, { size: '42', stock: true }],
    colors: [{ name: 'Gray', hex: '#9E9E9E', images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=100&q=80'] }],
    category: 'Nike',
  },
  {
    id: 6, brand: 'Nike',
    name: 'Nike Air Max 90',
    price: 133000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    sizes: [{ size: '38', stock: true }, { size: '40', stock: true }],
    colors: [{ name: 'White', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80'] }],
    category: 'Nike',
  },
  {
    id: 7, brand: 'Travis Scott',
    name: 'Travis Scott x Jordan',
    price: 260000,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'],
    sizes: [{ size: '40', stock: true }, { size: '42', stock: true }],
    colors: [{ name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&q=80'] }],
    category: 'Travis Scott',
  },
  {
    id: 8, brand: 'Travis Scott',
    name: 'Travis Low',
    price: 220000,
    images: ['https://images.unsplash.com/photo-1559059699-084a10e4c11e?w=800&q=80'],
    sizes: [{ size: '39', stock: true }, { size: '41', stock: true }],
    colors: [{ name: 'Gray', hex: '#9E9E9E', images: ['https://images.unsplash.com/photo-1559059699-084a10e4c11e?w=100&q=80'] }],
    category: 'Travis Scott',
  },
  {
    id: 9, brand: 'Travis Scott',
    name: 'Jordan 4 Retro',
    price: 213000,
    images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80'],
    sizes: [{ size: '38', stock: true }, { size: '40', stock: true }],
    colors: [{ name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=100&q=80'] }],
    category: 'Travis Scott',
  },
  {
    id: 10, brand: 'New Balance',
    name: 'New Balance 574',
    price: 103000,
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80'],
    sizes: [{ size: '38', stock: true }, { size: '40', stock: true }],
    colors: [{ name: 'Gray', hex: '#9E9E9E', images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=100&q=80'] }],
    category: 'New Balance',
  },
  {
    id: 11, brand: 'New Balance',
    name: 'New Balance 530',
    price: 115000,
    images: ['https://images.unsplash.com/photo-1553346461-a6f24e082cf6?w=800&q=80'],
    sizes: [{ size: '39', stock: true }, { size: '41', stock: true }],
    colors: [{ name: 'White', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1553346461-a6f24e082cf6?w=100&q=80'] }],
    category: 'New Balance',
  },
  {
    id: 12, brand: 'Converse',
    name: 'Converse Chuck 70',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1607522370275-f6fd0d39fb20?w=800&q=80'],
    sizes: [{ size: '38', stock: true }, { size: '40', stock: true }],
    colors: [{ name: 'Red', hex: '#E53935', images: ['https://images.unsplash.com/photo-1607522370275-f6fd0d39fb20?w=100&q=80'] }],
    category: 'Converse',
  },
];
