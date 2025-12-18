
import React from 'react';
import { useApp } from '../store';
import { LogOut, Home, BookOpen, User as UserIcon, Settings, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const NavItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`flex-1 flex flex-col items-center justify-center space-y-1 py-2 ${isActive ? 'text-[#5a8fbb]' : 'text-gray-400'} active:scale-95 transition-all`}
      >
        <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
          <Icon size={19} />
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7fa] pb-20 max-w-md mx-auto shadow-2xl ring-1 ring-gray-100 relative overflow-hidden">
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-blue-50/50">
        <div className="flex items-center space-x-2">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 text-gray-400 hover:bg-blue-50 rounded-full transition-colors">
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="flex items-center space-x-2">
            {!title && (
              <div className="w-9 h-9 rounded-full bg-white border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm">
                <img 
                  src="https://raw.githubusercontent.com/ai-gen-images/placeholder/main/montessori-logo-fixed.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target as any).src = "https://api.dicebear.com/7.x/initials/svg?seed=CM&backgroundColor=ac3d38"}
                />
              </div>
            )}
            <div>
              {title ? (
                <h1 className="text-base font-black text-gray-800 tracking-tight">{title}</h1>
              ) : (
                <div className="flex flex-col">
                  <h1 className="text-[10px] font-black text-gray-800 leading-none uppercase tracking-tight">C.E.I. Córdoba</h1>
                  <p className="text-[9px] text-[#ac3d38] font-black tracking-widest uppercase">Montessori</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white bg-white shadow-sm flex items-center justify-center active:scale-90 transition-all ring-1 ring-blue-50"
          >
            {user.profileImage ? (
              <img src={user.profileImage} alt="Me" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={16} className="text-gray-300" />
            )}
          </button>
          <button onClick={logout} className="p-2 text-gray-300 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-blue-50/50 px-4 py-1.5 flex justify-between items-center max-w-md mx-auto z-20 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.03)]">
        <NavItem icon={Home} label="Inicio" path="/dashboard" />
        <NavItem icon={BookOpen} label="Cursos" path="/courses" />
        <NavItem icon={UserIcon} label="Alumnos" path="/all-students" />
        <NavItem icon={Settings} label="Config" path="/settings" />
      </nav>
    </div>
  );
};

export default Layout;
