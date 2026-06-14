import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setIsLogged(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLogged(false);
    setRole(null);
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Услуги', path: '/services' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Проекты', path: '/projects' },
    { name: 'Контакты', path: '/contact' },
  ];

  return (
    <header className="fixed top-6 w-full z-50 flex justify-center px-4 pointer-events-none">
      <div className="flex items-center gap-3 md:gap-4 pointer-events-auto max-w-6xl w-full justify-between">
        
        {/* Main Pill Navbar */}
        <div className={`flex items-center justify-between transition-all duration-500 rounded-full px-4 py-2 w-full border ${
          scrolled 
            ? 'bg-surface/80 dark:bg-surface/60 backdrop-blur-2xl border-border/20 dark:border-white/10 shadow-lg' 
            : 'bg-white/40 dark:bg-white/5 backdrop-blur-xl border-border/10 dark:border-white/5 shadow-sm'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group mr-4 pl-4 shrink-0">
            <span className="text-xl font-black tracking-widest text-text dark:text-white group-hover:text-primary transition-colors uppercase">
              Энерго<span className="text-primary font-light">проф</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-1 items-center flex-grow justify-center relative">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                onMouseLeave={() => setHoveredPath(location.pathname)}
                className="relative px-5 py-2 text-sm font-semibold transition-all duration-300 z-10"
              >
                {hoveredPath === link.path && (
                  <motion.div
                    layoutId="nav-capsule"
                    className={`absolute inset-0 rounded-full -z-10 border backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden transition-colors duration-500 ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-white/20 to-white/5 border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]' 
                        : 'bg-gradient-to-br from-black/10 to-transparent border-black/10 shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]'
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    {/* Chromatic aberration effect */}
                    <div className={`absolute inset-0 rounded-full border-l-[1.5px] transition-opacity ${theme === 'dark' ? 'border-red-500/20 mix-blend-screen' : 'border-red-600/10 mix-blend-multiply'} -translate-x-[0.5px] scale-[1.02]`} />
                    <div className={`absolute inset-0 rounded-full border-r-[1.5px] transition-opacity ${theme === 'dark' ? 'border-cyan-500/20 mix-blend-screen' : 'border-cyan-600/10 mix-blend-multiply'} translate-x-[0.5px] scale-[1.02]`} />
                    
                    {/* Interior glow */}
                    <div className={`absolute inset-0 opacity-50 ${theme === 'dark' ? 'bg-gradient-to-tr from-white/10 via-transparent to-white/5' : 'bg-gradient-to-tr from-black/5 via-transparent to-black/5'}`} />
                  </motion.div>
                )}
                <motion.span
                  animate={{ 
                    scale: hoveredPath === link.path ? 1.15 : 1,
                    fontWeight: hoveredPath === link.path ? 700 : 600,
                    color: hoveredPath === link.path 
                      ? (theme === 'dark' ? '#ffffff' : '#0f111a') 
                      : (theme === 'dark' ? '#9ca3af' : '#6b7280')
                  }}
                  className="relative z-10 block"
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Call to Action Inside Pill */}
            <div className="hidden lg:block">
              <Link to="/catalog">
                <button className="bg-accent hover:bg-accent/80 text-white font-bold py-2.5 px-6 rounded-full transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105">
                  Заказать
                </button>
              </Link>
            </div>

            {/* Mobile Nav Toggle */}
            <button 
              className="lg:hidden text-text dark:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Separate Buttons Area */}
        <div className="hidden lg:flex items-center gap-2">
          {role === 'admin' && (
            <Link to="/admin" className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all duration-500 border hover:bg-accent hover:border-accent hover:text-white ${
              scrolled 
                ? 'bg-surface/80 dark:bg-surface/60 text-text dark:text-white border-border/20 dark:border-white/10 backdrop-blur-2xl' 
                : 'bg-white/40 dark:bg-white/5 text-text dark:text-white border-border/10 dark:border-white/5 backdrop-blur-xl shadow-sm'
            }`}>
              Админ
            </Link>
          )}
          {isLogged ? (
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 rounded-full px-6 py-4 font-semibold transition-all duration-500 border hover:bg-red-500/10 hover:text-red-500 hover:scale-105 ${
                scrolled 
                  ? 'bg-surface/80 dark:bg-surface/60 border-border/20 dark:border-white/10 text-red-500/80 backdrop-blur-2xl' 
                  : 'bg-white/40 dark:bg-white/5 border-border/10 dark:border-white/5 text-red-500/80 backdrop-blur-xl shadow-sm'
              }`}
            >
              <User className="w-5 h-5" />
              Выход
            </button>
          ) : (
            <Link to="/login" className={`flex items-center gap-2 rounded-full px-6 py-4 font-semibold transition-all duration-500 border hover:bg-primary/20 hover:scale-105 ${
              scrolled 
                ? 'bg-surface/80 dark:bg-surface/60 text-text dark:text-white border-border/20 dark:border-white/10 backdrop-blur-2xl' 
                : 'bg-white/40 dark:bg-white/5 text-text dark:text-white border-border/10 dark:border-white/5 backdrop-blur-xl shadow-sm'
            }`}>
              <User className="w-5 h-5 text-muted dark:text-gray-300" />
              Вход
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full mt-4 left-4 right-4 bg-surface/90 dark:bg-surface/95 backdrop-blur-2xl border border-border/20 dark:border-white/20 p-6 flex flex-col gap-4 rounded-3xl lg:hidden pointer-events-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-muted uppercase tracking-wider">Меню</span>
              <ThemeToggle />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-text dark:text-gray-200 hover:text-primary transition-colors py-2 border-b border-border/10 dark:border-white/5"
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-lg font-medium text-text dark:text-gray-200 hover:text-primary py-2 border-b border-border/10 dark:border-white/5">
                <User className="w-5 h-5" /> Вход в кабинет
            </Link>
            <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>
              <button className="bg-accent hover:bg-accent/80 w-full text-white font-bold py-3 rounded-full mt-4 shadow-lg shadow-accent/20">
                Заказать сейчас
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
