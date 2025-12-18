
export type Situation = 'Presencial' | 'Online' | 'Adaptación' | 'Inactivo';
export type Taller = 'Taller 3' | 'Taller 4';
export type Division = 'A' | 'B';
export type ActivityType = 'Actividad' | 'Efeméride' | 'Reunión' | 'Evaluación' | 'Trabajo Práctico' | 'Recuperatorio' | 'Integral';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Docente';
  academicYear: string;
  profileImage?: string;
}

export interface Student {
  id: string;
  courseId: string;
  firstName: string;
  lastName: string;
  situation: Situation;
}

export interface Course {
  id: string;
  subject: string;
  teacher: string;
  academicYear: string;
  taller: Taller;
  year: number; // 1-6
  division: Division;
}

export interface Evaluation {
  id: string;
  courseId: string;
  name: string;
  date: string;
}

export interface CalendarActivity {
  id: string;
  title: string;
  date: string;
  type: ActivityType;
}

export interface Grade {
  studentId: string;
  evaluationId: string;
  score: number; // 1-100
}