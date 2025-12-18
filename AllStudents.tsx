
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../store';
import { Search, Users, BookOpen, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Situation } from '../types';

const AllStudents: React.FC = () => {
  const { students, courses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Robust alphabetical sorting for the master list
  const sortedStudents = [...students].sort((a, b) => {
    const lastSort = a.lastName.localeCompare(b.lastName, 'es', { sensitivity: 'base' });
    if (lastSort !== 0) return lastSort;
    return a.firstName.localeCompare(b.firstName, 'es', { sensitivity: 'base' });
  });

  const filteredStudents = sortedStudents.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCourseInfo = (courseId: string) => {
    return courses.find(c => c.id === courseId);
  };

  const getBadgeClass = (situation: Situation) => {
    switch(situation) {
      case 'Inactivo': return 'bg-gray-100 text-gray-400';
      case 'Online': return 'bg-yellow-100 text-yellow-700';
      case 'Adaptación': return 'bg-orange-100 text-orange-700';
      case 'Presencial': return 'bg-blue-50 text-[#5a8fbb]';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <Layout title="Lista de Alumnos" showBack>
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o apellido..." 
            className="w-full bg-white border border-blue-50/50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 ring-blue-50 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredStudents.map(student => {
            const course = getCourseInfo(student.courseId);
            return (
              <button 
                key={student.id}
                onClick={() => navigate(`/course/${student.courseId}`)}
                className="w-full bg-white p-5 rounded-[2rem] border border-blue-50/30 flex items-center justify-between text-left hover:shadow-md transition-all active:scale-[0.98] shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#5a8fbb] font-black text-lg">
                    {student.lastName[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-sm tracking-tight">{student.lastName}, {student.firstName}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest ${getBadgeClass(student.situation)}`}>
                        {student.situation}
                      </span>
                      <span className="text-gray-300">•</span>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {course?.subject || 'Sin Curso'}
                      </p>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-200" />
              </button>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="text-center py-20">
              <Users size={48} className="mx-auto text-gray-100 mb-4" />
              <p className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">No se encontraron alumnos</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllStudents;
