import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, CheckCircle, Shield, Zap, Battery, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import Particles from '../components/Particles';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full flex flex-col gap-2 md:gap-3 px-2 md:px-4 pt-2 md:pt-4 pb-8 transition-colors duration-500 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-surface dark:bg-[#0f111a] rounded-[24px] md:rounded-[32px] overflow-hidden flex items-center justify-center border border-border/10 dark:border-white/5 shadow-2xl transition-colors duration-500">
        {/* Ambient background glow inside section */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />

        {/* 3D Background */}
        <Hero3D />

        <div className="container relative w-full h-full z-10 mx-auto px-6 md:px-12 flex flex-col items-center justify-start pt-12 md:pt-16 pb-48 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center gap-6 max-w-5xl mx-auto pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/30 w-fit">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-muted dark:text-gray-300">Топовые генераторы в наличии</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text dark:text-white drop-shadow-sm dark:drop-shadow-lg">
              Энергия будущего <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">для ваших задач</span>
            </h1>

            <p className="text-lg md:text-xl text-muted dark:text-gray-300 max-w-2xl leading-relaxed">
              Надежные бензиновые, дизельные и инверторные генераторы премиум-класса с гарантией от производителя.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link to="/catalog">
                <button className="btn-primary">
                  <span>Перейти в каталог</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="btn-ghost" onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <span className="text-text dark:text-white">Подробнее</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 md:gap-12 mt-8 p-6 glass rounded-[40px] w-fit mx-auto shadow-xl dark:shadow-2xl backdrop-blur-md">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-text dark:text-white">5k+</span>
                <span className="text-sm text-muted dark:text-gray-400">Клиентов</span>
              </div>
              <div className="flex flex-col items-center border-l border-border/20 dark:border-white/10 pl-6 md:pl-12">
                <span className="text-3xl font-bold text-text dark:text-white">10</span>
                <span className="text-sm text-muted dark:text-gray-400">Лет на рынке</span>
              </div>
              <div className="flex flex-col items-center border-l border-border/20 dark:border-white/10 pl-6 md:pl-12">
                <span className="text-3xl font-bold text-text dark:text-white">24/7</span>
                <span className="text-sm text-muted dark:text-gray-400">Поддержка</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10 bg-surface dark:bg-[#0f111a] rounded-[24px] md:rounded-[32px] overflow-hidden border border-border/10 dark:border-white/5 shadow-2xl transition-colors duration-500">
        <Particles color={theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.2)'} count={80} className="opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 dark:bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 dark:bg-accent/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col items-center text-center mb-20 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-2 px-1 bg-gradient-to-r from-transparent via-primary to-transparent mb-8"
            />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-bold mb-8 tracking-tight leading-tight text-text dark:text-white"
            >
              Премиальное качество <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient">
                в каждой детали
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted dark:text-gray-400 text-xl md:text-2xl leading-relaxed max-w-3xl"
            >
              Мы продаем не просто генераторы, мы обеспечиваем <span className="text-text dark:text-white font-medium">абсолютную энергетическую независимость</span> для вашего дома и бизнеса.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { 
                icon: Shield, 
                title: 'Надежность', 
                desc: 'Европейские комплектующие и многоступенчатый контроль качества каждой сборки.',
                color: 'from-blue-500/20'
              },
              { 
                icon: Zap, 
                title: 'Продуктивность', 
                desc: 'Максимальный КПД и стабильное напряжение для самой чувствительной электроники.',
                color: 'from-amber-500/20'
              },
              { 
                icon: Battery, 
                title: 'Автономность', 
                desc: 'Умные системы АВР мгновенно переключают питание при перебоях в сети.',
                color: 'from-emerald-500/20'
              },
              { 
                icon: Tool, 
                title: 'Сервис 24/7', 
                desc: 'Собственная сервисная служба готова выехать на объект в любое время суток.',
                color: 'from-purple-500/20'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card group relative p-8 h-full flex flex-col items-center text-center overflow-hidden border-border/10 dark:border-white/5 hover:border-primary/20 transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="electric-waves opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-20 h-20 rounded-[30px] bg-white/10 dark:bg-white/5 border border-border/20 dark:border-white/10 flex items-center justify-center mb-8 group-hover:bg-white/20 dark:group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 relative z-10 shadow-lg">
                  <feature.icon className="w-10 h-10 text-primary group-hover:text-accent transition-colors duration-500" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-text dark:text-white relative z-10">{feature.title}</h3>
                <p className="text-muted dark:text-gray-400 leading-relaxed text-lg relative z-10 group-hover:text-text dark:group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Preview */}
      <section className="py-24 relative z-10 bg-surface dark:bg-[#0f111a] rounded-[24px] md:rounded-[32px] overflow-hidden border border-border/10 dark:border-white/5 shadow-2xl transition-colors duration-500">
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text dark:text-white">Популярные модели</h2>
              <p className="text-muted dark:text-gray-400">Генераторы, которые выбирают чаще всего</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 text-primary hover:text-text dark:hover:text-white transition-colors">
              Смотреть все <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card flex flex-col group border-border/10 dark:border-white/5"
              >
                <div className="electric-waves opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative h-64 -mx-6 -mt-6 mb-6 bg-white/5 dark:bg-[#0f111a] overflow-hidden flex items-center justify-center p-8 rounded-t-[40px] border-b border-border/10 dark:border-white/5">
                  <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src={`/img/diesel/${i}.png`} className="object-contain h-full relative z-10 group-hover:scale-110 transition-transform duration-700 ease-in-out drop-shadow-2xl" alt="Generator" />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex px-2 py-1 rounded bg-muted/10 dark:bg-white/10 text-xs font-semibold text-muted dark:text-gray-300">Инверторный</div>
                  <div className="text-primary font-bold text-xl">{i * 25} 000 ₽</div>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-text dark:text-white">TSS Pro {i}000X</h3>

                <ul className="mb-8 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted dark:text-gray-400"><CheckCircle className="w-4 h-4 text-green-500" /> Мощность: {i * 2.5} кВт</li>
                  <li className="flex items-center gap-2 text-sm text-muted dark:text-gray-400"><CheckCircle className="w-4 h-4 text-green-500" /> Топливо: Бензин</li>
                  <li className="flex items-center gap-2 text-sm text-muted dark:text-gray-400"><CheckCircle className="w-4 h-4 text-green-500" /> Автозапуск: Есть</li>
                </ul>

                <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openLeadModal', { detail: `TSS Pro ${i}000X` })); }} className="btn-primary w-full mt-auto py-3 relative overflow-hidden group/btn">
                  <span className="relative z-10">Оставить заявку</span>
                  <div className="absolute inset-0 h-full w-full block bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Redesigned for Premium Minimal Look */}
      <section className="py-40 relative z-10 bg-surface dark:bg-[#0f111a] rounded-[24px] md:rounded-[32px] overflow-hidden transition-colors duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 dark:bg-primary/10 blur-[150px] scale-150 pointer-events-none" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-accent/10 dark:bg-accent/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
            >
              Консультация эксперта
            </motion.div>

            <h2 className="text-5xl md:text-8xl font-black mb-8 text-text dark:text-white leading-[1.1] tracking-tighter">
              Готовы выбрать свой <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient">
                генератор?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted dark:text-gray-400 max-w-2xl mb-16 leading-relaxed">
              Оставьте заявку, и наши инженеры подберут оптимальное решение <br className="hidden md:block"/>
              с расчетом стоимости в течение 15 минут.
            </p>

            <form className="w-full max-w-2xl flex flex-col items-center gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="w-full flex flex-col md:flex-row gap-4 p-2 bg-white/80 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-[32px] backdrop-blur-3xl shadow-[0_48px_100px_-12px_rgba(0,0,0,0.2)] transition-all duration-500">
                <input 
                  type="tel" 
                  required
                  placeholder="Ваш номер телефона" 
                  className="flex-grow px-8 py-5 rounded-[24px] bg-transparent text-text dark:text-white placeholder-muted dark:placeholder-gray-500 outline-none transition-all text-lg font-medium focus:pl-10" 
                />
                <button type="submit" className="btn-accent py-5 px-12 rounded-[24px] text-lg font-black uppercase tracking-widest shadow-2xl shadow-accent/40 hover:shadow-accent/60 hover:scale-[1.02] active:scale-95 transition-all">
                  Получить расчет
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer group mt-2">
                <input type="checkbox" required className="accent-primary w-4 h-4 rounded border-white/10 bg-white/5" />
                <span className="text-xs text-muted dark:text-gray-500 font-medium group-hover:text-gray-400 transition-colors">
                  Согласен на <a href="#" className="text-primary hover:underline">обработку персональных данных</a>
                </span>
              </label>
            </form>
            
            <p className="mt-6 text-xs text-muted dark:text-gray-500 font-medium">Бесплатная консультация • Подбор за 15 минут • Гарантия лучшей цены</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

