import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import { About, Contact } from './pages/Pages';
import AdminPanel from './pages/Admin';
import { Login, Register } from './pages/Auth';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import { X, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { formatPhone } from './utils';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setSelectedProduct(e.detail || "Общая заявка");
      setIsModalOpen(true);
      setIsSubmitted(false);
    };
    window.addEventListener('openLeadModal', handleOpenModal);
    return () => window.removeEventListener('openLeadModal', handleOpenModal);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/applications', {
        name,
        phone,
        message: 'Lead Source: Website',
        product: selectedProduct
      });
      setIsSubmitted(true);
      setName("");
      setPhone("");
    } catch(err) {
      console.error(err);
      alert("Ошибка при отправке заявки");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative w-full overflow-hidden bg-background text-text transition-colors duration-300">
        {/* Global Ambient Glow for all pages */}
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent/10 dark:bg-accent/20 blur-[150px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-primary/5 dark:bg-primary/10 blur-[150px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
        
        <ScrollToTop />
        <Navbar />
        
        <main className="flex-grow z-10 pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductDetails />} />
            <Route path="/services" element={<Services />} /> 
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        
        {/* Global Lead Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1d2d] border border-white/10 p-8 rounded-3xl max-w-md w-full relative shadow-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-white">Заявка принята!</h3>
                  <p className="text-gray-400">Специалист перезвонит Вам в течение 15 минут.</p>
                  <button onClick={() => setIsModalOpen(false)} className="btn-primary mt-6 w-full">Отлично</button>
                </div>
              ) : !!localStorage.getItem('token') ? (
                <>
                  <h3 className="text-2xl font-bold mb-2 text-white">Оставить заявку</h3>
                  <p className="text-gray-400 mb-6 text-sm">Оставьте данные, и специалист подберёт лучшее решение с учётом требований объекта.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {selectedProduct !== "Общая заявка" && (
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 mb-4">
                        <span className="text-xs text-gray-400 block mb-1">Интересующий товар/услуга:</span>
                        <span className="text-white font-medium">{selectedProduct}</span>
                      </div>
                    )}
                    
                    <div>
                      <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ваше Имя" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                    <div>
                      <input required value={phone} onChange={e => setPhone(formatPhone(e.target.value))} type="tel" placeholder="Ваш телефон" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors" />
                    </div>
                    <label className="flex items-start gap-2 mt-4 cursor-pointer group">
                      <input type="checkbox" required className="mt-0.5 accent-primary w-4 h-4 rounded border-white/10 bg-white/5" />
                      <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                        Я согласен на обработку моих персональных данных в соответствии с <a href="#" className="text-primary hover:underline">политикой конфиденциальности</a>.
                      </span>
                    </label>
                    <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-lg font-semibold mt-4">
                      {isLoading ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">Требуется авторизация</h3>
                  <p className="text-gray-400 mb-8 mt-2">Для оформления заявки необходимо войти в свой аккаунт или зарегистрироваться.</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { setIsModalOpen(false); window.location.href='/login'; }} className="btn-primary w-full py-3">Войти</button>
                    <button onClick={() => { setIsModalOpen(false); window.location.href='/register'; }} className="btn-ghost w-full py-3 border border-white/20">Зарегистрироваться</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;

