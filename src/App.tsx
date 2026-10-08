import React, { useState, useEffect, useMemo } from 'react';
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
  Info,
  CheckCircle2,
  Sparkles,
  ImageOff,
  Loader2
} from 'lucide-react';

// Enlace CSV oficial de tu Google Sheets
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTcQuEZEXt1NO9_mYjkl4w9dTJo8wWcI1A6sI-SMakDXDg7z_VCQUIOwVJwhYtQug/pub?output=csv";

// Helper de imágenes: intenta Cloudinary por ID (SKU) y si no, usa fallback por temática
const getProductImage = (product) => {
  if (product && product.id) {
    return `https://res.cloudinary.com/qmxgvssq/image/upload/f_auto,q_auto,w_600/${product.id}.jpg`;
  }

  const name = (product.name || '').toLowerCase();
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

// Parser CSV ligero que procesa dinámicamente tu hoja de Google Sheets
const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
    const cleanValues = values.map(v => v ? v.trim().replace(/^"|"$/g, '') : '');
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cleanValues[index] || '';
    });

    return {
      id: row.id || row.codigo || row.sku || row['código'] || '',
      name: row.name || row.nombre || row.producto || row['nombre de producto'] || 'Producto sin nombre',
      category: row.category || row.categoria || row['categoría'] || 'Hostelería',
      format: row.format || row.formato || 'Formato Estándar',
      tags: row.tags ? row.tags.split(';').map(t => t.trim()) : (row.etiquetas ? row.etiquetas.split(',').map(t => t.trim()) : ['General'])
    };
  }).filter(item => item.id || item.name);
};

