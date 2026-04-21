import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, AlertCircle, Award, LogIn, X } from 'lucide-react';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/residents', label: 'Residents', icon: Users },
    { path: '/programs', label: 'Programs', icon: BookOpen },
    { path: '/incidents', label: 'Incidents', icon: AlertCircle },
    { path: '/certificates', label: 'Certificates', icon: Award },
    { path: '/enrollments', label: 'Enrollments', icon: LogIn },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-gray-900 text-white flex flex-col transform md:translate-x-0 transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">SIA System</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-gray-800 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
