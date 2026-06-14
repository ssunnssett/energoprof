import { motion } from 'framer-motion';
import { PenTool, CheckCircle, Clock, Shield, ArrowRight, Zap, Award, Headphones } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'Проектирование и энергоаудит',
      subtitle: 'Точный расчет для максимальной эффективности',
      description: 'Наши инженеры проводят комплексный анализ объекта, замеряют пиковые нагрузки и учитывают пусковые токи. Мы разрабатываем проектную документацию, которая гарантирует надежность вашей системы энергоснабжения и отсутствие переплат за избыточную мощность.',
      features: ['Расчет нагрузок', 'Схемы подключения', 'Спецификация оборудования'],
      icon: <PenTool className="w-8 h-8 text-primary" />,
      img: '/img/services/audit.png'
    },
    {
      title: 'Доставка и монтажные работы',
      subtitle: 'Бережная логистика и профессиональная установка',
      description: 'Собственный парк спецтехники позволяет нам доставлять генераторы весом до 10 тонн в любую точку региона. Монтажная бригада подготовит фундамент, обеспечит правильную вентиляцию и отвод выхлопных газов, соблюдая все нормы пожарной безопасности.',
      features: ['Такелажные работы', 'Установка на фундамент', 'Системы вентиляции'],
      icon: <Clock className="w-8 h-8 text-primary" />,
      img: '/img/services/delivery.png'
    },
    {
      title: 'Пусконаладка и настройка АВР',
      subtitle: 'Интеллектуальное управление питанием',
      description: 'Мы не просто включаем генератор. Мы настраиваем систему автоматического ввода резерва (АВР) так, чтобы переход на резервное питание происходил за миллисекунды. Проводим стресс-тесты под реальной нагрузкой и обучаем ваш персонал работе с оборудованием.',
      features: ['Настройка контроллеров', 'Тестирование АВР', 'Обучение персонала'],
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      img: '/img/services/commissioning.png'
    },
    {
      title: 'Техническое обслуживание 24/7',
      subtitle: 'Ваша энергия под нашим контролем',
      description: 'Сервисный контракт с Энергопроф — это уверенность в завтрашнем дне. Мы берем на себя регулярное ТО, замену расходных материалов и мониторинг состояния систем. В случае аварии мобильная бригада выезжает на объект в течение 2 часов.',
      features: ['Плановое ТО', 'Поставка запчастей', 'Аварийный выезд'],
      icon: <Shield className="w-8 h-8 text-primary" />,
      img: '/img/services/maintenance_v2.png'
    }
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-6 md:px-12 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary text-sm font-bold mb-6"
          >
            <Zap className="w-4 h-4" /> ИНЖЕНЕРНЫЕ РЕШЕНИЯ ПОД КЛЮЧ
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold mb-8 text-text dark:text-white"
          >
            Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Услуги</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted dark:text-gray-400 text-lg md:text-2xl leading-relaxed"
          >
            От идеи до бесперебойного электроснабжения. Мы обеспечиваем надежность на каждом этапе жизненного цикла вашего энергооборудования.
          </motion.p>
        </div>
      </div>

      {/* Services Sections */}
      <div className="space-y-32">
        {services.map((srv, i) => (
          <section key={i} className="relative">
            <div className="container mx-auto px-6 md:px-12">
              <div className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
                {/* Image Side */}
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 rounded-[40px] blur-3xl opacity-30"></div>
                    <div className="glass rounded-[40px] overflow-hidden border border-border/10 dark:border-white/10 shadow-2xl group">
                      <img 
                        src={srv.img} 
                        alt={srv.title} 
                        className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-full lg:w-1/2"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      {srv.icon}
                    </div>
                    <div className="h-px flex-grow bg-gradient-to-r from-primary/50 to-transparent"></div>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text dark:text-white uppercase tracking-tight">{srv.title}</h2>
                  <p className="text-primary font-bold text-lg mb-6 uppercase tracking-widest">{srv.subtitle}</p>
                  <p className="text-muted dark:text-gray-400 text-lg md:text-xl leading-relaxed mb-8">
                    {srv.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-text dark:text-gray-300 font-medium">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openLeadModal', { detail: srv.title })); }}
                    className="glass py-4 px-8 rounded-full font-bold flex items-center gap-3 group hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-primary/5"
                  >
                    Оставить заявку <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-6 md:px-12 mt-40">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-12 rounded-[50px] border border-border/10 dark:border-white/5 relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 text-primary">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-text dark:text-white">Гарантия 2 года</h3>
              <p className="text-muted dark:text-gray-400 text-lg">На все виды выполненных монтажных работ</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 text-primary">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-text dark:text-white">Сертифицировано</h3>
              <p className="text-muted dark:text-gray-400 text-lg">Наши инженеры прошли обучение у заводов-изготовителей</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 text-primary">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-text dark:text-white">Поддержка 24/7</h3>
              <p className="text-muted dark:text-gray-400 text-lg">Выделенная линия для экстренных обращений клиентов</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
