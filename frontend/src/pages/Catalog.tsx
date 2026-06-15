import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, Zap, LayoutGrid, List, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const CATEGORIES: Record<string, string[]> = {
  'Генераторы': ['Бензиновые генераторы', 'Дизельные генераторы', 'Инверторные генераторы'],
  'Источники бесперебойного питания (ИБП)': [],
  'Блоки автоматического ввода резерва (АВР)': [],
  'Стабилизаторы напряжения': [],
  'Контейнеры': []
};

const Catalog = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const filteredProducts = products.filter(p => {
    let catMatch = true;
    if (activeCategory) {
        if (CATEGORIES[activeCategory] && CATEGORIES[activeCategory].length > 0) {
            if (activeSubCategory) {
                catMatch = p.fuel_type === activeSubCategory;
            } else {
                catMatch = CATEGORIES[activeCategory].includes(p.fuel_type);
            }
        } else {
            catMatch = p.fuel_type === activeCategory;
        }
    }
    
    // Price match includes 0 (Price on request) or below maxPrice
    const priceMatch = p.price === 0 || p.price <= maxPrice;
    
    return catMatch && priceMatch;
  });

  return (
    <div className="min-h-screen pt-32 pb-10 relative z-10 w-full max-w-[100vw] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-10 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text dark:text-white">Каталог <span className="text-primary">оборудования</span></h1>
          <p className="text-muted dark:text-gray-400">Выберите надежное решение для ваших задач.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="glass-card sticky top-32 p-6 border-border/10 dark:border-white/5">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/10 dark:border-white/10">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-text dark:text-white">Фильтры</h3>
              </div>
              
              <div className="mb-8">
                <h4 className="text-sm text-muted dark:text-gray-400 mb-4 font-medium uppercase tracking-wider">Категория</h4>
                
                <AnimatePresence mode="wait">
                  {!activeCategory || CATEGORIES[activeCategory]?.length === 0 ? (
                    <motion.div 
                        key="main-categories"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex flex-col gap-3"
                    >
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={activeCategory === null}
                          onChange={() => { setActiveCategory(null); setActiveSubCategory(null); }}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${activeCategory === null ? 'bg-primary border-primary' : 'border-border dark:border-white/20 group-hover:border-primary/50'}`}>
                          {activeCategory === null && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <span className={activeCategory === null ? 'text-text dark:text-white font-medium' : 'text-muted group-hover:text-text dark:group-hover:text-gray-200'}>
                          Все категории
                        </span>
                      </label>

                      {Object.keys(CATEGORIES).map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category" 
                            checked={activeCategory === cat}
                            onChange={() => { setActiveCategory(cat); setActiveSubCategory(null); }}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${activeCategory === cat ? 'bg-primary border-primary' : 'border-border dark:border-white/20 group-hover:border-primary/50'}`}>
                            {activeCategory === cat && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                          </div>
                          <span className={`${activeCategory === cat ? 'text-text dark:text-white font-medium' : 'text-muted group-hover:text-text dark:group-hover:text-gray-200'} flex-1`}>
                            {cat}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                        key="sub-categories"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-3"
                    >
                      <button 
                        onClick={() => { setActiveCategory(null); setActiveSubCategory(null); }}
                        className="flex items-center gap-2 text-primary hover:text-text dark:hover:text-white transition-colors text-sm font-medium mb-2 border-b border-border/10 dark:border-white/5 pb-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Назад к категориям
                      </button>
                      <div className="font-bold mb-2 text-text dark:text-white">{activeCategory}</div>
                      
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="subcategory" 
                          checked={activeSubCategory === null}
                          onChange={() => setActiveSubCategory(null)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${activeSubCategory === null ? 'bg-primary border-primary' : 'border-border dark:border-white/20 group-hover:border-primary/50'}`}>
                          {activeSubCategory === null && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <span className={activeSubCategory === null ? 'text-text dark:text-white font-medium' : 'text-muted group-hover:text-text dark:group-hover:text-gray-200'}>
                          Все типы
                        </span>
                      </label>

                      {CATEGORIES[activeCategory].map(sub => (
                        <label key={sub} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="subcategory" 
                            checked={activeSubCategory === sub}
                            onChange={() => setActiveSubCategory(sub)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${activeSubCategory === sub ? 'bg-primary border-primary' : 'border-border dark:border-white/20 group-hover:border-primary/50'}`}>
                            {activeSubCategory === sub && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                          </div>
                          <span className={activeSubCategory === sub ? 'text-text dark:text-white font-medium' : 'text-muted group-hover:text-text dark:group-hover:text-gray-200'}>
                            {sub}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mb-4">
                 <h4 className="text-sm text-muted dark:text-gray-400 mb-4 font-medium uppercase tracking-wider">Макс. Цена: {maxPrice.toLocaleString()} ₽</h4>
                 <input 
                    type="range" 
                    min="10000" 
                    max="2000000" 
                    step="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-muted/20 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary transition-all overflow-hidden" 
                  />
                 <div className="flex justify-between text-xs text-muted mt-3">
                   <span>10 000 ₽</span>
                   <span>2 000 000 ₽</span>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-4 border border-border/10 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
              <span className="text-muted dark:text-gray-400">Найдено: {filteredProducts.length}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-muted/10 dark:text-gray-400 dark:hover:bg-white/10'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-muted/10 dark:text-gray-400 dark:hover:bg-white/10'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  // Skeletons
                  Array.from({ length: 6 }).map((_, i) => (
                     <div key={`skel-${i}`} className="glass-card flex flex-col h-full animate-pulse p-4 border-border/10">
                        <div className="h-48 bg-muted/10 dark:bg-white/10 rounded-xl mb-4 w-full" />
                        <div className="h-6 bg-muted/10 dark:bg-white/10 rounded w-1/3 mb-2" />
                        <div className="h-8 bg-muted/10 dark:bg-white/10 rounded w-3/4 mb-4" />
                        <div className="space-y-2 mb-6">
                           <div className="h-4 bg-muted/10 dark:bg-white/10 rounded w-full" />
                           <div className="h-4 bg-muted/10 dark:bg-white/10 rounded w-4/5" />
                        </div>
                        <div className="h-12 bg-muted/10 dark:bg-white/10 rounded-full w-full mt-auto" />
                     </div>
                  ))
                ) : (
                  filteredProducts.map((p) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={p.id}
                      className="glass-card flex flex-col group p-2 border-border/10 dark:border-white/5 hover:border-primary/20 transition-all duration-500"
                    >
                      <Link to={`/catalog/${p.id}`} className="block relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-muted/5 to-transparent dark:from-white/5 h-56 flex items-center justify-center p-6">
                        <img src={p.image} alt={p.name} className="object-contain h-full max-w-full transition-transform duration-500 group-hover:scale-110 drop-shadow-xl" />
                        <div className="absolute top-3 right-3 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-bold border border-border/10 dark:border-white/10 text-center max-w-[150px] truncate uppercase tracking-wider text-text dark:text-gray-300">
                          {p.fuel_type}
                        </div>
                      </Link>
                      
                      <div className="px-3 pb-3 flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-primary">{p.price === 0 ? 'По запросу' : `${p.price.toLocaleString()} ₽`}</span>
                        </div>
                        <Link to={`/catalog/${p.id}`}>
                          <h3 className="text-lg font-bold mb-3 text-text dark:text-white hover:text-primary transition-colors line-clamp-2 min-h-[50px] leading-tight">{p.name}</h3>
                        </Link>
                        
                        {p.power > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted dark:text-gray-400 mb-6 font-medium">
                            <Zap className="w-4 h-4 text-accent" />
                            Мощность: {p.power.toFixed(1)} кВт
                          </div>
                        )}
                        
                        <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openLeadModal', { detail: p.name })); }} className="btn-primary w-full mt-auto py-3 text-sm font-bold uppercase tracking-widest relative overflow-hidden group/btn shadow-lg shadow-primary/10">
                           <span className="relative z-10">Оставить заявку</span>
                           <div className="absolute inset-0 h-full w-full block bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
