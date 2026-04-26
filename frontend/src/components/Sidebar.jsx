import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, AlertCircle, Award, LogIn, LogOut, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/residents', label: 'Residents', icon: Users },
    { path: '/programs', label: 'Programs', icon: BookOpen },
    { path: '/incidents', label: 'Incidents', icon: AlertCircle },
    { path: '/certificates', label: 'Certificates', icon: Award },
    { path: '/enrollments', label: 'Enrollments', icon: LogIn },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm md:hidden z-40" onClick={onClose}></div>}

      <aside className={`fixed md:relative w-64 h-screen bg-gray-900 text-white flex flex-col transform md:translate-x-0 transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <div className="flex items-center gap-3">
             <img src={logo} alt="Logo" className="w-15 h-15 object-contain brightness-200" />
             
          </div>
          <button onClick={onClose} className="md:hidden p-1 hover:bg-gray-800 rounded"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => { if(window.innerWidth < 768) onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === path ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl font-bold transition-all border border-red-500/20"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;