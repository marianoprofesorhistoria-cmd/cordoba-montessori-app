
import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../store';
import { Camera, User, Mail, Calendar, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || '');
  const [showSaved, setShowSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateUser({ name, email, academicYear });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout title="Configuración" showBack>
      <div className="space-y-8 pb-10">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center pt-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center ring-1 ring-blue-50">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-100" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[#5a8fbb] text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-[#4a7ba2] active:scale-90 transition-all"
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
          </div>
          <p className="mt-4 font-black text-gray-800 text-lg tracking-tight">{user?.name}</p>
          <p className="text-[10px] font-black text-[#5a8fbb] uppercase tracking-[0.2em]">{user?.role}</p>
        </div>

        {/* Basic Information Form */}
        <div className="space-y-5">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Información Básica</h3>
          
          <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50/50 shadow-sm space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center space-x-1">
                <User size={12} className="text-[#5a8fbb]" />
                <span>Nombre Completo</span>
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:ring-2 ring-blue-50 transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center space-x-1">
                <Mail size={12} className="text-[#5a8fbb]" />
                <span>Correo Institucional</span>
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:ring-2 ring-blue-50 transition-all"
                placeholder="correo@montessori.edu.ar"
              />
            </div>
          </div>
        </div>

        {/* Academic Context (Editable) */}
        <div className="space-y-5">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contexto Académico</h3>
          
          <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50/50 shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Calendar size={12} className="text-[#5a8fbb]" />
                  <span>Ciclo Lectivo</span>
                </div>
                <span className="text-[8px] font-black text-[#ac3d38] bg-red-50 px-2 py-1 rounded-md uppercase tracking-widest">Activo</span>
              </label>
              <input 
                type="text" 
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:ring-2 ring-blue-50 transition-all"
                placeholder="Ej: 2024"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <div className="p-3 bg-blue-50 text-[#5a8fbb] rounded-2xl">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Permisos</p>
                <p className="text-sm font-black text-gray-800 tracking-tight">Acceso {user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Save Button / Feedback */}
        <div className="pt-4 flex flex-col space-y-3">
          {showSaved && (
            <div className="bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CheckCircle2 size={16} />
              <span>Perfil actualizado</span>
            </div>
          )}
          
          <button 
            onClick={handleSave}
            disabled={showSaved}
            className={`w-full py-4.5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center space-x-2 shadow-2xl transition-all active:scale-[0.97] ${showSaved ? 'bg-gray-100 text-gray-300' : 'bg-[#ac3d38] text-white shadow-red-900/20'}`}
          >
            <Save size={18} />
            <span>Guardar Perfil</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
