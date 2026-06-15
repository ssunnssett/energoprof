import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Надежность, проверенная временем</h1>
          <p className="text-xl text-gray-400">Мы предоставляем передовые решения для автономного электроснабжения с 2012 года.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="glass rounded-3xl p-2 h-96 overflow-hidden relative"
           >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay z-10" />
              <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1000&auto=format&fit=crop" alt="Engineers" className="w-[100%] h-[100%] object-cover rounded-2xl grayscale opacity-80" />
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
              <h2 className="text-3xl font-bold mb-6">Больше, чем просто магазин</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Энергопроф — это команда высококвалифицированных инженеров, готовых решить любую задачу, связанную с резервным и основным энергоснабжением.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Мы осуществляем полный цикл работ: от аудита объекта и проектирования до поставки, монтажа и пусконаладочных работ с последующим гарантийным обслуживанием.
              </p>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

import axios from 'axios';
import { formatPhone } from '../utils';

export const Contact = () => {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await axios.post('/applications', {
                name,
                phone,
                message,
                product: "Форма на странице Контакты"
            });
            setSent(true);
        } catch (err) {
            console.error(err);
            alert("Ошибка при отправке");
        } finally {
            setSending(false);
        }
    };

    return (
      <div className="min-h-[80vh] pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
           <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">Свяжитесь с нами</h1>
                  <p className="text-xl text-gray-400 mb-10">Наши инженеры ответят на все вопросы и помогут подобрать оборудование.</p>
                  
                  <div className="space-y-6">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary">
                              <Phone className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm">Телефон</p>
                              <p className="text-lg font-medium">+7 (800) 123-45-67</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary">
                              <Mail className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm">Email</p>
                              <p className="text-lg font-medium">info@energoprof.ru</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary">
                              <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm">Офис</p>
                              <p className="text-lg font-medium">г. Москва, ул. Энергетиков, д. 1</p>
                          </div>
                      </div>
                  </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card relative overflow-hidden"
              >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none" />
                  
                  {sent ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-10">
                          <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6"
                          >
                              <Send className="w-8 h-8" />
                          </motion.div>
                          <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
                          <p className="text-gray-400">Мы свяжемся с вами в течение 15 минут.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                          <h3 className="text-2xl font-bold mb-4">Оставить заявку</h3>
                          
                          <div>
                              <label className="block text-sm text-gray-400 mb-1">Имя</label>
                              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50 transition-colors" placeholder="Иван Иванов" />
                          </div>
                          
                          <div>
                              <label className="block text-sm text-gray-400 mb-1">Телефон</label>
                              <input required value={phone} onChange={e => setPhone(formatPhone(e.target.value))} type="tel" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50 transition-colors" placeholder="+7 (___) ___-__-__" />
                          </div>
                          
                          <div>
                              <label className="block text-sm text-gray-400 mb-1">Сообщение</label>
                              <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50 transition-colors resize-none" placeholder="Какая мощность вам нужна?"></textarea>
                          </div>
                          
                          <label className="flex items-start gap-2 mt-2 cursor-pointer group">
                            <input type="checkbox" required className="mt-0.5 accent-primary w-4 h-4 rounded border-white/10 bg-white/5" />
                            <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                              Я согласен на обработку персональных данных
                            </span>
                          </label>

                          <button type="submit" disabled={sending} className="btn-primary mt-2 py-4">
                              {sending ? <span className="animate-pulse">Отправка...</span> : <span>Отправить заявку</span>}
                          </button>
                      </form>
                  )}
              </motion.div>
           </div>
        </div>
      </div>
    );
};

