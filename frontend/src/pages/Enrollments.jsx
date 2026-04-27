import React, { useState } from 'react';
import { Search, Plus, UserPlus, Filter, MoreVertical, Calendar, CheckCircle2 } from 'lucide-react';
import EnrollResidentModal from './EnrollResidentModal';

const Enrollments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample static data for the enrollment list
  const enrollments = [
    { id: 'ENR-001', resident: 'Ivan Dequiros', program: 'Senior Citizen Pension', date: '4/28/2026', status: 'VERIFIED' },
    { id: 'ENR-002', resident: 'Recy Dequiros', program: 'Rice Distribution', date: '4/27/2026', status: 'PENDING' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Program Enrollments</h1>
          <p className="text-gray-500 font-medium">Tracking beneficiaries across active social programs.</p>
        </div>
        
        {/* ENROLL BUTTON */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-black text-[11px] uppercase tracking-widest"
        >
          <UserPlus size={18} /> Enroll Resident
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by name or program..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 transition" 
                />
            </div>
            <button className="p-2 text-gray-400 hover:text-emerald-600 transition">
                <Filter size={20} />
            </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Resident / Applicant</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Assigned Program</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Application Date</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {enrollments.map((enr) => (
              <tr key={enr.id} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm">{enr.resident}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter italic">{enr.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-semibold text-gray-700">{enr.program}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        {enr.date}
                    </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${
                    enr.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {enr.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-gray-600 transition"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EnrollResidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Enrollments;