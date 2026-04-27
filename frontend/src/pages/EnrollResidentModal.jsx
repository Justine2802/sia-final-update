import React from 'react';
import { X, UserCheck, Calendar, BookOpen } from 'lucide-react';

const EnrollResidentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-600">
          <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest text-[13px]">
            <UserCheck size={20} /> New Program Enrollment
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Select Resident */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Resident</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition text-sm appearance-none font-medium">
                <option>Select a resident...</option>
                <option>Ivan Dequiros</option>
                <option>Recy Dequiros</option>
            </select>
          </div>

          {/* Select Program */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assigned Program</label>
            <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition text-sm appearance-none font-medium">
                    <option>Select a program...</option>
                    <option>Senior Citizen Pension</option>
                    <option>Rice Distribution</option>
                    <option>TUPAD</option>
                </select>
            </div>
          </div>

          {/* APPLICATION DATE */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Application Date</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition text-sm font-medium"
                />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-200 rounded-xl transition">
            Cancel
          </button>
          <button className="flex-1 py-3 text-[11px] font-black bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition uppercase tracking-widest">
            Confirm Enrollment
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollResidentModal;