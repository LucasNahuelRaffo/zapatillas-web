import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const local = getLocalProducts().find(p => p.id === Number(id)) ?? null;
    setProduct(local);
    setLoading(false);
  }, [id]);

  const handleGalleryIndexChange = (index: number) => {
    setGalleryIndex(index);
  };

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

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.subtitle,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "ARS",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-common">
      <Helmet>
        <title>{`${product.name} | Za-pass Premium Sneakers`}</title>
        <meta name="description" content={`Comprá las ${product.name} en Za-pass. Calidad Premium AAA+, materiales originales y envío gratis a todo el país.`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

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
          />

          <ProductAccordions description={product.description} />
        </motion.div>
      </div>
    </div>
  );
}

