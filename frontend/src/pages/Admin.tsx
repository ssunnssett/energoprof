import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, MessageSquare, Users, LogOut, Edit, Trash2, Plus, X, 
  ChevronDown, CheckCircle, XCircle, RefreshCw, PlusCircle, Zap, Fuel, Battery, Cpu, Activity, Box,
  TrendingUp, BarChart3, ArrowUpRight, Calendar, History, Shield,
  RotateCcw, AlertTriangle, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const CustomSelect = ({ value, onChange, options, className = "" }: { 
  value: string, 
  onChange: (val: string) => void, 
  options: { value: string, label: string, icon: any, color?: string }[],
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/10 dark:border-white/10 bg-muted/5 dark:bg-white/5 hover:bg-muted/10 dark:hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest ${selectedOption.color || 'text-text dark:text-white'}`}
      >
        <div className="flex items-center gap-2">
          {selectedOption.icon && <selectedOption.icon className="w-4 h-4" />}
          {selectedOption.label}
        </div>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute z-[110] left-0 right-0 mt-2 p-1.5 rounded-2xl border border-border/20 dark:border-white/10 bg-surface dark:bg-[#1a1d2d] shadow-2xl backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${opt.value === value ? 'bg-primary/10 text-primary' : 'text-muted dark:text-gray-400 hover:bg-muted/5 dark:hover:bg-white/5 hover:text-text dark:hover:text-white'} ${opt.color && opt.value === value ? opt.color : ''}`}
              >
                {opt.icon && <opt.icon className={`w-4 h-4 ${opt.value !== value && opt.color ? opt.color : ''}`} />}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1d2d]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-white">{payload[0].value} <span className="text-xs font-medium text-gray-400">единиц</span></p>
      </div>
    );
  }
  return null;
};

const GlassBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return (
    <g>
      <defs>
        <linearGradient id={`glass-grad-${fill}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={fill} stopOpacity={0.8} />
          <stop offset="50%" stopColor={fill} stopOpacity={0.4} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect 
        x={x} y={y} width={width} height={height} rx={8} 
        fill={`url(#glass-grad-${fill})`} 
        stroke={fill} strokeWidth={1} strokeOpacity={0.3}
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
      />
      <rect x={x + 2} y={y + 2} width={width / 3} height={height - 4} rx={4} fill="white" fillOpacity={0.1} />
    </g>
  );
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsFilter, setLeadsFilter] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  // Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
     name: '', description: '', price: '' as number | '', power: '' as number | '', fuel_type: '', image: '', stock: 0
  });

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
  };

  // Rollback Modal
  const [rollbackLogItem, setRollbackLogItem] = useState<any>(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchData = async () => {
      try {
          if (activeTab === 'users') {
              const res = await axios.get('http://127.0.0.1:8000/api/users', { headers });
              setUsers(res.data);
          } else if (activeTab === 'leads') {
              const res = await axios.get('http://127.0.0.1:8000/applications', { headers });
              setLeads(res.data);
          } else if (activeTab === 'products') {
              const res = await axios.get('http://127.0.0.1:8000/products');
              setProducts(res.data);
          } else if (activeTab === 'logs') {
              const res = await axios.get('http://127.0.0.1:8000/api/logs', { headers });
              setLogs(res.data);
          } else if (activeTab === 'dashboard') {
              const res1 = await axios.get('http://127.0.0.1:8000/applications', { headers });
              const res2 = await axios.get('http://127.0.0.1:8000/products');
              const res3 = await axios.get('http://127.0.0.1:8000/api/logs', { headers });
              setLeads(res1.data);
              setProducts(res2.data);
              setLogs(res3.data);
          }
      } catch (err) {
          console.error("Fetch error", err);
      }
  };

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchData();
  }, [activeTab]);

  const updateLeadStatus = async (id: number, status: string) => {
      try {
          await axios.put(`http://127.0.0.1:8000/applications/${id}`, { status }, { headers });
          fetchData();
      } catch (err) {
          showNotification('Ошибка обновления статуса', 'error');
      }
  };

  const handleProductSubmit = async (e: any) => {
      e.preventDefault();
      try {
          if (editingProduct) {
              await axios.put(`http://127.0.0.1:8000/products/${editingProduct.id}`, productForm, { headers });
              showNotification('Товар успешно обновлен');
          } else {
              await axios.post('http://127.0.0.1:8000/products', productForm, { headers });
              showNotification('Товар успешно добавлен');
          }
          setIsProductModalOpen(false);
          fetchData();
      } catch (err) {
          showNotification('Ошибка сохранения товара', 'error');
      }
  };

  const deleteProduct = async (id: number) => {
      if(window.confirm('Удалить товар?')) {
          try {
              await axios.delete(`http://127.0.0.1:8000/products/${id}`, { headers });
              showNotification('Товар успешно удален');
              fetchData();
          } catch(err) {
              showNotification('Ошибка удаления товара', 'error');
          }
      }
  };

  const openProductModal = (product: any = null) => {
      if (product) {
          setEditingProduct(product);
          setProductForm({ ...product });
      } else {
          setEditingProduct(null);
          setProductForm({ name: '', description: '', price: '', power: '', fuel_type: 'Бензиновые генераторы', image: '', stock: 0 });
      }
      setIsProductModalOpen(true);
  };

  const rollbackLog = async (logId: number) => {
      try {
          await axios.post(`http://127.0.0.1:8000/api/logs/${logId}/rollback`, {}, { headers });
          setRollbackLogItem(null);
          showNotification('Действие успешно откачено');
          fetchData();
      } catch (err: any) {
          showNotification(err.response?.data?.detail || 'Ошибка отката', 'error');
      }
  };

  const exportLeadsToExcel = async () => {
    if (leads.length === 0) {
      showNotification('Нет данных для экспорта', 'info');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Заявки');

      // Define columns
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Дата', key: 'date', width: 22 },
        { header: 'Имя', key: 'name', width: 30 },
        { header: 'Телефон', key: 'phone', width: 20 },
        { header: 'Товар/Услуга', key: 'product', width: 40 },
        { header: 'Сообщение', key: 'message', width: 60 },
        { header: 'Статус', key: 'status', width: 20 }
      ];

      // Add rows
      leads.forEach(lead => {
        worksheet.addRow({
          id: lead.id,
          date: new Date(lead.created_at).toLocaleString('ru-RU'),
          name: lead.name,
          phone: lead.phone,
          product: lead.product || '—',
          message: lead.message,
          status: statusOptions.find(opt => opt.value === lead.status)?.label || lead.status
        });
      });

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          size: 14,
          color: { argb: 'FF1E293B' } // Slate-800
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF1F5F9' } // Slate-100 (gentle gray)
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
        };
      });
      headerRow.height = 30;

      // Add some padding to rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.height = 25;
          row.alignment = { vertical: 'middle' };
        }
      });

      // Generate buffer and save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Заявки_Energoprof_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      showNotification('Excel файл с оформлением сформирован и загружен');
    } catch (error) {
      console.error("Export error", error);
      showNotification('Ошибка при экспорте в Excel', 'error');
    }
  };

  const statusOptions = [
    { value: 'new', label: 'Новая', icon: PlusCircle, color: 'text-blue-500' },
    { value: 'processing', label: 'В обработке', icon: RefreshCw, color: 'text-yellow-600 dark:text-yellow-400' },
    { value: 'accepted', label: 'Выполнена', icon: CheckCircle, color: 'text-green-600 dark:text-green-400' },
    { value: 'canceled', label: 'Отменена', icon: XCircle, color: 'text-red-500' },
  ];

  const categoryOptions = [
    { value: 'Бензиновые генераторы', label: 'Бензиновые', icon: Zap },
    { value: 'Дизельные генераторы', label: 'Дизельные', icon: Fuel },
    { value: 'Источники бесперебойного питания (ИБП)', label: 'ИБП', icon: Battery },
    { value: 'Блоки автоматического ввода резерва (АВР)', label: 'АВР', icon: Cpu },
    { value: 'Стабилизаторы напряжения', label: 'Стабилизаторы', icon: Activity },
    { value: 'Контейнеры', label: 'Контейнеры', icon: Box },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'];

  // Analytics Data Processing
  const analyticsData = useMemo(() => {
    // Leads by day (last 14 days for more dynamics)
    const days = Array.from({length: 14}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    });

    const leadCounts = days.map((day, idx) => {
      const count = leads.filter(l => {
        const leadDate = new Date(l.created_at);
        const compareDate = new Date();
        compareDate.setDate(compareDate.getDate() - (13 - idx));
        return leadDate.toDateString() === compareDate.toDateString();
      }).length;
      return { name: day, value: count };
    });

    // Leads by status
    const statusData = [
      { name: 'В работе', value: leads.filter(l => l.status === 'processing').length, color: '#eab308' },
      { name: 'Новые', value: leads.filter(l => l.status === 'new').length, color: '#3b82f6' },
      { name: 'Отказ', value: leads.filter(l => l.status === 'canceled').length, color: '#ef4444' },
      { name: 'Успех', value: leads.filter(l => l.status === 'accepted').length, color: '#22c55e' },
    ].filter(s => s.value > 0);

    // Categories Distribution (scanned from leads)
    const catDataMap: Record<string, number> = {};
    leads.forEach(l => {
      const cat = l.product || 'Прочее';
      const shortLabel = categoryOptions.find(o => cat.includes(o.label))?.label || cat.split(' ')[0];
      catDataMap[shortLabel] = (catDataMap[shortLabel] || 0) + 1;
    });
    const catData = Object.entries(catDataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 4)
      .map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));

    return { leadCounts, statusData, catData };
  }, [leads]);

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (action.includes('delete')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (action.includes('update')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (action.includes('rollback')) return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    return 'text-muted bg-muted/5 border-border/10';
  };

  const getActionLabel = (action: string) => {
    const map: Record<string, string> = {
      'create_product': 'Создание товара',
      'update_product': 'Изменение товара',
      'delete_product': 'Удаление товара',
      'update_application_status': 'Статус заявки',
      'rollback': 'Откат действия',
    };
    return map[action] || action;
  };

  const renderChanges = (log: any) => {
      if (!log.before_state && !log.after_state) return log.details;
      
      try {
          const before = log.before_state ? JSON.parse(log.before_state) : null;
          const after = log.after_state ? JSON.parse(log.after_state) : null;

          if (log.action === 'update_application_status' && before && after) {
            return (
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-muted/10 border border-border/10">{before.status}</span>
                    <ArrowRight className="w-3 h-3 text-muted" />
                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">{after.status}</span>
                </div>
            );
          }

          if (log.action === 'update_product' && before && after) {
              const changedKeys = Object.keys(after).filter(k => before[k] !== after[k]);
              return (
                  <div className="space-y-1">
                      {changedKeys.map(k => (
                          <div key={k} className="flex items-center gap-2 text-[10px]">
                              <span className="text-gray-500 font-bold uppercase tracking-tight w-16">{k}:</span>
                              <span className="line-through opacity-50">{before[k]}</span>
                              <ArrowRight className="w-3 h-3 text-primary" />
                              <span className="text-text dark:text-white font-bold">{after[k]}</span>
                          </div>
                      ))}
                  </div>
              );
          }

          return log.details;
      } catch (e) {
          return log.details;
      }
  };

  return (
    <div className="min-h-screen bg-background relative z-10 w-full flex text-text dark:text-white" style={{ paddingTop: '140px' }}>
        {/* Sidebar */}
        <div className="w-64 glass border border-border/10 dark:border-white/10 flex flex-col pt-12 px-4 sticky top-[140px] h-[calc(100vh-180px)] ml-8 mb-10 rounded-[40px] transition-all duration-500 shadow-2xl shadow-black/20">
            <div className="text-xl font-black mb-10 px-4 uppercase tracking-tighter">Admin<span className="text-primary italic">Panel</span></div>
            <nav className="flex flex-col gap-2">
                {[
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд' },
                    { id: 'leads', icon: MessageSquare, label: 'Заявки' },
                    { id: 'products', icon: Package, label: 'Товары' },
                    { id: 'users', icon: Users, label: 'Пользователи' },
                    { id: 'logs', icon: History, label: 'Логи действий' },
                ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-[10px] border ${activeTab === item.id ? 'bg-primary/10 text-primary border-primary/30 shadow-lg shadow-primary/5' : 'text-muted dark:text-gray-400 border-transparent hover:bg-muted/5 dark:hover:bg-white/5 hover:text-text dark:hover:text-white'}`}
                    >
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary' : 'text-muted dark:text-gray-400'}`} />
                        {item.label}
                    </button>
                ))}
            </nav>
            <button 
                onClick={() => {
                   localStorage.removeItem('token');
                   localStorage.removeItem('role');
                   window.dispatchEvent(new Event('storage'));
                   window.location.href = '/';
                }}
                className="mt-auto mb-10 flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px]"
            >
                <LogOut className="w-5 h-5" />
                Выход
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 pt-10 overflow-y-auto w-full max-w-[100vw] transition-all duration-500">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black uppercase tracking-tight">
                    {activeTab === 'dashboard' ? 'Обзор' : activeTab === 'leads' ? 'Заявки с сайта' : activeTab === 'products' ? 'Каталог товаров' : activeTab === 'users' ? 'Пользователи' : 'Логи действий'}
                </h1>
                {activeTab === 'products' && (
                    <button onClick={() => openProductModal()} className="btn-primary flex items-center gap-2 py-3 px-6 shadow-xl shadow-primary/20 font-bold uppercase tracking-widest text-xs">
                        <Plus className="w-5 h-5" /> Добавить товар
                    </button>
                )}
                {activeTab === 'leads' && (
                    <button onClick={exportLeadsToExcel} className="flex items-center gap-2 py-3 px-6 bg-green-500/10 text-green-500 border border-green-500/20 rounded-2xl hover:bg-green-500/20 transition-all font-bold uppercase tracking-widest text-xs">
                        <ArrowUpRight className="w-4 h-4" /> Экспорт Excel
                    </button>
                )}
            </div>
            
            {activeTab === 'dashboard' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                    {/* Upper Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Area Chart - Trends (Large) */}
                        <div className="lg:col-span-2 glass rounded-[40px] p-8 border-border/10 dark:border-white/5 shadow-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                <TrendingUp className="w-48 h-48" />
                            </div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <TrendingUp className="text-primary w-6 h-6" /> Динамика активности
                                </h3>
                                <div className="flex gap-2">
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> 14 дней
                                    </div>
                                </div>
                            </div>
                            <div className="h-[350px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analyticsData.leadCounts}>
                                        <defs>
                                            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                        <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} tick={{fill: '#888'}} dy={10} />
                                        <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorArea)" animationDuration={2000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart - Interactive Glass */}
                        <div className="glass rounded-[40px] p-8 border-border/10 dark:border-white/5 shadow-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl flex flex-col items-center">
                            <div className="w-full flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <BarChart3 className="text-primary w-6 h-6" /> Спрос
                                </h3>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analyticsData.statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={105}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                            animationDuration={1500}
                                        >
                                            {analyticsData.statusData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color} 
                                                    style={{ filter: `drop-shadow(0 8px 12px ${entry.color}44)` }} 
                                                    className="hover:opacity-80 transition-all cursor-pointer"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Lower Section Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {/* Categories Bar */}
                         <div className="glass rounded-[40px] p-8 border-border/10 dark:border-white/5 shadow-2xl bg-white/30 dark:bg-white/5 backdrop-blur-xl">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted dark:text-gray-400 mb-6 flex items-center gap-2">
                                <Box className="w-4 h-4 text-primary" /> Популярные ниши
                            </h3>
                            <div className="h-[220px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analyticsData.catData}>
                                        <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} tick={{fill: '#888'}} hide />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" shape={<GlassBar />} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {analyticsData.catData.map((d, i) => (
                                    <div key={i} className="px-3 py-1 rounded-full bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                         </div>

                         {/* Quick Stats Card 1 */}
                         <div className="glass rounded-[40px] p-8 border-border/10 dark:border-white/5 shadow-2xl bg-gradient-to-br from-primary/10 to-transparent flex flex-col justify-between group">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Конверсия за день</p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-5xl font-black">92%</h2>
                                    <ArrowUpRight className="text-green-500 w-6 h-6 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-text transition-colors">
                                <span>Рекорд за месяц</span>
                                <span className="p-1.5 bg-white/5 rounded-lg border border-white/10">0.4s load</span>
                            </div>
                         </div>

                         {/* Quick Stats Card 2 */}
                         <div className="glass rounded-[40px] p-8 border-border/10 dark:border-white/5 shadow-2xl bg-gradient-to-br from-blue-500/10 to-transparent flex flex-col justify-between">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Записи в логах</p>
                                    <h2 className="text-5xl font-black">{logs.length}</h2>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                                    <History className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                                <Shield className="w-4 h-4 opacity-50" /> Безопасность под контролем
                            </div>
                         </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'logs' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="glass rounded-[40px] p-2 overflow-hidden border-border/10 dark:border-white/5 shadow-2xl dark:shadow-none bg-surface/50 dark:bg-transparent">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-2 px-6">
                                <thead>
                                    <tr className="text-muted dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="py-6 px-4">Время</th>
                                        <th className="py-6 px-4">Администратор</th>
                                        <th className="py-6 px-4">Действие</th>
                                        <th className="py-6 px-4">Изменения</th>
                                        <th className="py-6 px-4 text-right">Контроль</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} className="bg-muted/5 dark:bg-white/5 hover:bg-muted/10 dark:hover:bg-white/10 transition-all duration-300 rounded-2xl group">
                                            <td className="py-5 px-4 first:rounded-l-2xl">
                                                <div className="font-bold text-sm text-text dark:text-white">
                                                    {new Date(log.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="text-[10px] text-muted dark:text-gray-500 font-medium">
                                                    {new Date(log.timestamp).toLocaleDateString('ru-RU')}
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                                                        {log.user?.login?.[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-text dark:text-white">{log.user?.login}</div>
                                                        <div className="text-[10px] text-muted uppercase font-bold tracking-tight">ID: #{log.user_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getActionColor(log.action)}`}>
                                                    {getActionLabel(log.action)}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 font-medium text-xs text-muted dark:text-gray-400 max-w-md">
                                                {renderChanges(log)}
                                            </td>
                                            <td className="py-5 px-4 last:rounded-r-2xl text-right">
                                                {(log.action !== 'rollback' && log.action !== 'create_user' && (log.before_state || log.action === 'create_product')) && (
                                                    <button 
                                                        onClick={() => setRollbackLogItem(log)}
                                                        className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-purple-500/10 active:scale-95 group/undo"
                                                        title="Откатить действие"
                                                    >
                                                        <RotateCcw className="w-4 h-4 group-hover/undo:rotate-[-45deg] transition-transform" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr><td colSpan={5} className="py-20 text-center text-muted dark:text-gray-500 font-bold uppercase tracking-widest text-xs">Логи отсутствуют</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'leads' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                            { id: 'all', label: 'Все', color: 'border-border/20' },
                            { id: 'new', label: 'Новые', color: 'text-blue-500 border-blue-500/30 bg-blue-500/5' },
                            { id: 'processing', label: 'В обработке', color: 'text-yellow-600 dark:text-yellow-400 border-yellow-500/30 bg-yellow-500/5' },
                            { id: 'accepted', label: 'Выполненные', color: 'text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5' },
                            { id: 'canceled', label: 'Отмененные', color: 'text-red-500 border-red-500/30 bg-red-500/5' }
                        ].map(f => (
                            <button 
                                key={f.id}
                                onClick={() => setLeadsFilter(f.id)} 
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${leadsFilter === f.id ? f.color + ' ring-2 ring-primary/20' : 'bg-transparent text-muted dark:text-gray-400 border-border/10 dark:border-white/10 hover:bg-muted/5 dark:hover:bg-white/5'}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="glass rounded-[40px] p-2 overflow-hidden border-border/10 dark:border-white/5 shadow-2xl dark:shadow-none bg-surface/50 dark:bg-transparent">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[1000px] border-separate border-spacing-y-2 px-6">
                                <thead>
                                    <tr className="text-muted dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="py-6 px-4">Дата / ID</th>
                                        <th className="py-6 px-4">Клиент</th>
                                        <th className="py-6 px-4">Товар/Услуга</th>
                                        <th className="py-6 px-4">Сообщение</th>
                                        <th className="py-6 px-4">Статус</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.filter(l => leadsFilter === 'all' || l.status === leadsFilter).map(lead => (
                                        <tr key={lead.id} className="bg-muted/5 dark:bg-white/5 hover:bg-muted/10 dark:hover:bg-white/10 transition-all duration-300 group rounded-2xl">
                                            <td className="py-5 px-4 first:rounded-l-2xl">
                                                <div className="font-bold text-sm text-text dark:text-white">{new Date(lead.created_at).toLocaleDateString('ru-RU')}</div>
                                                <div className="text-[10px] text-muted dark:text-gray-500 font-mono mt-1 opacity-60 group-hover:opacity-100 italic transition-opacity">ID: #{lead.id}</div>
                                            </td>
                                            <td className="py-5 px-4 font-bold">
                                                <div className="text-text dark:text-white mb-1">{lead.name}</div>
                                                <div className="text-xs text-primary font-bold tracking-tight">{lead.phone}</div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="px-3 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10 w-fit text-xs font-bold uppercase tracking-tight">
                                                    {lead.product || '—'}
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-muted dark:text-gray-400 text-xs leading-relaxed max-w-sm font-medium line-clamp-2 hover:line-clamp-none transition-all">{lead.message}</p>
                                            </td>
                                            <td className="py-5 px-4 last:rounded-r-2xl">
                                                <CustomSelect 
                                                  value={lead.status}
                                                  onChange={(val) => updateLeadStatus(lead.id, val)}
                                                  options={statusOptions}
                                                  className="w-48"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.filter(l => leadsFilter === 'all' || l.status === leadsFilter).length === 0 && (
                                        <tr><td colSpan={5} className="py-20 text-center text-muted dark:text-gray-500 font-bold uppercase tracking-widest text-xs">Нет заявок</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'products' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(p => (
                            <div key={p.id} className="glass rounded-[32px] p-5 flex flex-col relative group border-border/10 dark:border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl dark:shadow-none bg-surface/50 dark:bg-transparent">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 scale-90 group-hover:scale-100">
                                    <button onClick={() => openProductModal(p)} className="p-2.5 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => deleteProduct(p.id)} className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:scale-110 active:scale-95 transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <div className="h-48 bg-muted/5 dark:bg-white/5 rounded-2xl mb-5 flex items-center justify-center overflow-hidden border border-border/5 dark:border-white/5 p-4">
                                     {p.image ? <img src={p.image} className="h-full object-contain drop-shadow-lg" alt={p.name} /> : <Package className="w-16 h-16 text-muted/20 dark:text-white/10" />}
                                </div>
                                <div className="text-[10px] font-black text-primary mb-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit uppercase tracking-widest">{p.fuel_type}</div>
                                <h3 className="font-bold text-lg mb-3 line-clamp-2 min-h-[56px] text-text dark:text-white leading-snug">{p.name}</h3>
                                <div className="mt-auto pt-4 border-t border-border/5 dark:border-white/5 flex items-center justify-between">
                                    <p className="text-sm font-bold text-muted dark:text-gray-500 uppercase tracking-widest">Цена</p>
                                    <p className="text-xl font-black text-primary">{p.price === 0 ? 'По запросу' : `${p.price.toLocaleString()} ₽`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="glass rounded-[40px] p-2 overflow-hidden border-border/10 dark:border-white/5 shadow-2xl dark:shadow-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-2 px-6">
                                <thead>
                                    <tr className="text-muted dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="py-6 px-4">ID</th>
                                        <th className="py-6 px-4">Имя</th>
                                        <th className="py-6 px-4">Телефон</th>
                                        <th className="py-6 px-4">Логин</th>
                                        <th className="py-6 px-4">Роль</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="bg-muted/5 dark:bg-white/5 hover:bg-muted/10 dark:hover:bg-white/10 transition-all duration-300 rounded-2xl">
                                            <td className="py-5 px-4 font-mono text-xs first:rounded-l-2xl opacity-60">#{user.id}</td>
                                            <td className="py-5 px-4 font-bold text-text dark:text-white">{user.first_name} {user.last_name}</td>
                                            <td className="py-5 px-4 font-bold text-primary">{user.phone || '—'}</td>
                                            <td className="py-5 px-4 text-muted dark:text-gray-400 font-medium">{user.login}</td>
                                            <td className="py-5 px-4 last:rounded-r-2xl">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current bg-current/5 ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {user.role === 'admin' ? 'Админ' : 'Клиент'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>

        {/* Product Modal */}
        <AnimatePresence>
            {isProductModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 dark:bg-black/80 backdrop-blur-md p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-surface dark:bg-[#1a1d2d] border border-border/20 dark:border-white/10 p-10 rounded-[40px] max-w-2xl w-full relative shadow-3xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 text-muted dark:text-gray-400 hover:text-text dark:hover:text-white transition-colors bg-muted/5 p-2 rounded-full">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-3xl font-black mb-8 uppercase tracking-tight text-text dark:text-white">{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h2>
                        <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Название товара</label>
                                <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl px-5 py-3 text-text dark:text-white outline-none focus:border-primary transition-all font-bold placeholder:font-normal" placeholder="Введите название..." />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Категория</label>
                                <CustomSelect 
                                  value={productForm.fuel_type}
                                  onChange={(val) => setProductForm({...productForm, fuel_type: val})}
                                  options={categoryOptions}
                                  className="w-full"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Описание (преимущества)</label>
                                <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows={4} className="w-full bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl px-5 py-3 text-text dark:text-white outline-none focus:border-primary transition-all font-medium resize-none" placeholder="Расскажите о товаре..."></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Цена (0 = По запросу)</label>
                                <input required type="number" min="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl px-5 py-3 text-text dark:text-white font-black outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">Мощность (кВт)</label>
                                <input type="number" step="0.1" value={productForm.power} onChange={e => setProductForm({...productForm, power: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl px-5 py-3 text-text dark:text-white font-black outline-none focus:border-primary" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-muted dark:text-gray-400 mb-2 uppercase tracking-widest">URL изображения</label>
                                <input value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-muted/5 dark:bg-white/5 border border-border/10 dark:border-white/10 rounded-2xl px-5 py-3 text-text dark:text-white outline-none focus:border-primary font-medium" placeholder="https://..." />
                            </div>
                            <div className="col-span-2 mt-6">
                                <button type="submit" className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group relative overflow-hidden">
                                   <span className="relative z-10">Сохранить изменения</span>
                                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Rollback Confirmation Modal */}
        <AnimatePresence>
            {rollbackLogItem && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/90 dark:bg-black/90 backdrop-blur-xl p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-surface dark:bg-[#1a1d2d] border border-red-500/20 p-10 rounded-[40px] max-w-lg w-full relative shadow-3xl text-center">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Подтвердите отмену</h2>
                        <p className="text-muted dark:text-gray-400 mb-8 font-medium">
                            Вы собираетесь откатить действие: <br/> 
                            <span className="text-text dark:text-white font-bold">"{getActionLabel(rollbackLogItem.action)}"</span>. <br/>
                            Это действие нельзя будет отменить.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setRollbackLogItem(null)} 
                                className="flex-1 py-4 rounded-2xl bg-muted/10 border border-border/10 font-bold uppercase tracking-widest text-[10px] hover:bg-muted/20 transition-all"
                            >
                                Отмена
                            </button>
                            <button 
                                onClick={() => rollbackLog(rollbackLogItem.id)} 
                                className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
                            >
                                Да, откатить
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Global Notification Toast */}
        <AnimatePresence>
            {notification && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, x: '-50%', scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.9 }}
                    className={`fixed bottom-10 left-1/2 z-[200] px-8 py-4 rounded-2xl glass border flex items-center gap-4 shadow-3xl min-w-[300px] ${
                        notification.type === 'error' ? 'border-red-500/30 text-red-500' : 
                        notification.type === 'info' ? 'border-blue-500/30 text-blue-500' : 'border-green-500/30 text-green-500'
                    }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                         notification.type === 'error' ? 'bg-red-500/10' : 
                         notification.type === 'info' ? 'bg-blue-500/10' : 'bg-green-500/10'
                    }`}>
                        {notification.type === 'error' ? <XCircle className="w-5 h-5" /> : 
                         notification.type === 'info' ? <Zap className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </div>
                    <span className="font-bold uppercase tracking-widest text-xs">{notification.message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
