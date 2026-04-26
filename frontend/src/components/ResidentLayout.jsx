import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, User, LogOut, X, Menu, AlertCircle, Award, BookOpen } from 'lucide-react';
import Header from './Header';
import Loading from './Loading';
import logo from '@/assets/logo.png';

function ResidentLayout() {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <Loading />;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/resident-dashboard', label: 'Dashboard', icon: Home },
    { path: '/resident-programs', label: 'Programs', icon: BookOpen },
    { path: '/resident-incidents', label: 'Incidents', icon: AlertCircle },
    { path: '/resident-certificates', label: 'Certificates', icon: Award },
    { path: '/resident-profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans antialiased text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-[260px] h-screen bg-[#0f172a] text-white flex flex-col transform md:translate-x-0 transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 mb-2">
          <div className="flex items-center gap-3">
             <img src={logo} alt="Logo" className="w-15 h-15 object-contain brightness-200" />
             <div className="flex flex-col leading-tight"></div>

             
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-3 w-full bg-[#ef4444]/10 hover:bg-[#ef4444] text-[#ef4444] hover:text-white py-3 rounded-xl font-bold text-sm transition-all border border-[#ef4444]/20"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ResidentLayout;

