import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const ProductDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
    const [imageLoaded, setImageLoaded] = useState(false);

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/products/${id}`);
                setProduct({
                    ...data,
                    // Mock specs since backend doesn't store them all
                    specs: [
                        { label: 'Номинальная мощность', value: `${data.power || 5} кВт` },
                        { label: 'Номинальное напряжение', value: '230/400 В' },
                        { label: 'Тип запуска', value: 'Электростартер / Ручной' },
                        { label: 'Объем бака', value: '25 л' },
                        { label: 'Уровень шума', value: '68 дБ' },
                        { label: 'Стоковым количеством', value: `${data.stock} шт.` },
                    ]
                });
                setSelectedImage(data.image);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen py-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen py-32 flex items-center justify-center flex-col gap-4">
                <h2 className="text-2xl font-bold">Товар не найден</h2>
                <Link to="/catalog" className="text-primary hover:underline">Вернуться в каталог</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 relative z-10 w-full overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 pt-10">
                <Link to="/catalog" className="inline-flex items-center gap-2 text-muted dark:text-gray-400 hover:text-text dark:hover:text-white transition-colors mb-8 font-medium">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Вернуться в каталог</span>
                </Link>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Gallery */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="glass-card flex-grow h-[500px] flex items-center justify-center p-8 relative overflow-hidden group border-border/10 dark:border-white/5">
                           <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                           {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-muted/5 dark:bg-white/5" />}
                           <img 
                               src={selectedImage} 
                               alt={product.name} 
                               className={`object-contain w-full h-full transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} group-hover:scale-105 drop-shadow-2xl`}
                               onLoad={() => setImageLoaded(true)}
                           />
                        </div>
                        <div className="grid grid-cols-3 gap-4 h-32">
                            <div 
                                className={`glass rounded-[30px] overflow-hidden cursor-pointer p-2 transition-all border-2 ${selectedImage === product.image ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                onClick={() => { setSelectedImage(product.image); setImageLoaded(false); }}
                            >
                                <img src={product.image} alt="Thumbnail" className="w-full h-full object-contain rounded-lg bg-muted/5 dark:bg-white/5" />
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-muted/10 dark:bg-white/10 text-xs font-bold text-muted dark:text-gray-300 border border-border/10 dark:border-white/5 uppercase tracking-wider">{product.fuel_type}</span>
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold border border-green-500/20 flex items-center gap-1.5 uppercase tracking-wider"><CheckCircle className="w-4 h-4" /> В наличии: {product.stock} шт.</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text dark:text-white leading-tight">{product.name}</h1>
                        <p className="text-4xl font-bold text-primary mb-8 shadow-primary/10">{product.price === 0 ? 'По запросу' : `${product.price.toLocaleString()} ₽`}</p>
                        
                        <div className="glass rounded-[40px] p-6 mb-8 mt-2 space-y-4 border-border/10 dark:border-white/5">
                            <h3 className="text-lg font-bold border-b border-border/10 dark:border-white/10 pb-3 mb-4 text-text dark:text-white uppercase tracking-tight">Коротко о главном</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[20px] bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted dark:text-gray-400 uppercase font-bold tracking-widest">Мощность</p>
                                        <p className="font-bold text-lg text-text dark:text-white">{product.power} кВт</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[20px] bg-accent/10 text-accent flex items-center justify-center shadow-inner">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted dark:text-gray-400 uppercase font-bold tracking-widest">Гарантия</p>
                                        <p className="font-bold text-lg text-text dark:text-white">3 года</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openLeadModal', { detail: product.name })); }} className="btn-primary flex-grow text-lg font-bold py-5 px-8 uppercase tracking-widest relative overflow-hidden group shadow-xl shadow-primary/20">
                                <span className="relative z-10 transition-transform group-active:scale-95">Оставить заявку</span>
                                <div className="absolute inset-0 h-full w-full block bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button className="btn-ghost px-8 py-5 border-border/10 dark:border-white/10 group flex items-center justify-center">
                                <ArrowRight className="w-6 h-6 text-text dark:text-white group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
                
                {/* Tabs */}
                <div className="glass rounded-[40px] p-8 md:p-12 mb-20 overflow-hidden relative border-border/10 dark:border-white/5 shadow-2xl dark:shadow-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 dark:bg-primary/10 blur-[100px] pointer-events-none" />
                    
                    <div className="flex gap-8 border-b border-border/10 dark:border-white/10 mb-8 pb-4 relative z-10">
                        <button 
                            className={`text-xl font-bold uppercase tracking-tight transition-colors relative ${activeTab === 'desc' ? 'text-text dark:text-white' : 'text-muted hover:text-text dark:text-gray-500 dark:hover:text-gray-300'}`}
                            onClick={() => setActiveTab('desc')}
                        >
                            Описание
                            {activeTab === 'desc' && (
                                <motion.div layoutId="underline" className="absolute -bottom-[17px] left-0 right-0 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                        <button 
                            className={`text-xl font-bold uppercase tracking-tight transition-colors relative ${activeTab === 'specs' ? 'text-text dark:text-white' : 'text-muted hover:text-text dark:text-gray-500 dark:hover:text-gray-300'}`}
                            onClick={() => setActiveTab('specs')}
                        >
                            Характеристики
                            {activeTab === 'specs' && (
                                <motion.div layoutId="underline" className="absolute -bottom-[17px] left-0 right-0 h-1 bg-primary rounded-full" />
                            )}
                        </button>
                    </div>
                    
                    <div className="relative z-10 min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'desc' ? (
                                <motion.div
                                    key="desc"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-muted dark:text-gray-300 leading-relaxed text-xl max-w-4xl font-medium"
                                >
                                    <p>{product.description}</p>
                                    <p className="mt-6 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                                        Наши генераторы оснащены современными системами защиты от перегрузок и короткого замыкания, а также отличаются пониженным уровнем шума и вибрации благодаря инновационной звукоизоляции.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="specs"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 max-w-4xl border border-border/10 dark:border-white/5 rounded-[40px] overflow-hidden glass shadow-inner">
                                        {product.specs.map((spec: any, i: number) => (
                                            <div key={i} className={`flex justify-between p-5 ${i % 2 === 0 ? 'bg-muted/5 dark:bg-white/5' : ''} border-b border-border/5 dark:border-white/5 last:border-0`}>
                                                <span className="text-muted dark:text-gray-400 font-bold uppercase tracking-widest text-xs my-auto">{spec.label}</span>
                                                <span className="font-bold text-text dark:text-white text-right text-lg">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default ProductDetails;

