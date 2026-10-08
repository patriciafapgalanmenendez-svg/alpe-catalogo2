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

// ============================================================================
// CLOUDINARY IMAGE HELPER
// ============================================================================
const CLOUDINARY_CLOUD_NAME = 'qmxgvssq'; 
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto`;

const getProductImage = (product: any, extension = 'jpg') => {
  if (!product || !product.id) return '';
  return `${CLOUDINARY_BASE_URL}/${product.id}.${extension}`;
};

const PRODUCTS_DATABASE = [
  // Page 1
  { id: '39010381', name: 'Rosquilla Frita Dura 3 Kg', category: 'Hostelería', format: 'Caja 3 Kg', tags: ['Tradicional', 'Frito'] },
  { id: '15010001', name: 'Chookies Granel 2 Kg', category: 'Hostelería', format: 'Caja 2 Kg', tags: ['Chocolate', 'Granel'] },
  { id: '39011640', name: 'Magdalenas Aceite Oliva Envueltas 2 Kg.', category: 'Hostelería', format: 'Caja 2 Kg', tags: ['Aceite Oliva', 'Envuelto'] },
  { id: '39010494', name: 'Pasta De Almendra Envuelta 2,5 Kg', category: 'Hostelería', format: 'Caja 2,5 Kg', tags: ['Almendra', 'Envuelto'] },
  { id: '39011752', name: 'Pasta De Almendra Envuelta Estuche 12 Unid.', category: 'Hostelería', format: 'Estuche 12 uds', tags: ['Almendra', 'Estuche'] },
  { id: '39011148', name: 'Magdalenas Cuatro Jotas Envueltas 2,5 Kg.', category: 'Hostelería', format: 'Caja 2,5 Kg', tags: ['Casero', 'Envuelto'] },
  { id: '39011557', name: 'Magdalenas Supremas Bolsa 480 Grs.', category: 'Hostelería', format: 'Bolsa 480 g', tags: ['Supremas'] },
  { id: '39011631', name: 'Corbatas Estuche 10 Unidades', category: 'Hostelería', format: 'Estuche 10 uds', tags: ['Hojaldre', 'Típico'] },
  { id: '39011891', name: 'Sobaos Paquete 24 Unid. Envuelto', category: 'Hoteles', format: 'Paquete 24 uds', tags: ['Desayuno', 'Envuelto'] },
  { id: '39011816', name: 'Sobaos Paquete 12 Unid. Envuelto', category: 'Hostelería', format: 'Paquete 12 uds', tags: ['Desayuno', 'Mantequilla'] },
  { id: '39010628', name: 'Sobaos De Mantequilla 6 Unid. Envuelto', category: 'Hostelería', format: 'Paquete 6 uds', tags: ['Mantequilla', 'Gourmet'] },
  { id: '39012050', name: 'Cake Mármol 350 Grs.', category: 'Empaquetados', format: 'Unidad 350 g', tags: ['Chocolate', 'Bizcocho'] },
  
  // Page 2
  { id: '39011423', name: 'Muffins Con Pepitas De Choco 450 Grs.', category: 'Empaquetados', format: 'Paquete 450 g', tags: ['Chocolate', 'Muffin'] },
  { id: '39011974', name: 'Suspiros De Mantequilla Bañados En Chocolate 6 Unid.', category: 'Hostelería', format: 'Paquete 6 uds', tags: ['Mantequilla', 'Chocolate'] },
  { id: '39011890', name: 'Gominola Clear Little Mix 1 Kg', category: 'Granel', format: 'Bolsa 1 Kg', tags: ['Gominolas', 'Mix'] },
  { id: '39012107', name: 'Blanquitos Envueltos 3 Kg', category: 'Envueltos', format: 'Caja 3 Kg', tags: ['Glaseado', 'Envuelto'] },
  { id: '39011939', name: 'Tarta De Queso 2,2 Kg', category: 'Granel', format: 'Pieza 2,2 Kg', tags: ['Repostería', 'Queso'] },
  { id: '39012122', name: 'Tableta Choco Estilo Dubai 100 Grs.', category: 'Empaquetados', format: 'Tableta 100 g', tags: ['Tendencia', 'Dubai', 'Pistacho'] },
  { id: '39012108', name: 'Barritas Choco Dubai 40 Grs.', category: 'Empaquetados', format: 'Expositor 40 g', tags: ['Tendencia', 'Dubai', 'Snack'] },
  { id: '39011600', name: 'Aceituna Verde Con Hueso 2,4 Kg', category: 'Granel', format: 'Lata 2,4 Kg', tags: ['Aperitivo', 'Hostelería'] },
  { id: '39011976', name: 'Tarta De Almendra 2 Kg', category: 'Granel', format: 'Pieza 2 Kg', tags: ['Almendra', 'Artesano'] },
  { id: '39012096', name: 'Palmeras Rellenas De Ferrero 2,2 Kg', category: 'Granel', format: 'Caja 2,2 Kg', tags: ['Gourmet', 'Ferrero', 'Novedad'] },
  { id: '39011626', name: 'Rosquillas Colores Paquete', category: 'Empaquetados', format: 'Paquete', tags: ['Glaseado', 'Infantil'] },
  { id: '39012101', name: 'Quatro Biscuits Bolsa 300 Grs.', category: 'Empaquetados', format: 'Bolsa 300 g', tags: ['Galletas', 'Crujiente'] },
  { id: '39012068', name: 'Galletas Choco Cool Cream (Rellenas Crema De Leche) 1 Kg', category: 'Granel', format: 'Caja 1 Kg', tags: ['Crema Leche', 'Chocolate'] },
  { id: '39011328', name: 'Roscos de Yogurt 375 Grs.', category: 'Empaquetados', format: 'Paquete 375 g', tags: ['Yogurt', 'Roscos'] },
  { id: '39012095', name: 'Palmera Rellena De Kinder 2,2 Kg', category: 'Granel', format: 'Caja 2,2 Kg', tags: ['Kinder', 'Gourmet', 'Novedad'] },

  // Page 3 & 4
  { id: '39012098', name: 'Palmeras Rellenas De Lotus 2,2 Kg', category: 'Granel', format: 'Caja 2,2 Kg', tags: ['Lotus', 'Caramelo', 'Novedad'] },
  { id: '39012097', name: 'Palmeras Rellenas De Oreo 2,2 Kg', category: 'Granel', format: 'Caja 2,2 Kg', tags: ['Oreo', 'Cacao', 'Novedad'] },
  { id: '39012099', name: 'Palmeras Rellenas De Crema De Limón 2,2 Kg', category: 'Granel', format: 'Caja 2,2 Kg', tags: ['Limón', 'Fresco'] },
  { id: '39011289', name: 'Rosco De Vino 4 Kg', category: 'Navideño', format: 'Caja 4 Kg', tags: ['Navidad', 'Tradicional'] },
  { id: '19010022', name: 'Palmeras De Hojaldre Crujiente Granel 2,5 Kg', category: 'Granel', format: 'Caja 2,5 Kg', tags: ['Hojaldre', 'Crujiente'] },
  { id: '39012052', name: 'Magdalenas Cuadradas Limón Paquete 300 Grs.', category: 'Empaquetados', format: 'Paquete 300 g', tags: ['Limón', 'Desayuno'] },
  { id: '39012051', name: 'Magdalenas Rellenas Cacao Paquete 245 Grs.', category: 'Empaquetados', format: 'Paquete 245 g', tags: ['Cacao', 'Relleno'] },
  { id: '39011787', name: 'Rellenitas De Avellana Paquete 165 Grs.', category: 'Empaquetados', format: 'Paquete 165 g', tags: ['Avellana', 'Crujiente'] },
  { id: '39011630', name: 'Palmeras de Mantequilla Envueltas 6 Unid.', category: 'Empaquetados', format: 'Paquete 6 uds', tags: ['Mantequilla', 'Envuelto'] },
  { id: '39012061', name: 'Mini Muffin Estrella Rellena de Choco Envuelta 1,7 Kg', category: 'Hostelería', format: 'Caja 1,7 Kg', tags: ['Mini', 'Relleno', 'Chocolate'] },
  { id: '39011110', name: 'Mini Magdalenas Envueltas 1,7 Kg', category: 'Hostelería', format: 'Caja 1,7 Kg', tags: ['Mini', 'Cafetería'] },
  { id: '39011840', name: 'Palmera Grande Cacao 80 Grs.', category: 'Envueltos', format: 'Unidad 80 g', tags: ['Cacao', 'Envuelto'] },
  { id: '39012114', name: 'Chocolate Sin Azúcar Negro Con Café 75 Grs.', category: 'Empaquetados', format: 'Tableta 75 g', tags: ['Sin Azúcar', 'Café', 'Saludable'] },
  { id: '39012113', name: 'Chocolate Sin Azúcar Negro Con Banana 75 Grs.', category: 'Empaquetados', format: 'Tableta 75 g', tags: ['Sin Azúcar', 'Plátano', 'Saludable'] },
  { id: '39012111', name: 'Chocolate Sin Azúcar Negro Con Fresa 75 Grs.', category: 'Empaquetados', format: 'Tableta 75 g', tags: ['Sin Azúcar', 'Fresa', 'Saludable'] },
  { id: '39012112', name: 'Chocolate Blanco Sin Azúcar Con Kiwi 75 Grs.', category: 'Empaquetados', format: 'Tableta 75 g', tags: ['Sin Azúcar', 'Blanco', 'Kiwi'] },
  { id: '39011611', name: 'Surtido Galletas Camioncito 250 Grs.', category: 'Empaquetados', format: 'Caja Regalo 250 g', tags: ['Surtido', 'Regalo'] },
  { id: '39011990', name: 'Wafer De Cacao 200 Grs.', category: 'Empaquetados', format: 'Paquete 200 g', tags: ['Wafer', 'Cacao'] },
  { id: '39010963', name: 'Mexicanitos Rellenos Nata 1,7 Kg', category: 'Granel', format: 'Caja 1,7 Kg', tags: ['Nata', 'Relleno'] },

  // Page 5 & Special
  { id: '39010652', name: 'Rosquillas Integrales Sin Azúcar Envueltas 2 Kg', category: 'Envueltos', format: 'Caja 2 Kg', tags: ['Sin Azúcar', 'Integral', 'Saludable'] },
  { id: '06010001', name: 'Rosquillas Integrales Sin Azúcar Granel 2 Kg', category: 'Granel', format: 'Caja 2 Kg', tags: ['Sin Azúcar', 'Integral'] },
  { id: '39011885', name: 'Tacos Rellenos De Nutella 2 Kg', category: 'Granel', format: 'Caja 2 Kg', tags: ['Nutella', 'Avellana'] },
  { id: '39011762', name: 'Polvorón De Pistacho 3,5 Kg', category: 'Navideño', format: 'Caja 3,5 Kg', tags: ['Navidad', 'Pistacho', 'Gourmet'] },
  { id: '39011055', name: 'Polvorón De Almendra Bañado En Chocolate 4 Kg', category: 'Navideño', format: 'Caja 4 Kg', tags: ['Navidad', 'Chocolate', 'Almendra'] },
  { id: '39010694', name: 'Polvorón De Almendra 4,5 Kg', category: 'Navideño', format: 'Caja 4,5 Kg', tags: ['Navidad', 'Almendra Tradicional'] },
  { id: '39010591', name: 'Mazapán Artesano Estuche 500 Grs.', category: 'Navideño', format: 'Estuche 500 g', tags: ['Mazapán', 'Navidad', 'Artesano'] },
  { id: '39012017', name: 'Turrón Surtido En Porciones (Andresitos) 3 Kg.', category: 'Navideño', format: 'Caja 3 Kg', tags: ['Turrón', 'Navidad', 'Porciones'] },
  { id: '39011409', name: 'Pan De Cádiz 350 Grs.', category: 'Navideño', format: 'Pieza 350 g', tags: ['Navidad', 'Mazapán', 'Fruta'] },
  { id: '39011405', name: 'Brazo De Toledo 500 Grs.', category: 'Navideño', format: 'Pieza 500 g', tags: ['Navidad', 'Tradicional'] },
  { id: '39010267', name: 'Casadiellas Estuche 6 Unid.', category: 'Empaquetados', format: 'Estuche 6 uds', tags: ['Asturias', 'Típico', 'Nuez'] },
  { id: '39010294', name: 'Carajitos Estuche 300 Gr.', category: 'Empaquetados', format: 'Estuche 300 g', tags: ['Asturias', 'Avellana'] }
];

const CATEGORIES = [
  { id: 'Todas', name: 'Todo el Catálogo', icon: Store, count: PRODUCTS_DATABASE.length },
  { id: 'Hostelería', name: 'Hostelería / HORECA', icon: Utensils, count: PRODUCTS_DATABASE.filter(p => p.category === 'Hostelería').length },
  { id: 'Granel', name: 'Granel', icon: Package, count: PRODUCTS_DATABASE.filter(p => p.category === 'Granel').length },
  { id: 'Empaquetados', name: 'Empaquetados', icon: Store, count: PRODUCTS_DATABASE.filter(p => p.category === 'Empaquetados').length },
  { id: 'Envueltos', name: 'Envueltos Individual', icon: CheckCircle2, count: PRODUCTS_DATABASE.filter(p => p.category === 'Envueltos').length },
  { id: 'Navideño', name: 'Especial Navideño', icon: Sparkles, count: PRODUCTS_DATABASE.filter(p => p.category === 'Navideño').length },
  { id: 'Hoteles', name: 'Hoteles / Buffets', icon: Building2, count: PRODUCTS_DATABASE.filter(p => p.category === 'Hoteles').length }
];

function ProductImage({ product, className = "w-full h-48 object-cover" }: { product: any, className?: string }) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getProductImage(product);

  if (hasError) {
    return (
      <div className={`${className} bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center`}>
        <ImageOff className="w-8 h-8 mb-1 text-slate-300" />
        <span className="text-[10px] font-medium text-slate-400">Imagen no disponible</span>
        <span className="text-[9px] font-mono text-slate-300 mt-0.5">SKU: {product.id}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={product.name}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [onlySugarFree, setOnlySugarFree] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null);
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATABASE.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.id.includes(searchTerm.trim());
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesSugarFree = !onlySugarFree || 
                               product.name.toLowerCase().includes('sin azúcar') || 
                               product.name.toLowerCase().includes('integral') ||
                               product.tags.some(t => t.toLowerCase().includes('sin azúcar') || t.toLowerCase().includes('saludable'));

      return matchesSearch && matchesCategory && matchesSugarFree;
    });
  }, [searchTerm, selectedCategory, onlySugarFree]);

  const addToCart = (product: any, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setAddedAnimation(product.id);
    setTimeout(() => setAddedAnimation(null), 1200);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return '';
    
    let text = `*SOLICITUD DE PEDIDO / PRESUPUESTO - ALPE DISTRIBUCIONES*\n`;
    text += `-------------------------------------------\n`;
    text += `Hola, me gustaría consultar la disponibilidad y precios de los siguientes productos:\n\n`;

    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.name}*\n   • SKU: \`${item.id}\`\n   • Categoría: ${item.category}\n   • Cantidad: *${item.quantity} ud(s)*\n\n`;
    });

    text += `-------------------------------------------\n`;
    text += `Por favor, facilítenme presupuesto e información sobre el envío. ¡Muchas gracias!`;

    const encodedText = encodeURIComponent(text);
    return `https://wa.me/34985742449?text=${encodedText}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-sky-200 selection:text-sky-900">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 text-sky-100 text-xs sm:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-3 shadow-inner">
        <span className="inline-flex items-center gap-1 bg-sky-800/80 px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider text-sky-200 font-semibold">
          Atención HORECA & Tiendas
        </span>
        <span className="hidden sm:inline">Distribución oficial de pastelería, dulces y repostería.</span>
        <a 
          href="https://wa.me/34985742449" 
          target="_blank" 
          rel="noreferrer" 
          className="underline hover:text-white flex items-center gap-1 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" /> +34 985742449
        </a>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-900/15 border border-sky-400/30">
              <span className="font-serif font-bold text-2xl tracking-wider">A</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  Alpe <span className="text-sky-700 font-normal">Distribuciones</span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>www.alpedistribuciones.com</span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-sky-500"></span>
                <span className="hidden sm:inline-block text-sky-800 font-medium">Catálogo Interactivo</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href="https://wa.me/34985742449" 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-emerald-600/20"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>WhatsApp Directo</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-blue-950 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg active:scale-95 border border-slate-800"
              aria-label="Ver carrito de pedido"
            >
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              <span className="hidden sm:inline">Mi Pedido</span>
              {totalItemsCount > 0 && (
                <span className="bg-sky-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center ml-1 animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-sky-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs px-3 py-1 rounded-full font-medium">
              <Award className="w-3.5 h-3.5 text-sky-400" /> Proveedor Especializado HORECA y Alimentación
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Catálogo visual de dulcería, hojaldres y repostería
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explora nuestra gama de productos con imágenes reales. Añade los artículos que necesites y genera tu solicitud de pedido directamente por WhatsApp.
            </p>
            
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Check className="w-4 h-4 text-sky-400" /> Granel e Individuales
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Check className="w-4 h-4 text-sky-400" /> Formatos para Hostelería
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Check className="w-4 h-4 text-sky-400" /> Novedades Chocolates Dubai
              </span>
            </div>
          </div>

          <div className="bg-white/10 border border-white/15 backdrop-blur-md p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-xl">
            <h3 className="font-serif font-semibold text-lg text-sky-200">Atención Personalizada</h3>
            <p className="text-xs text-slate-300">
              Consúltanos cualquier duda sobre SKUs, volúmenes de compra o envíos a tu zona.
            </p>
            <a
              href="https://wa.me/34985742449?text=Hola,%20quisiera%20recibir%20información%20general%20del%20catálogo"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-md text-sm"
            >
              <Send className="w-4 h-4" /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por producto o Código SKU (ej. 39010381)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Additional Toggle Filters */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={onlySugarFree}
                  onChange={(e) => setOnlySugarFree(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <span>Sólo Sin Azúcar / Integral</span>
              </label>

              <span className="text-xs font-semibold text-slate-600 bg-sky-50 border border-sky-100 px-3 py-2 rounded-xl">
                {filteredProducts.length} producto(s)
              </span>
            </div>
          </div>

          {/* Categories Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-sky-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-200' : 'text-slate-500'}`} />
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-sky-900 text-sky-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid with Images */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-semibold text-slate-800 mb-1">No se encontraron productos</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
              Prueba a cambiar la búsqueda o desmarcar los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
                setOnlySugarFree(false);
              }}
              className="bg-slate-900 text-white text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isJustAdded = addedAnimation === product.id;
              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Image Area */}
                  <div className="relative overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setSelectedProductDetail(product)}>
                    <ProductImage 
                      product={product} 
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Floating SKU & Category Overlay */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-900/80 backdrop-blur-md text-sky-200 px-2 py-0.5 rounded border border-white/20 shadow-sm">
                        SKU: {product.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md ${
                        product.category === 'Navideño' ? 'bg-rose-900/80 text-rose-100' :
                        product.category === 'Hostelería' ? 'bg-blue-900/80 text-sky-100' :
                        product.category === 'Granel' ? 'bg-indigo-900/80 text-indigo-100' :
                        'bg-slate-900/80 text-slate-100'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => setSelectedProductDetail(product)}
                        className="font-serif font-bold text-sm text-slate-900 group-hover:text-sky-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-2">
                        <Package className="w-3.5 h-3.5 text-sky-700 shrink-0" /> {product.format}
                      </p>
                    </div>

                    {/* Tag Cloud */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {product.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-[10px] bg-sky-50 text-sky-800 border border-sky-100 px-2 py-0.5 rounded-md font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProductDetail(product)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Ver información"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isJustAdded 
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-sky-800 hover:bg-sky-900 text-white shadow-sm active:scale-95'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4" /> ¡Añadido!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Añadir al Pedido
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Image Header */}
            <div className="relative h-56 bg-slate-100">
              <ProductImage product={selectedProductDetail} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute right-3 top-3 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-sky-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                {selectedProductDetail.category}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                {selectedProductDetail.name}
              </h2>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Código SKU</span>
                  <span className="font-mono font-bold text-sky-900">{selectedProductDetail.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Formato Comercial</span>
                  <span className="font-medium text-slate-800">{selectedProductDetail.format}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Distribución</span>
                  <span className="text-emerald-700 font-medium">Alpe Distribuciones</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Producto listo para inclusión en pedidos al por mayor y canal cafeterías/alimentación. Para precios de volumen o tarifas de distribución, solicita tu cotización directa por WhatsApp.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedProductDetail);
                    setSelectedProductDetail(null);
                  }}
                  className="flex-1 bg-sky-800 hover:bg-sky-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm"
                >
                  <Plus className="w-4 h-4" /> Añadir a mi Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-sky-400" />
                <h2 className="font-serif font-bold text-lg">Resumen de Pedido</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-700 font-medium text-sm">Tu pedido está vacío</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Añade los productos que necesites del catálogo para generar tu solicitud de cotización.
                  </p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex gap-3 items-center">
                    <ProductImage product={item} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-xs text-slate-900 leading-snug line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="font-mono text-slate-500">SKU: {item.id}</span>

                        {/* Quantity Controller */}
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-slate-900 w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Total de unidades seleccionadas:</span>
                  <span className="font-bold text-slate-900">{totalItemsCount} unidad(es)</span>
                </div>

                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm"
                >
                  <Send className="w-4 h-4" /> Enviar Pedido por WhatsApp
                </a>

                <p className="text-[11px] text-slate-500 text-center leading-normal">
                  Se redactará un mensaje con todos los SKUs y cantidades para enviarlo al +34 985742449.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-sky-200">Alpe Distribuciones</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distribución integral de productos de pastelería, galletas, repostería tradicional, chocolates y aperitivos para restauración y alimentación.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider">Atención Comercial</h4>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-sky-400" /> WhatsApp Directo: +34 985742449
            </p>
            <p className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" /> Catálogo Web: www.alpedistribuciones.com
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider">Categorías de Producto</h4>
            <p className="text-slate-400">Hostelería • Granel • Empaquetados • Envueltos Individuales • Especialidades Navideñas</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Alpe Distribuciones. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}
