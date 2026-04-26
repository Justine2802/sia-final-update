import React from 'react';
import { Menu, User } from 'lucide-react';

function Header({ onMenuClick, user }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Social Assistance System</h1>
        </div>
        
        {/* Profile Section */}
        <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-1 py-1 rounded-full border border-gray-200 group cursor-pointer hover:border-blue-300 transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-none">{user?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase mt-1 tracking-wider">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

