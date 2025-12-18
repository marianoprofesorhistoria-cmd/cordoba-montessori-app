
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../store';
import { Download, Share2, Printer } from 'lucide-react';

const ExportPreview: React.FC = () => {
  const { id } = useParams();
  const { courses, students, evaluations, grades } = useApp();
  const navigate = useNavigate();

  const course = courses.find(c => c.id === id);
  
  // Robust alphabetical sorting by Last Name, then First Name for export
  const courseStudents = students
    .filter(s => s.courseId === id)
    .sort((a, b) => {
      const lastSort = a.lastName.localeCompare(b.lastName, 'es', { sensitivity: 'base' });
      if (lastSort !== 0) return lastSort;
      return a.firstName.localeCompare(b.firstName, 'es', { sensitivity: 'base' });
    });

  const courseEvals = evaluations.filter(e => e.courseId === id);

  if (!course) return <div className="p-10 text-center">Curso no encontrado</div>;

  const getGrade = (studentId: string, evalId: string) => {
    const score = grades.find(g => g.studentId === studentId && g.evaluationId === evalId)?.score;
    return score !== undefined ? score : '-';
  };

  const getAvg = (studentId: string) => {
    const sGrades = grades.filter(g => g.studentId === studentId && courseEvals.some(e => e.id === g.evaluationId));
    if (sGrades.length === 0) return '-';
    return (sGrades.reduce((acc, curr) => acc + curr.score, 0) / sGrades.length).toFixed(1);
  };

  return (
    <Layout title="Vista Previa" showBack>
      <div className="space-y-6">
        <div className="bg-white p-6 shadow-2xl rounded-sm border border-gray-100 overflow-x-auto min-h-[600px] print:m-0 print:shadow-none print:border-none">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-4 border-[#ac3d38]">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-50 flex items-center justify-center">
                <img 
                  src="https://raw.githubusercontent.com/ai-gen-images/placeholder/main/montessori-logo-fixed.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target as any).src = "https://api.dicebear.com/7.x/initials/svg?seed=CM&backgroundColor=ac3d38"}
                />
              </div>
              <div>
                <h1 className="text-[10px] font-black text-gray-800 uppercase leading-none tracking-tight">Centro Integral Educativo</h1>
                <h2 className="text-[#ac3d38] font-black text-sm tracking-widest uppercase">Córdoba Montessori</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Planilla de Notas</p>
              <p className="text-[11px] font-black text-gray-800">CICLO {course.academicYear}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 mb-8 text-[10px]">
            <p><span className="font-black text-gray-400 uppercase tracking-widest mr-2">Materia:</span> <span className="text-gray-800 font-bold uppercase">{course.subject}</span></p>
            <p><span className="font-black text-gray-400 uppercase tracking-widest mr-2">Docente:</span> <span className="text-gray-800 font-bold uppercase">{course.teacher}</span></p>
            <p><span className="font-black text-gray-400 uppercase tracking-widest mr-2">Curso:</span> <span className="text-gray-800 font-bold uppercase">{course.year}º "{course.division}"</span></p>
            <p><span className="font-black text-gray-400 uppercase tracking-widest mr-2">Taller:</span> <span className="text-gray-800 font-bold uppercase">{course.taller}</span></p>
          </div>

          <table className="w-full text-[9px] border-collapse border border-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="border border-gray-100 p-2 text-left w-48 uppercase font-black text-gray-400">Apellido y Nombre</th>
                {courseEvals.map(ev => (
                  <th key={ev.id} className="border border-gray-100 p-2 text-center font-black text-gray-400 uppercase">{ev.name}</th>
                ))}
                <th className="border border-gray-100 p-2 text-center bg-blue-50 text-[#5a8fbb] font-black uppercase">Prom.</th>
              </tr>
            </thead>
            <tbody>
              {courseStudents.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/30">
                  <td className="border border-gray-100 p-2 font-bold text-gray-700 uppercase">{s.lastName}, {s.firstName}</td>
                  {courseEvals.map(ev => (
                    <td key={ev.id} className="border border-gray-100 p-2 text-center font-bold text-gray-600">{getGrade(s.id, ev.id)}</td>
                  ))}
                  <td className="border border-gray-100 p-2 text-center font-black bg-blue-50/30 text-[#5a8fbb]">{getAvg(s.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-24 flex justify-between px-10">
            <div className="border-t border-gray-300 w-36 pt-2 text-center">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Firma del Docente</p>
            </div>
            <div className="border-t border-gray-300 w-36 pt-2 text-center">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Secretaría Académica</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sticky bottom-4">
          <button className="bg-white border border-blue-50/50 py-4 rounded-2xl flex flex-col items-center shadow-lg active:scale-95 transition-all">
            <Download size={20} className="text-[#5a8fbb] mb-1" />
            <span className="text-[8px] font-black uppercase tracking-widest">Descargar</span>
          </button>
          <button className="bg-white border border-blue-50/50 py-4 rounded-2xl flex flex-col items-center shadow-lg active:scale-95 transition-all">
            <Share2 size={20} className="text-cyan-500 mb-1" />
            <span className="text-[8px] font-black uppercase tracking-widest">Compartir</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-[#ac3d38] text-white py-4 rounded-2xl flex flex-col items-center shadow-2xl shadow-red-900/10 active:scale-95 transition-all"
          >
            <Printer size={20} className="mb-1" />
            <span className="text-[8px] font-black uppercase tracking-widest">Imprimir</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ExportPreview;
