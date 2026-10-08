import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Phone, 
  Check, 
  X, 
  Package, 
  Utensils, 
  Store, 
  Plus, 
  Minus, 
  Trash2, 
  Send,
  Building2,
  Award,
  ExternalLink,
  Info,
  CheckCircle2,
  Sparkles,
  ImageOff
} from 'lucide-react';

// Generador de imágenes Cloudinary para Cloud Name: qmxgvssq
const getProductImage = (product) => {
  const name = product.name.toLowerCase();
  const category = product.category;

  // Si el SKU existe, construye la URL directa de Cloudinary
  if (product && product.id) {
    return `https://res.cloudinary.com/qmxgvssq/image/upload/f_auto,q_auto,w_600/${product.id}.jpg`;
  }

  // Imágenes por defecto de alta calidad según tipo de producto
  if (name.includes('dubai') || name.includes('chocolate') || name.includes('choco')) {
    return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('palmera') || name.includes('hojaldre') || name.includes('corbatas')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('magdalena') || name.includes('muffin') || name.includes('sobao')) {
    return 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80';
  }

  return 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80';
};

// Componente para renderizar la imagen con intento Cloudinary + respaldo visual
function ProductImage({ product, className = "w-full h-48 object-cover" }) {
  const [imgSrc, setImgSrc] = useState(() => getProductImage(product));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // Si la imagen de Cloudinary (ej: 39010381.jpg) no existe en el bucket, pasa a la imagen temática de muestra
    if (imgSrc.includes('cloudinary.com')) {
      const name = product.name.toLowerCase();
      if (name.includes('dubai') || name.includes('chocolate') || name.includes('choco')) {
        setImgSrc('https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80');
      } else if (name.includes('palmera') || name.includes('hojaldre') || name.includes('corbatas')) {
        setImgSrc('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80');
      } else if (name.includes('magdalena') || name.includes('muffin') || name.includes('sobao')) {
        setImgSrc('https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80');
      } else {
        setImgSrc('https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80');
      }
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`${className} bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4`}>
        <ImageOff className="w-8 h-8 mb-1" />
        <span className="text-[10px]">Sin imagen disponible</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={product.name}
      onError={handleError}
      className={className}
      loading="lazy"
    />
  );
}
