
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../store';
import { Users, ClipboardList, BarChart3, Plus, Trash2, Edit2, Download, AlertTriangle, ChevronDown, FileText, Info, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Evaluation, Situation } from '../types';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const { courses, students, evaluations, grades, deleteStudent, addStudent, addStudentsBulk, updateStudent, addEvaluation, updateEvaluation, deleteEvaluation, updateGrade } = useApp();
  const [activeTab, setActiveTab] = useState<'alumnos' | 'notas' | 'promedios'>('alumnos');
  
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddBulk, setShowAddBulk] = useState(false);
  const [showAddEval, setShowAddEval] = useState(false);
  const [editingEval, setEditingEval] = useState<Evaluation | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  
  const [editEvalName, setEditEvalName] = useState('');
  const [editEvalDate, setEditEvalDate] = useState('');
  const [bulkList, setBulkList] = useState('');

  const navigate = useNavigate();

  const course = courses.find(c => c.id === id);
  
  // Robust alphabetical sorting by Last Name, then First Name
  const courseStudents = students
    .filter(s => s.courseId === id)
    .sort((a, b) => {
      const lastSort = a.lastName.localeCompare(b.lastName, 'es', { sensitivity: 'base' });
      if (lastSort !== 0) return lastSort;
      return a.firstName.localeCompare(b.firstName, 'es', { sensitivity: 'base' });
    });

  const courseEvals = evaluations.filter(e => e.courseId === id);

  useEffect(() => {
    if (editingEval) {
      setEditEvalName(editingEval.name);
      setEditEvalDate(editingEval.date);
    }
  }, [editingEval]);

  if (!course) return <div className="p-10 text-center font-bold text-gray-400">Curso no encontrado</div>;

  const getStudentGrades = (studentId: string) => {
    return grades.filter(g => g.studentId === studentId && courseEvals.some(e => e.id === g.evaluationId));
  };

  const getAverage = (studentId: string) => {
    const sGrades = getStudentGrades(studentId);
    if (sGrades.length === 0) return 0;
    return sGrades.reduce((acc, curr) => acc + curr.score, 0) / sGrades.length;
  };

  const performanceData = courseStudents.map(s => ({
    name: s.lastName,
    promedio: getAverage(s.id)
  }));

  const getGradeColor = (score: number) => {
    if (score >= 80) return '#5a8fbb'; // High (Institutional Blue)
    if (score >= 60) return '#eab308'; // Medium (Yellow)
    return '#ac3d38'; // Low (Institutional Red)
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete);
      setStudentToDelete(null);
    }
  };

  const handleBulkSubmit = () => {
    const lines = bulkList.split('\n').filter(line => line.trim() !== '');
    const newStudents = lines.map(line => {
      let lastName = '';
      let firstName = '';
      if (line.includes(',')) {
        const parts = line.split(',');
        lastName = parts[0].trim();
        firstName = parts.slice(1).join(',').trim();
      } else {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 1) {
          lastName = parts[parts.length - 1];
          firstName = parts.slice(0, parts.length - 1).join(' ');
        } else {
          lastName = line.trim();
          firstName = '-';
        }
      }
      return {
        courseId: id!,
        firstName,
        lastName,
        situation: 'Presencial' as Situation
      };
    });

    if (newStudents.length > 0) {
      addStudentsBulk(newStudents);
      setBulkList('');
      setShowAddBulk(false);
    }
  };

  const TabButton = ({ id: tabId, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(tabId)}
      className={`flex-1 flex flex-col items-center py-3 space-y-1 relative transition-all ${activeTab === tabId ? 'text-[#5a8fbb]' : 'text-gray-300'}`}
    >
      <Icon size={20} />
      <span className="text-[10px] font-black uppercase tracking-[0.1em]">{label}</span>
      {activeTab === tabId && <div className="absolute bottom-0 w-8 h-1 bg-[#5a8fbb] rounded-full"></div>}
    </button>
  );

  const getSituationIndicatorClass = (situation: Situation) => {
    switch(situation) {
      case 'Presencial': return 'bg-blue-400';
      case 'Online': return 'bg-yellow-400';
      case 'Adaptación': return 'bg-orange-400';
      case 'Inactivo': return 'bg-gray-300';
      default: return 'bg-gray-200';
    }
  };

  const studentToBeDeleted = students.find(s => s.id === studentToDelete);

  return (
    <Layout title={course.subject} showBack>
      <div className="space-y-4">
        <header className="px-1">
          <p className="text-[10px] font-black text-[#5a8fbb] uppercase tracking-[0.2em]">{course.taller} • {course.year}º "{course.division}"</p>
        </header>

        <div className="bg-white rounded-2xl flex border border-blue-50/50 shadow-sm overflow-hidden mb-6">
          <TabButton id="alumnos" label="Alumnos" icon={Users} />
          <TabButton id="notas" label="Notas" icon={ClipboardList} />
          <TabButton id="promedios" label="Promedios" icon={BarChart3} />
        </div>

        {activeTab === 'alumnos' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">{courseStudents.length} Estudiantes</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowAddBulk(true)}
                  className="bg-blue-50 text-[#5a8fbb] p-2 rounded-xl active:scale-95 transition-all flex items-center space-x-1 border border-blue-100"
                >
                  <FileText size={16} />
                  <span className="text-[10px] font-black uppercase tracking-tight pr-1">Bulk Import</span>
                </button>
                <button 
                  onClick={() => setShowAddStudent(true)}
                  className="bg-[#ac3d38] text-white p-2 rounded-xl active:scale-95 transition-all shadow-lg shadow-red-900/10"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {courseStudents.map(s => (
                <div key={s.id} className={`bg-white p-4 rounded-2xl border border-blue-50/30 flex items-center justify-between transition-all ${s.situation === 'Inactivo' ? 'opacity-50 grayscale' : 'shadow-sm'}`}>
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-1.5 h-10 rounded-full ${getSituationIndicatorClass(s.situation)}`}></div>
                    <div className="flex flex-col flex-1">
                      <h4 className="font-black text-sm text-gray-800">{s.lastName}, {s.firstName}</h4>
                      <div className="relative mt-1 inline-block w-fit">
                        <select 
                          className="appearance-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 pr-5 rounded-md outline-none bg-blue-50 text-[#5a8fbb] border-none"
                          value={s.situation}
                          onChange={(e) => updateStudent(s.id, { situation: e.target.value as Situation })}
                        >
                          <option value="Presencial">Presencial</option>
                          <option value="Online">Online</option>
                          <option value="Adaptación">Adaptación</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStudentToDelete(s.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {courseStudents.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">No hay alumnos registrados</p>
                  <button onClick={() => setShowAddBulk(true)} className="text-[#5a8fbb] text-[10px] font-black uppercase tracking-widest underline">Importar lista masiva</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notas' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Registro de Notas</h3>
              <button 
                onClick={() => setShowAddEval(true)}
                className="bg-[#ac3d38] text-white text-[10px] font-black px-3 py-2 rounded-xl flex items-center space-x-1 uppercase tracking-wider shadow-lg shadow-red-900/10"
              >
                <Plus size={14} />
                <span>Evaluación</span>
              </button>
            </div>

            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-blue-50">
                    <th className="text-left text-[10px] font-black text-gray-400 uppercase pb-4">Alumno</th>
                    {courseEvals.map(ev => (
                      <th key={ev.id} onClick={() => setEditingEval(ev)} className="text-center text-[10px] font-black text-gray-400 uppercase pb-4 px-2 cursor-pointer group">
                        <div className="flex flex-col items-center">
                          <span className="group-hover:text-[#5a8fbb] transition-colors">{ev.name}</span>
                          <span className="text-[8px] font-bold text-gray-300 mt-0.5">{new Date(ev.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/30">
                  {courseStudents.map(s => (
                    <tr key={s.id} className={s.situation === 'Inactivo' ? 'opacity-40' : ''}>
                      <td className="py-4">
                        <p className="text-xs font-black text-gray-700">{s.lastName}, {s.firstName[0]}.</p>
                      </td>
                      {courseEvals.map(ev => {
                        const grade = grades.find(g => g.studentId === s.id && g.evaluationId === ev.id);
                        return (
                          <td key={ev.id} className="py-2 px-2 text-center">
                            <input 
                              type="number" 
                              className={`w-12 h-10 rounded-xl text-center font-black text-sm outline-none transition-all ${grade ? 'bg-white border border-blue-50' : 'bg-blue-50/30'} focus:ring-2 ring-[#5a8fbb]/20`}
                              value={grade?.score || ''}
                              placeholder="-"
                              disabled={s.situation === 'Inactivo'}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (e.target.value === '') { updateGrade(s.id, ev.id, 0); return; }
                                if (!isNaN(val) && val >= 0 && val <= 100) updateGrade(s.id, ev.id, val);
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              className="w-full bg-white text-[#5a8fbb] font-black py-4 rounded-2xl border border-blue-100 flex items-center justify-center space-x-2 active:scale-95 shadow-sm"
              onClick={() => navigate('/export/' + id)}
            >
              <Download size={18} />
              <span className="text-xs uppercase tracking-widest">Generar Informe Académico</span>
            </button>
          </div>
        )}

        {activeTab === 'promedios' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-3xl border border-blue-50/50 shadow-sm">
              <h3 className="text-center text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Performance por Alumno</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 'bold'}} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 'bold'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold'}}
                      cursor={{fill: '#f8fafc'}}
                    />
                    <Bar dataKey="promedio" radius={[6, 6, 0, 0]} barSize={18}>
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getGradeColor(entry.promedio)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-blue-50/50 text-center shadow-sm">
                <p className="text-[9px] font-black text-[#5a8fbb] uppercase tracking-widest">Alto</p>
                <p className="text-xl font-black text-gray-800 mt-1">{performanceData.filter(d => d.promedio >= 80).length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-blue-50/50 text-center shadow-sm">
                <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Medio</p>
                <p className="text-xl font-black text-gray-800 mt-1">{performanceData.filter(d => d.promedio >= 60 && d.promedio < 80).length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-blue-50/50 text-center shadow-sm">
                <p className="text-[9px] font-black text-[#ac3d38] uppercase tracking-widest">Bajo</p>
                <p className="text-xl font-black text-gray-800 mt-1">{performanceData.filter(d => d.promedio < 60).length}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Student Deletion */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-[2rem] p-8 space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 text-[#ac3d38] rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800 tracking-tight">¿Eliminar alumno?</h2>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Esta acción es irreversible y borrará permanentemente a <span className="text-gray-800 font-black">{studentToBeDeleted?.lastName}</span>.
              </p>
            </div>
            <div className="flex flex-col space-y-2 pt-2">
              <button onClick={handleDeleteConfirm} className="w-full py-3.5 bg-[#ac3d38] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-900/10 active:scale-95 transition-all">Eliminar</button>
              <button onClick={() => setStudentToDelete(null)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Students Modal */}
      {showAddBulk && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[60] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] p-8 space-y-5 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Importación Masiva</h2>
              <button onClick={() => setShowAddBulk(false)} className="text-gray-400 font-bold p-2">Cerrar</button>
            </div>
            
            <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start space-x-3 border border-blue-100">
              <Info className="text-[#5a8fbb] shrink-0 mt-0.5" size={18} />
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold">
                Pega la lista de alumnos (un nombre por línea). <br/>
                Formatos: <span className="text-[#ac3d38]">Apellido, Nombre</span> o <span className="text-[#ac3d38]">Nombre Apellido</span>
              </p>
            </div>

            <div className="space-y-1">
              <textarea 
                value={bulkList}
                onChange={(e) => setBulkList(e.target.value)}
                placeholder="Pérez, Juan&#10;Ana García&#10;Rodríguez, Luis..."
                className="w-full h-48 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-2xl py-4 px-4 outline-none transition-all resize-none text-sm font-bold leading-relaxed"
              ></textarea>
            </div>

            <button 
              onClick={handleBulkSubmit}
              className="w-full bg-[#5a8fbb] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 uppercase text-[11px] tracking-widest"
            >
              <Plus size={18} />
              <span>Cargar Alumnos</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[2.5rem] p-8 space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl">
            <h2 className="text-xl font-black text-gray-800 tracking-tight">Nuevo Estudiante</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Apellido</label>
                <input type="text" id="newLastName" className="w-full bg-gray-50 rounded-2xl py-3.5 px-4 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                <input type="text" id="newFirstName" className="w-full bg-gray-50 rounded-2xl py-3.5 px-4 outline-none font-bold text-sm" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setShowAddStudent(false)} className="flex-1 py-3 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                <button 
                  onClick={() => {
                    const ln = (document.getElementById('newLastName') as HTMLInputElement).value;
                    const fn = (document.getElementById('newFirstName') as HTMLInputElement).value;
                    if (ln && fn) {
                      addStudent({ courseId: id!, firstName: fn, lastName: ln, situation: 'Presencial' });
                      setShowAddStudent(false);
                    }
                  }}
                  className="flex-1 py-3.5 bg-[#ac3d38] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-900/10"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showAddEval && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full rounded-[2.5rem] p-8 space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl">
            <h2 className="text-xl font-black text-gray-800 tracking-tight">Nueva Evaluación</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Ej: Primer Parcial" id="evalName" className="w-full bg-gray-50 rounded-2xl py-3.5 px-4 outline-none font-bold text-sm" />
              <input type="date" id="evalDate" className="w-full bg-gray-50 rounded-2xl py-3.5 px-4 outline-none font-bold text-sm" />
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setShowAddEval(false)} className="flex-1 py-3 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                <button 
                  onClick={() => {
                    const name = (document.getElementById('evalName') as HTMLInputElement).value;
                    const date = (document.getElementById('evalDate') as HTMLInputElement).value;
                    if (name) {
                      addEvaluation({ courseId: id!, name, date: date || new Date().toISOString() });
                      setShowAddEval(false);
                    }
                  }}
                  className="flex-1 py-3.5 bg-[#ac3d38] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-900/10"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CourseDetail;
