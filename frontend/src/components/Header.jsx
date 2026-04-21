import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function Header({ onMenuClick, user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Social Assistance System</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
