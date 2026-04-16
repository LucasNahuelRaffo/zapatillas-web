import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  externalIndex?: number;
  onIndexChange?: (index: number) => void;
}

export default function ImageGallery({ images, externalIndex, onIndexChange }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (externalIndex !== undefined && externalIndex !== -1 && externalIndex !== currentIndex) {
      setCurrentIndex(externalIndex);
    }
  }, [externalIndex, currentIndex]);

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };

  const nextImage = () => {
    handleIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    handleIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Product view ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 text-black"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 text-black"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Pagination Dots (Inside) */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => handleIndexChange(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'bg-black w-6 shadow-sm' : 'bg-black/20 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
