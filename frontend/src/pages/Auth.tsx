import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatPhone } from '../utils';

const Auth = ({ type }: { type: 'login' | 'register' }) => {
  const [email, setEmail] = useState(type === 'login' ? 'admin' : '');
  const [password, setPassword] = useState(type === 'login' ? '123456' : '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'login') {
        const payload = { login: email, password: password };
        const response = await axios.post('/token', payload);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        window.dispatchEvent(new Event('storage'));
        
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Registration endpoint
        const payload = { login: email, password: password, first_name: firstName, last_name: lastName, phone: phone };
        const response = await axios.post('/users', payload);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Произошла ошибка. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex justify-center items-center relative overflow-hidden text-text dark:text-white">
      {/* Background glass spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 dark:bg-accent/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 z-10 mx-4 rounded-[40px] border-border/10 dark:border-white/5 shadow-2xl dark:shadow-none bg-surface/80 dark:bg-transparent backdrop-blur-3xl"
      >
        <div className="electric-waves opacity-20 dark:opacity-100"></div>
        <div className="text-center mb-10">
          <motion.div 
            className="w-24 h-24 mx-auto flex items-center justify-center mb-6"
            whileHover={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.4 }
            }}
          >
            {type === 'login' ? <Lock className="text-gray-400 dark:text-gray-500 w-16 h-16" /> : <User className="text-gray-400 dark:text-gray-500 w-16 h-16" />}
          </motion.div>
          <h1 className="text-4xl font-black mb-3 uppercase tracking-tighter">
            {type === 'login' ? 'Вход' : 'Регистрация'}
          </h1>
          <p className="text-muted dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            {type === 'login' ? 'Доступ к панели управления' : 'Присоединяйтесь к Energoprof'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-tight text-center">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Имя</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl text-text dark:text-white placeholder:text-muted/40 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-bold text-sm"
                    placeholder="Иван"
                    required
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Фамилия</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl text-text dark:text-white placeholder:text-muted/40 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-bold text-sm"
                    placeholder="Иванов"
                    required
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Телефон</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="block w-full pl-11 pr-4 py-3.5 bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl text-text dark:text-white placeholder:text-muted/40 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-bold text-sm"
                    placeholder="+7 999 000-00-00"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Логин или Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl text-text dark:text-white placeholder:text-muted/40 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-bold text-sm"
                placeholder={type === 'login' ? 'admin' : 'your@email.com'}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-muted dark:text-gray-400 uppercase tracking-widest">Пароль</label>
              {type === 'login' && <Link to="#" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Забыли?</Link>}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl text-text dark:text-white placeholder:text-muted/40 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-bold text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full relative overflow-hidden rounded-[20px] bg-gradient-to-r from-primary to-blue-500 text-white font-black uppercase tracking-widest py-5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 flex items-center justify-center gap-2 group mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Вход...' : type === 'login' ? 'Войти' : 'Зарегистрироваться'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-border/10 dark:border-white/10 pt-8">
          {type === 'login' ? (
            <p className="text-muted dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
              Нет аккаунта? <Link to="/register" className="text-primary hover:text-accent transition-colors ml-1">Создать</Link>
            </p>
          ) : (
            <p className="text-muted dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
              Уже есть аккаунт? <Link to="/login" className="text-primary hover:text-accent transition-colors ml-1">Войти</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const Login = () => <Auth type="login" />;
export const Register = () => <Auth type="register" />;

