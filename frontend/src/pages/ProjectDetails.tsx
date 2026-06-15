import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, User, MapPin, CheckCircle } from 'lucide-react';

const projectsData: Record<string, any> = {
  datacenter: {
    title: 'Резервное питание для ЦОД',
    client: 'Федеральный Дата-центр',
    date: 'Ноябрь 2025',
    location: 'г. Москва',
    description: 'Комплексный проект по обеспечению бесперебойного энергоснабжения крупного центра обработки данных. Была установлена дизельная электростанция мощностью 1 МВт с системой автоматического ввода резерва.',
    image: '/img/projects/datacenter.png',
    results: [
      'Полное резервирование мощности серверов.',
      'Время переключения на резерв — менее 10 секунд.',
      'Интеграция с существующей системой мониторинга.',
    ]
  },
  cottage: {
    title: 'Энергоснабжение коттеджного поселка',
    client: 'Элитный поселок "Новое Заречье"',
    date: 'Август 2025',
    location: 'Московская область',
    description: 'Внедрение системы из трех газонефтяных генераторов с синхронизацией для резервирования 50+ домов премиум-класса. Система работает в автоматическом режиме.',
    image: '/img/projects/cottage.png',
    results: [
      'Минимизация шума благодаря защитным кожухам.',
      'Умное распределение нагрузки между тремя установками.',
      'Круглосуточный мониторинг параметров сети.',
    ]
  },
  construction: {
    title: 'Мобильный генератор для стройки',
    client: 'СпецСтрой',
    date: 'Февраль 2026',
    location: 'г. Санкт-Петербург',
    description: 'Аренда и обслуживание мобильных генераторных установок на крупном строительном объекте в суровых зимних условиях. Обеспечение энергией кранов и бытовок.',
    image: '/img/projects/construction.png',
    results: [
      'Бесперебойная работа оборудования при -30°C.',
      'Еженедельное выездное техническое обслуживание.',
      'Оперативная заправка топливом.',
    ]
  }
};

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projectsData[id || 'datacenter'] || projectsData['datacenter'];

  return (
    <div className="pt-32 pb-20 min-h-screen relative z-10 w-full overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <Link to="/projects" className="inline-flex items-center gap-2 text-muted dark:text-gray-400 hover:text-text dark:hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
            <ChevronLeft className="w-5 h-5" />
            <span>Вернуться к проектам</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[40px] overflow-hidden border border-border/10 dark:border-white/5 shadow-2xl dark:shadow-none bg-surface/80 dark:bg-[#1a1d2d]/50 backdrop-blur-xl">
          <div className="h-64 md:h-[500px] w-full relative overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent dark:from-[#1a1d2d] dark:via-[#1a1d2d]/40" />
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-black text-text dark:text-white mb-2 leading-tight uppercase tracking-tighter">{project.title}</h1>
            </div>
          </div>
          <div className="p-8 md:p-16">
            <div className="grid md:grid-cols-3 gap-8 mb-16 border-b border-border/10 dark:border-white/10 pb-16">
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><User className="w-7 h-7" /></div>
                 <div><p className="text-[10px] text-muted dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Клиент</p><p className="font-bold text-lg text-text dark:text-white">{project.client}</p></div>
               </div>
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><Calendar className="w-7 h-7" /></div>
                 <div><p className="text-[10px] text-muted dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Дата сдачи</p><p className="font-bold text-lg text-text dark:text-white">{project.date}</p></div>
               </div>
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><MapPin className="w-7 h-7" /></div>
                 <div><p className="text-[10px] text-muted dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Локация</p><p className="font-bold text-lg text-text dark:text-white">{project.location}</p></div>
               </div>
            </div>
            
            <div className="grid lg:grid-cols-5 gap-16">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-black mb-6 text-text dark:text-white uppercase tracking-tight">О проекте</h2>
                <p className="text-muted dark:text-gray-300 text-xl leading-relaxed mb-8 max-w-4xl font-medium">{project.description}</p>
              </div>
              
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-black mb-6 text-text dark:text-white uppercase tracking-tight">Результаты</h2>
                <ul className="space-y-4">
                   {project.results.map((r: string, i: number) => (
                     <li key={i} className="flex items-center gap-4 bg-muted/5 dark:bg-white/5 p-4 rounded-2xl border border-border/10 dark:border-white/5">
                        <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                        <span className="text-text dark:text-gray-300 text-lg font-bold">{r}</span>
                     </li>
                   ))}
                </ul>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-border/10 dark:border-white/10 flex justify-center">
              <button onClick={() => window.dispatchEvent(new CustomEvent('openLeadModal', { detail: `Проект: ${project.title}` }))} className="btn-primary py-5 px-12 text-lg font-bold uppercase tracking-widest shadow-2xl shadow-primary/20">
                Заказать подобный проект
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default ProjectDetails;

