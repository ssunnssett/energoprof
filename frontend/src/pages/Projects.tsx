import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Projects = () => {
  const projects = [
    {
      id: 'datacenter',
      title: 'Резервное питание для ЦОД',
      category: 'Промышленный объект',
      desc: 'Установка дизельной электростанции мощностью 1 МВт для обеспечения бесперебойной работы серверов дата-центра.',
      img: '/img/projects/datacenter.png'
    },
    {
      id: 'cottage',
      title: 'Энергоснабжение коттеджного поселка',
      category: 'Жилой сектор',
      desc: 'Комплексное внедрение трех газонефтяных генераторов с синхронизацией для резервирования 50+ домов.',
      img: '/img/projects/cottage.png'
    },
    {
      id: 'construction',
      title: 'Мобильный генератор для стройки',
      category: 'Строительство',
      desc: 'Аренда и обслуживание мобильных генераторных установок на крупном строительном объекте в суровых зимних условиях.',
      img: '/img/projects/construction.png'
    }
  ];

  return (
    <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-text dark:text-white"
        >
          Реализованные <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Проекты</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted dark:text-gray-400 text-lg md:text-xl"
        >
          Гордимся нашими работами. Изучите наши успешные кейсы внедрения систем энергоснабжения.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {projects.map((proj, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 0.3 }}
            className="glass-card group flex flex-col p-0 overflow-hidden border-border/10 dark:border-white/5 shadow-xl dark:shadow-none transition-all duration-500"
          >
            <div className="relative h-60 overflow-hidden bg-muted/5 dark:bg-white/5">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <img 
                src={proj.img} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={proj.title} 
              />
              <div className="absolute top-4 left-4 z-20 glass px-4 py-1 rounded-full text-[10px] font-bold text-text dark:text-white uppercase tracking-widest border border-border/20 dark:border-white/20">
                {proj.category}
              </div>
            </div>
            <div className="p-8 relative">
              <div className="electric-waves opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="text-2xl font-bold mb-3 text-text dark:text-white group-hover:text-primary transition-colors leading-tight">{proj.title}</h3>
              <p className="text-muted dark:text-gray-400 leading-relaxed font-medium">{proj.desc}</p>
              <Link to={`/projects/${proj.id}`} className="mt-6 text-primary font-bold uppercase tracking-wider text-sm group-hover:text-accent transition-colors flex items-center gap-2 w-fit">
                Смотреть кейс 
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

