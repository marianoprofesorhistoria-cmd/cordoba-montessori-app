
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../store';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Courses: React.FC = () => {
  const { courses, addCourse, user } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: '',
    taller: 'Taller 3' as const,
    year: 1,
    division: 'A' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse({
      ...formData,
      teacher: user?.name || 'Docente',
      academicYear: user?.academicYear || '2024'
    });
    setShowAdd(false);
    setFormData({ subject: '', taller: 'Taller 3', year: 1, division: 'A' });
  };

  return (
    <Layout title="Mis Cursos" showBack>
      <div className="space-y-6">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por asignatura..." 
              className="w-full bg-white border border-blue-50/50 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 ring-blue-50 shadow-sm"
            />
          </div>
          <button className="bg-white border border-blue-50/50 p-3 rounded-2xl text-gray-400 shadow-sm">
            <Filter size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {courses.map(course => (
            <div 
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="bg-white p-5 rounded-[2.2rem] border border-blue-50/50 shadow-sm flex flex-col space-y-4 active:scale-[0.98] transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-black text-gray-800 leading-tight tracking-tight">{course.subject}</h3>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="bg-blue-50 text-[#5a8fbb] text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-blue-100/50">
                      {course.taller}
                    </span>
                    <span className="text-gray-200">•</span>
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{course.year}º Año "{course.division}"</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-2xl text-[#5a8fbb] shadow-sm">
                  <BookOpen size={22} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-blue-50/30">
                <div className="flex -space-x-1.5">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm"></div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[7px] font-black text-gray-400 shadow-sm">+25</div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Docente</p>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-tight mt-1">{course.teacher.split(' ').pop()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowAdd(true)}
          className="w-full bg-blue-50 text-[#5a8fbb] font-black py-4 rounded-3xl border-2 border-dashed border-blue-200/50 hover:bg-blue-100/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <Plus size={20} />
          <span className="text-xs uppercase tracking-[0.1em]">Nuevo Curso</span>
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-400 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Nuevo Curso</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 font-bold p-2">Cerrar</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pb-10">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Asignatura</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 outline-none font-bold text-sm focus:ring-2 ring-blue-50 transition-all"
                  placeholder="Ej: Matemática"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Taller</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 outline-none font-bold text-sm"
                    value={formData.taller}
                    onChange={(e) => setFormData({...formData, taller: e.target.value as any})}
                  >
                    <option value="Taller 3">Taller 3</option>
                    <option value="Taller 4">Taller 4</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Año</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-4 outline-none font-bold text-sm"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6].map(y => <option key={y} value={y}>{y}º Año</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">División</label>
                <div className="flex space-x-3">
                  {['A', 'B'].map(div => (
                    <button 
                      key={div}
                      type="button"
                      onClick={() => setFormData({...formData, division: div as any})}
                      className={`flex-1 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${formData.division === div ? 'bg-[#ac3d38] text-white shadow-xl shadow-red-900/10' : 'bg-gray-50 text-gray-400'}`}
                    >
                      División {div}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#ac3d38] text-white font-black py-4 rounded-2xl shadow-xl shadow-red-900/10 mt-4 active:scale-[0.98] transition-all uppercase text-xs tracking-widest"
              >
                Crear Curso
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Courses;
