
import React, { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, MapPin } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden max-w-md mx-auto shadow-2xl ring-1 ring-gray-100 bg-[#f3f7fa]">
      {/* Background with a soft Córdoba vibe */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&q=80&w=1000" 
          alt="Montessori Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f3f7fa]/80 to-[#f3f7fa]"></div>
      </div>

      <div className="w-full flex flex-col items-center mb-8 text-center relative z-10">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center logo-ring animate-in zoom-in duration-700">
            <img 
              src="https://raw.githubusercontent.com/ai-gen-images/placeholder/main/montessori-logo-fixed.png" 
              alt="Córdoba Montessori Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback stylized icon if external img fails
                (e.target as any).src = "https://api.dicebear.com/7.x/initials/svg?seed=CM&backgroundColor=ac3d38";
              }}
            />
          </div>
        </div>
        
        <h1 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-1">Centro Integral Educativo</h1>
        <h2 className="text-gray-800 font-black text-2xl tracking-tighter leading-tight">CÓRDOBA MONTESSORI</h2>
        <div className="h-1 w-12 montessori-bg-red rounded-full mt-3 mx-auto"></div>
        
        <div className="flex items-center space-x-1 mt-4 text-gray-400 justify-center">
          <MapPin size={14} className="text-[#5a8fbb]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Sierras de Córdoba, AR</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4 relative z-10">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usuario</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="email" 
              className="w-full bg-white border-2 border-transparent focus:border-[#5a8fbb]/30 focus:bg-white outline-none rounded-2xl py-3.5 pl-12 pr-4 transition-all shadow-sm font-medium text-sm"
              placeholder="docente@montessori.edu.ar"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="password" 
              className="w-full bg-white border-2 border-transparent focus:border-[#5a8fbb]/30 focus:bg-white outline-none rounded-2xl py-3.5 pl-12 pr-4 transition-all shadow-sm font-medium text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-1 px-1">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-[#ac3d38] rounded border-gray-300" 
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-gray-700 transition-colors">Recordar sesión</span>
          </label>
          <button type="button" className="text-[10px] font-bold text-[#5a8fbb] uppercase tracking-wider hover:underline">Olvide mi clave</button>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#ac3d38] text-white font-black py-4 rounded-2xl shadow-xl shadow-red-900/20 hover:bg-[#91322e] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 uppercase tracking-[0.15em] text-xs mt-4"
        >
          <LogIn size={18} />
          <span>Ingresar al Portal</span>
        </button>
      </form>

      <div className="mt-10 text-center relative z-10">
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">Educación para la Paz</p>
      </div>
    </div>
  );
};

export default Login;