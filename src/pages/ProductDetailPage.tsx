import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, hasSupabaseCredentials } from '../lib/supabase';
import { Product } from '../data/products';
import { getLocalProducts } from '../lib/productStore';
import ImageGallery from '../components/Product/ImageGallery';
import ProductInfo from '../components/Product/ProductInfo';
import ProductSelectors from '../components/Product/ProductSelectors';
import ProductAccordions from '../components/Product/ProductAccordions';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(hasSupabaseCredentials);
  const [searchParams] = useSearchParams();
  const colorFromUrl = searchParams.get('color');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [galleryIndex, setGalleryIndex] = useState(-1);

  useEffect(() => {
    if (!id) return;

    // Sin credenciales de Supabase → buscar en el productStore (localStorage)
    if (!hasSupabaseCredentials) {
      const local = getLocalProducts().find(p => p.id === Number(id)) ?? null;
      setProduct(local);
      return;
    }

    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', Number(id))
          .single();

        if (error) throw error;
        if (data) {
          // Normalizar para que siempre sean arrays
          const normalized: Product = {
            ...data,
            images: Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []),
            colors: (data.colors || []).map((c: any) => ({
              ...c,
              images: Array.isArray(c.images) ? c.images : (c.image ? [c.image] : [])
            }))
          };
          setProduct(normalized);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback a productStore si Supabase falla
        const local = getLocalProducts().find(p => p.id === Number(id)) ?? null;
        setProduct(local);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleColorChange = (colorName: string) => {
    if (!product) return;
    const colorObj = product.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    if (!colorObj) return;

    const colorImages = Array.isArray(colorObj.images) ? colorObj.images : [(colorObj as any).image];
    const firstImage = colorImages[0];

    if (firstImage) {
      // Intentar encontrar la imagen en la galería principal
      const idx = product.images.indexOf(firstImage);
      if (idx !== -1) {
        setGalleryIndex(idx);
      } else {
        // Fallback: buscar por coincidencia parcial si la URL tiene parámetros distintos
        const baseImageUrl = firstImage.split('?')[0];
        const fuzzyIdx = product.images.findIndex(img => img.includes(baseImageUrl));
        if (fuzzyIdx !== -1) setGalleryIndex(fuzzyIdx);
      }
    }
    setSelectedColor(colorName);
  };

  const handleGalleryIndexChange = (index: number) => {
    if (!product) return;
    setGalleryIndex(index); // Sincronizar estado para evitar el bucle de revertido
    
    const imageUrl = product.images[index];
    const matchingColor = product.colors.find(c => {
      const colorImages = Array.isArray(c.images) ? c.images : [(c as any).image];
      return colorImages.some(img => {
        const baseImg = img.split('?')[0];
        return imageUrl.includes(baseImg);
      });
    });

    if (matchingColor && matchingColor.name !== selectedColor) {
      setSelectedColor(matchingColor.name);
    }
  };

  useEffect(() => {
    if (product && !selectedColor) {
      const initial = colorFromUrl || product.colors[0]?.name;
      if (initial) {
        handleColorChange(initial);
      }
    }
  }, [product, colorFromUrl, selectedColor]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black uppercase mb-4">Producto no encontrado</h2>
        <Link to="/shop" className="text-sm font-bold underline uppercase tracking-widest">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb / Back button */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver al Shop
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left Column: Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImageGallery 
            images={product.images} 
            externalIndex={galleryIndex}
            onIndexChange={handleGalleryIndexChange}
          />
        </motion.div>

        {/* Right Column: Product Info & Selectors */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col"
        >
          <ProductInfo 
            brand={product.brand}
            name={product.name}
            subtitle={product.subtitle}
            price={product.price}
          />

          <ProductSelectors 
            product={product}
            onColorChange={handleColorChange}
            selectedColor={selectedColor}
          />

          <ProductAccordions />
        </motion.div>
      </div>

    </div>
  );
}
