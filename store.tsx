
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Student, Evaluation, Grade, User, CalendarActivity } from './types';

interface AppState {
  user: User | null;
  courses: Course[];
  students: Student[];
  evaluations: Evaluation[];
  activities: CalendarActivity[];
  grades: Grade[];
  login: (email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  addStudentsBulk: (newStudents: Omit<Student, 'id'>[]) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addEvaluation: (evalItem: Omit<Evaluation, 'id'>) => void;
  updateEvaluation: (id: string, name: string, date: string) => void;
  deleteEvaluation: (id: string) => void;
  addActivity: (activity: Omit<CalendarActivity, 'id'>) => void;
  deleteActivity: (id: string) => void;
  updateGrade: (studentId: string, evaluationId: string, score: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('montessori_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('montessori_courses');
    return saved ? JSON.parse(saved) : [
      { id: '1', subject: 'Lengua y Literatura', teacher: 'María Montessori', academicYear: '2024', taller: 'Taller 3', year: 1, division: 'A' },
      { id: '2', subject: 'Matemática', teacher: 'María Montessori', academicYear: '2024', taller: 'Taller 4', year: 4, division: 'B' }
    ];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('montessori_students');
    return saved ? JSON.parse(saved) : [
      { id: 's1', courseId: '1', firstName: 'Juan', lastName: 'Pérez', situation: 'Presencial' },
      { id: 's2', courseId: '1', firstName: 'Ana', lastName: 'García', situation: 'Online' },
      { id: 's3', courseId: '2', firstName: 'Luis', lastName: 'Rodríguez', situation: 'Adaptación' }
    ];
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const saved = localStorage.getItem('montessori_evaluations');
    return saved ? JSON.parse(saved) : [
      { id: 'e1', courseId: '1', name: 'Primer Parcial', date: '2024-03-15' },
      { id: 'e2', courseId: '1', name: 'Trabajo Práctico 1', date: '2024-04-10' }
    ];
  });

  const [activities, setActivities] = useState<CalendarActivity[]>(() => {
    const saved = localStorage.getItem('montessori_activities');
    const currentYear = new Date().getFullYear();
    
    const initialEfemérides: Omit<CalendarActivity, 'id'>[] = [
      { title: 'Año Nuevo', date: new Date(currentYear, 0, 1).toISOString(), type: 'Efeméride' },
      { title: 'Carnaval', date: new Date(currentYear, 1, 12).toISOString(), type: 'Efeméride' },
      { title: 'Día de la Memoria', date: new Date(currentYear, 2, 24).toISOString(), type: 'Efeméride' },
      { title: 'Viernes Santo', date: new Date(currentYear, 2, 29).toISOString(), type: 'Efeméride' },
      { title: 'Día del Veterano y Caídos en Malvinas', date: new Date(currentYear, 3, 2).toISOString(), type: 'Efeméride' },
      { title: 'Día del Trabajador', date: new Date(currentYear, 4, 1).toISOString(), type: 'Efeméride' },
      { title: 'Revolución de Mayo', date: new Date(currentYear, 4, 25).toISOString(), type: 'Efeméride' },
      { title: 'Paso a la Inmortalidad de Güemes', date: new Date(currentYear, 5, 17).toISOString(), type: 'Efeméride' },
      { title: 'Día de la Bandera', date: new Date(currentYear, 5, 20).toISOString(), type: 'Efeméride' },
      { title: 'Día de la Independencia', date: new Date(currentYear, 6, 9).toISOString(), type: 'Efeméride' },
      { title: 'Paso a la Inmortalidad de San Martín', date: new Date(currentYear, 7, 17).toISOString(), type: 'Efeméride' },
      { title: 'Día del Maestro', date: new Date(currentYear, 8, 11).toISOString(), type: 'Efeméride' },
      { title: 'Respeto a la Diversidad Cultural', date: new Date(currentYear, 9, 12).toISOString(), type: 'Efeméride' },
      { title: 'Día de la Soberanía Nacional', date: new Date(currentYear, 10, 20).toISOString(), type: 'Efeméride' },
      { title: 'Inmaculada Concepción', date: new Date(currentYear, 11, 8).toISOString(), type: 'Efeméride' },
      { title: 'Navidad', date: new Date(currentYear, 11, 25).toISOString(), type: 'Efeméride' },
      { title: 'Natalicio María Montessori', date: new Date(currentYear, 7, 31).toISOString(), type: 'Efeméride' }
    ];

    if (saved) return JSON.parse(saved);

    return initialEfemérides.map(e => ({
      ...e,
      id: Math.random().toString(36).substr(2, 9)
    }));
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('montessori_grades');
    return saved ? JSON.parse(saved) : [
      { studentId: 's1', evaluationId: 'e1', score: 85 },
      { studentId: 's2', evaluationId: 'e1', score: 92 },
      { studentId: 's1', evaluationId: 'e2', score: 78 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('montessori_user', JSON.stringify(user));
    localStorage.setItem('montessori_courses', JSON.stringify(courses));
    localStorage.setItem('montessori_students', JSON.stringify(students));
    localStorage.setItem('montessori_evaluations', JSON.stringify(evaluations));
    localStorage.setItem('montessori_activities', JSON.stringify(activities));
    localStorage.setItem('montessori_grades', JSON.stringify(grades));
  }, [user, courses, students, evaluations, activities, grades]);

  const login = (email: string) => {
    setUser({ id: 'u1', name: 'María Montessori', email, role: 'Docente', academicYear: '2024' });
  };

  const logout = () => setUser(null);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    setCourses([...courses, { ...course, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    setStudents([...students, { ...student, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const addStudentsBulk = (newStudentsData: Omit<Student, 'id'>[]) => {
    const formatted = newStudentsData.map(s => ({
      ...s,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setStudents(prev => [...prev, ...formatted]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setGrades(prev => prev.filter(g => g.studentId !== id));
  };

  const addEvaluation = (evalItem: Omit<Evaluation, 'id'>) => {
    setEvaluations([...evaluations, { ...evalItem, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateEvaluation = (id: string, name: string, date: string) => {
    setEvaluations(prev => prev.map(ev => ev.id === id ? { ...ev, name, date } : ev));
  };

  const deleteEvaluation = (id: string) => {
    setEvaluations(prev => prev.filter(ev => ev.id !== id));
    setGrades(prev => prev.filter(g => g.evaluationId !== id));
  };

  const addActivity = (activity: Omit<CalendarActivity, 'id'>) => {
    setActivities([...activities, { ...activity, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const updateGrade = (studentId: string, evaluationId: string, score: number) => {
    setGrades(prev => {
      const filtered = prev.filter(g => !(g.studentId === studentId && g.evaluationId === evaluationId));
      return [...filtered, { studentId, evaluationId, score }];
    });
  };

  return (
    <AppContext.Provider value={{ 
      user, courses, students, evaluations, activities, grades, 
      login, logout, updateUser, addCourse, addStudent, addStudentsBulk, updateStudent, deleteStudent, addEvaluation, updateEvaluation, deleteEvaluation, addActivity, deleteActivity, updateGrade 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
