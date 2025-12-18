
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, PlusCircle, ArrowRight, MapPin, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { CalendarActivity } from '../types';

const Dashboard: React.FC = () => {
  const { user, courses, evaluations, activities, addActivity, deleteActivity } = useApp();
  const navigate = useNavigate();

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityType, setNewActivityType] = useState<CalendarActivity['type']>('Actividad');

  const ActionCard = ({ icon: Icon, label, description, colorClass, onClick }: any) => (
    <button 
      onClick={onClick}
      className="bg-white p-4 rounded-[2rem] shadow-sm border border-blue-50/50 flex flex-col items-start text-left hover:shadow-md transition-all active:scale-[0.97]"
    >
      <div className={`${colorClass} p-3 rounded-2xl text-white mb-4 shadow-lg`}>
        <Icon size={18} />
      </div>
      <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest">{label}</h3>
      <p className="text-[10px] text-gray-400 font-medium mt-1 leading-tight">{description}</p>
    </button>
  );

  // Calendar Logic
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const getDayEvents = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    const evs = evaluations.filter(e => new Date(e.date).toDateString() === dateStr).map(e => ({ ...e, id: e.id, calendarType: 'Evaluación' }));
    const acts = activities.filter(a => new Date(a.date).toDateString() === dateStr).map(a => ({ ...a, calendarType: a.type }));
    return [...evs, ...acts];
  };

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'Evaluación':
      case 'Recuperatorio':
      case 'Integral':
        return 'bg-[#ac3d38]';
      case 'Efeméride':
        return 'bg-yellow-400';
      case 'Trabajo Práctico':
        return 'bg-emerald-400';
      case 'Reunión':
      case 'Actividad':
        return 'bg-[#5a8fbb]';
      default:
        return 'bg-gray-400';
    }
  };

  const handleAddActivity = () => {
    if (newActivityTitle && selectedDate) {
      addActivity({
        title: newActivityTitle,
        date: selectedDate.toISOString(),
        type: newActivityType
      });
      setNewActivityTitle('');
      setShowAddActivity(false);
    }
  };

  const selectedDayEvents = selectedDate ? getDayEvents(selectedDate.getDate()) : [];

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <header className="flex justify-between items-center px-1">
          <div>
            <p className="text-[10px] font-black text-[#ac3d38] uppercase tracking-[0.2em] mb-1">Docente</p>
            <h2 className="text-2xl font-black text-gray-800 tracking-tighter">¡Hola, {user?.name.split(' ')[0]}!</h2>
            <div className="flex items-center space-x-2 mt-1 text-gray-400">
               <MapPin size={10} className="text-[#5a8fbb]" />
               <span className="text-[9px] font-bold uppercase tracking-widest">Sierras de Córdoba</span>
            </div>
          </div>
          <div className="bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Año Lectivo</p>
            <p className="text-xs font-black text-[#5a8fbb]">{user?.academicYear}</p>
          </div>
        </header>

        <section className="bg-gradient-to-br from-[#ac3d38] to-[#91322e] p-6 rounded-[2.5rem] text-white shadow-2xl shadow-red-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg mb-4">
               <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
               <span className="text-[8px] font-black uppercase tracking-widest">Curso Actual</span>
            </div>
            <h3 className="text-xl font-black tracking-tight leading-tight max-w-[200px]">{courses[0]?.subject || 'Sin cursos'}</h3>
            <p className="text-xs text-red-50/80 font-medium mt-2">
              {courses[0] ? `${courses[0].taller} • ${courses[0].year}º ${courses[0].division}` : 'Inicia tu primer curso hoy'}
            </p>
            <button 
              onClick={() => courses[0] && navigate(`/course/${courses[0].id}`)}
              className="mt-6 bg-white text-[#ac3d38] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center space-x-2 shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <span>Continuar Clase</span>
              <ArrowRight size={14} />
            </button>
          </div>
          
          <BookOpen className="absolute -top-6 -right-6 text-white/10 rotate-12" size={140} />
        </section>

        {/* Calendar Section */}
        <section className="bg-white p-6 rounded-[2.5rem] border border-blue-50/50 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center space-x-2">
              <CalendarIcon size={14} className="text-[#ac3d38]" />
              <span>Agenda Escolar</span>
            </h3>
            <div className="flex items-center space-x-3">
              <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-gray-800"><ChevronLeft size={18} /></button>
              <span className="text-[10px] font-black text-[#5a8fbb] uppercase tracking-widest w-24 text-center">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-gray-800"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 mb-4">
            {daysOfWeek.map(day => (
              <div key={day} className="text-[8px] font-black text-gray-300 uppercase text-center">{day}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              const isSelected = selectedDate?.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              const evs = getDayEvents(day);
              
              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  className={`h-10 relative flex flex-col items-center justify-center transition-all ${isSelected ? 'scale-110' : ''}`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                    isSelected ? 'bg-[#5a8fbb] text-white shadow-lg shadow-blue-200' : 
                    isToday ? 'text-[#ac3d38] border-b-2 border-[#ac3d38]' : 'text-gray-600'
                  }`}>
                    {day}
                  </div>
                  {evs.length > 0 && (
                    <div className="flex space-x-0.5 mt-0.5">
                      {evs.slice(0, 3).map((ev: any, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${getActivityColor(ev.calendarType)}`}></div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Agenda */}
          <div className="mt-4 pt-4 border-t border-blue-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                {selectedDate?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <button 
                onClick={() => setShowAddActivity(true)}
                className="p-1.5 bg-blue-50 text-[#5a8fbb] rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((ev: any, idx) => (
                  <div key={idx} className="group flex items-center space-x-3 bg-gray-50/50 p-2.5 rounded-xl border border-blue-50/30">
                    <div className={`w-1.5 h-1.5 rounded-full ${getActivityColor(ev.calendarType)}`}></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-gray-800 tracking-tight leading-none">{ev.title || ev.name}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">{ev.calendarType}</p>
                    </div>
                    {ev.calendarType !== 'Efeméride' && ev.id && (
                       <button 
                        onClick={(e) => { e.stopPropagation(); deleteActivity(ev.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                       >
                        <Trash2 size={12} />
                       </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 bg-gray-50/30 rounded-2xl border border-dashed border-gray-100">
                  <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Sin compromisos para hoy</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <ActionCard 
            icon={BookOpen} 
            label="Mis Cursos" 
            description="Gestionar tus programas" 
            colorClass="bg-[#5a8fbb]"
            onClick={() => navigate('/courses')}
          />
          <ActionCard 
            icon={Users} 
            label="Alumnos" 
            description="Seguimiento detallado" 
            colorClass="bg-[#ac3d38]"
            onClick={() => navigate('/all-students')}
          />
          <ActionCard 
            icon={PlusCircle} 
            label="Cargar Notas" 
            description="Registro de evaluaciones" 
            colorClass="bg-indigo-400"
            onClick={() => navigate('/courses')}
          />
          <ActionCard 
            icon={FileText} 
            label="Exportar PDF" 
            description="Informes académicos" 
            colorClass="bg-emerald-400"
            onClick={() => navigate('/courses')}
          />
        </section>
      </div>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-[2.5rem] p-8 space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-800 tracking-tight">Programar Fecha</h2>
              <button onClick={() => setShowAddActivity(false)} className="text-gray-300 font-bold p-1">Cerrar</button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                <input 
                  type="text" 
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl py-3 px-4 outline-none font-bold text-sm border-2 border-transparent focus:border-blue-100 transition-all" 
                  placeholder="Ej: Entrega de Informes"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                <select 
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value as any)}
                  className="w-full bg-gray-50 rounded-2xl py-3 px-4 outline-none font-bold text-xs appearance-none border-none ring-0"
                >
                  <option value="Actividad">Actividad General</option>
                  <option value="Reunión">Reunión Docente / Padres</option>
                  <option value="Evaluación">Evaluación (Examen)</option>
                  <option value="Trabajo Práctico">Trabajo Práctico</option>
                  <option value="Recuperatorio">Recuperatorio</option>
                  <option value="Integral">Examen Integral</option>
                  <option value="Efeméride">Efeméride Especial</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setShowAddActivity(false)} className="flex-1 py-3 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                <button 
                  onClick={handleAddActivity}
                  className="flex-1 py-3.5 bg-[#5a8fbb] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-900/10 active:scale-95"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