function ProductImage({ product, className = "w-full h-48 object-cover" }) {
  const [imgSrc, setImgSrc] = useState(() => getProductImage(product));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc.includes('cloudinary.com')) {
      const name = (product.name || '').toLowerCase();
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
        <span className="text-[10px]">Sin imagen</span>
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

export default function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [onlySugarFree, setOnlySugarFree] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [addedAnimation, setAddedAnimation] = useState(null);

  // Descarga dinámica desde Google Sheets CSV
  useEffect(() => {
    fetch(GOOGLE_SHEETS_CSV_URL)
      .then(res => res.text())
      .then(csvText => {
        const parsedData = parseCSV(csvText);
        if (parsedData.length > 0) {
          setProducts(parsedData);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar Google Sheets CSV:", err);
        setIsLoading(false);
      });
  }, []);

  const categoriesList = useMemo(() => {
    const cats = ['Todas'];
    products.forEach(p => {
      if (p.category && !cats.includes(p.category)) {
        cats.push(p.category);
      }
    });
    return cats.map(catName => ({
      id: catName,
      name: catName === 'Todas' ? 'Todo el Catálogo' : catName,
      icon: catName === 'Hostelería' ? Utensils : catName === 'Granel' ? Package : catName === 'Navideño' ? Sparkles : Store,
      count: catName === 'Todas' ? products.length : products.filter(p => p.category === catName).length
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.id.includes(searchTerm.trim());
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesSugarFree = !onlySugarFree || 
                               product.name.toLowerCase().includes('sin azúcar') || 
                               product.name.toLowerCase().includes('integral') ||
                               product.tags.some(t => t.toLowerCase().includes('sin azúcar') || t.toLowerCase().includes('saludable'));

      return matchesSearch && matchesCategory && matchesSugarFree;
    });
  }, [products, searchTerm, selectedCategory, onlySugarFree]);

  const addToCart = (product, quantity = 1) => {
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

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-sky-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-3">
        <span className="bg-sky-800 px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider text-sky-200 font-semibold">
          Atención HORECA & Tiendas
        </span>
        <span className="hidden sm:inline">Distribución oficial de pastelería, dulces y repostería.</span>
        <a href="https://wa.me/34985742449" target="_blank" rel="noreferrer" className="underline hover:text-white flex items-center gap-1">
          <Phone className="w-3.5 h-3.5" /> +34 985742449
        </a>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center text-white font-serif font-bold text-2xl">
              A
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-none">
                Alpe <span className="text-sky-700 font-normal">Distribuciones</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">www.alpedistribuciones.com • Catálogo Interactivo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/34985742449" 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm"
            >
              <Phone className="w-4 h-4" /> WhatsApp Directo
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm"
            >
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              <span>Mi Pedido</span>
              {totalItemsCount > 0 && (
                <span className="bg-sky-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center ml-1">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 text-xs px-3 py-1 rounded-full font-medium">
              <Award className="w-3.5 h-3.5 text-sky-400" /> Proveedor Especializado Hostelería y Alimentación
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight">
              Catálogo visual de dulcería, hojaldres y repostería
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Explora nuestra gama de productos sincronizada en tiempo real. Añade los productos que necesites y genera tu pedido por WhatsApp.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 border border-white/10">
            <h3 className="font-serif font-semibold text-lg text-sky-200">Atención Personalizada</h3>
            <p className="text-xs text-slate-300">Consúltanos cualquier duda sobre productos, volúmenes de compra o entregas a tu zona.</p>
            <a
              href="https://wa.me/34985742449?text=Hola,%20quisiera%20recibir%20información%20general%20del%20catálogo"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm"
            >
              <Send className="w-4 h-4" /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Dynamic Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        {isLoading ? (
          <div className="text-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-sky-700 animate-spin mx-auto" />
            <p className="text-slate-600 font-medium">Cargando catálogo completo desde Google Sheets...</p>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por producto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={onlySugarFree}
                      onChange={(e) => setOnlySugarFree(e.target.checked)}
                      className="rounded text-sky-600 h-4 w-4"
                    />
                    <span>Sólo Sin Azúcar / Integral</span>
                  </label>

                  <span className="text-xs font-semibold text-slate-600 bg-sky-50 px-3 py-2 rounded-xl">
                    {filteredProducts.length} producto(s)
                  </span>
                </div>
              </div>

              {/* Dynamic Categories Pills */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-2">
                {categoriesList.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap ${
                        isSelected ? 'bg-sky-800 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-sky-950 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => {
                const isJustAdded = addedAnimation === product.id;
                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="relative overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setSelectedProductDetail(product)}>
                      <ProductImage product={product} className="w-full h-44 object-cover" />
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-900/80 text-sky-200 px-2 py-0.5 rounded">
                          SKU: {product.id}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 onClick={() => setSelectedProductDetail(product)} className="font-serif font-bold text-sm text-slate-900 cursor-pointer line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-sky-700" /> {product.format}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {product.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                      <button onClick={() => setSelectedProductDetail(product)} className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600">
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => addToCart(product)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 text-white ${
                          isJustAdded ? 'bg-emerald-600' : 'bg-sky-800 hover:bg-sky-900'
                        }`}
                      >
                        {isJustAdded ? <><Check className="w-4 h-4" /> ¡Añadido!</> : <><Plus className="w-4 h-4" /> Añadir al Pedido</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Modal Detalle */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative">
            <div className="relative h-56 bg-slate-100">
              <ProductImage product={selectedProductDetail} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute right-3 top-3 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-sky-900/80 text-white text-xs px-3 py-1 rounded-full font-medium">
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

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedProductDetail);
                    setSelectedProductDetail(null);
                  }}
                  className="flex-1 bg-sky-800 hover:bg-sky-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md text-sm"
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
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-sky-400" />
                <h2 className="font-serif font-bold text-lg">Resumen de Pedido</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-700 font-medium text-sm">Tu pedido está vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex gap-3 items-center">
                    <ProductImage product={item} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif font-bold text-xs text-slate-900">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="font-mono text-slate-500">SKU: {item.id}</span>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded p-0.5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 text-slate-600"><Minus className="w-3 h-3" /></button>
                          <span className="font-bold text-slate-900 w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 text-slate-600"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> Enviar Pedido por WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 text-center text-xs mt-12 border-t border-slate-800">
        © {new Date().getFullYear()} Alpe Distribuciones. Todos los derechos reservados.
      </footer>
    </div>
  );
}
