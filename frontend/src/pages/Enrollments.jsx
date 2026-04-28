import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, Calendar, Trash2 } from 'lucide-react';
import EnrollResidentModal from './EnrollResidentModal';
import { programResidentsAPI } from '@/services/api';
import Loading from '@/components/Loading';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await programResidentsAPI.getAll();
      setEnrollments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Handle immediate status changes from the dropdown
  const handleStatusChange = async (id, newStatus) => {
    try {
      // 1. Send update to the backend
      await programResidentsAPI.update(id, { status: newStatus });
      
      // 2. Update the local UI state so it changes instantly
      setEnrollments(enrollments.map(enr => 
        enr.id === id ? { ...enr, status: newStatus } : enr
      ));
    } catch (error) {
      console.error(error);
      alert("Failed to update status. Check database connection.");
    }
  };

  const handleRevoke = async (id) => {
    if (window.confirm("Are you sure you want to revoke this resident's enrollment? This action cannot be undone.")) {
      try {
        await programResidentsAPI.delete(id);
        setEnrollments(enrollments.filter(enr => enr.id !== id));
      } catch (error) {
        console.error(error);
        alert("Failed to remove enrollment. Check database connections.");
      }
    }
  };

  const getResidentName = (enr) => {
    if (enr?.resident) {
      return `${enr.resident.first_name || ''} ${enr.resident.last_name || ''}`.trim();
    }
    return `Resident ID: #${enr?.resident_id || 'Unknown'}`;
  };

  if (loading) return <Loading />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Program Enrollments</h1>
          <p className="text-gray-500 font-medium">Tracking beneficiaries across active social programs.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-black text-[11px] uppercase tracking-widest"
        >
          <UserPlus size={18} /> Enroll Resident
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or program..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 transition font-bold" 
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
            {enrollments
              .filter(enr => {
                const name = getResidentName(enr).toLowerCase();
                const program = (enr?.program?.program_name || "").toLowerCase();
                const search = searchTerm.toLowerCase();
                return name.includes(search) || program.includes(search);
              })
              .map((enr) => (
              <tr key={enr?.id || Math.random()} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm">{getResidentName(enr)}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter italic">ID: #{enr?.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      {enr?.program?.program_name || 'Generic Program'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        {enr?.date_applied ? new Date(enr.date_applied).toLocaleDateString() : 'N/A'}
                    </div>
                </td>
                <td className="px-6 py-4">
                  {/* Dynamic Interactive Status Dropdown */}
                  <select
                    value={enr?.status || 'Applied'}
                    onChange={(e) => handleStatusChange(enr.id, e.target.value)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase outline-none cursor-pointer transition-colors ${
                      enr?.status === 'Approved' || enr?.status === 'Claimed' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                        : enr?.status === 'Rejected'
                        ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                        : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                    }`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Approved">Approved</option>
                    <option value="Claimed">Claimed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleRevoke(enr.id)}
                      title="Revoke Enrollment"
                      className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {enrollments.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400 font-bold italic">
            No active program enrollments found in the database.
          </div>
        )}
      </div>

      <EnrollResidentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchEnrollments();
        }} 
      />
    </div>
  );
};

export default Enrollments;