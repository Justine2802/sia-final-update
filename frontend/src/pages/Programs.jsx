import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, LayoutGrid, Calendar } from 'lucide-react';
import ProgramModal from './ProgramModal';
import { programsAPI } from '@/services/api';
import Loading from '@/components/Loading';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch programs from the database
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programsAPI.getAll();
      setPrograms(response.data || []);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Format budget to Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // CREATE (C)
  const handleCreate = () => {
    setSelectedProgram(null);
    setIsModalOpen(true);
  };

  // UPDATE (U)
  const handleEdit = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  // DELETE (D)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await programsAPI.delete(id);
        setPrograms(programs.filter(p => p.id !== id));
      } catch (error) {
        alert("Could not delete program. It might have active enrollees.");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Assistance Programs</h1>
          <p className="text-gray-500 font-medium">Manage and monitor social services distribution.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 font-black text-[11px] uppercase tracking-widest"
        >
          <Plus size={18} /> Create Program
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search programs..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition outline-none font-bold text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Program Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget Allocation</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Created</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {programs
              .filter(p => p.program_name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((prog) => (
              <tr key={prog.id} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                      <LayoutGrid size={20} />
                    </div>
                    <div>
                      <div className="font-black text-gray-800 text-sm tracking-tight">{prog.program_name}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase truncate max-w-[200px]">{prog.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-black text-gray-800">{formatCurrency(prog.budget_allocation)}</div>
                  <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Active Fund</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg w-fit">
                    <Calendar size={14} className="text-emerald-500" />
                    {new Date(prog.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button onClick={() => handleEdit(prog)} className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(prog.id)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {programs.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-bold italic">
            No active programs registered in the system.
          </div>
        )}
      </div>

      <ProgramModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchPrograms(); // Refresh after C/U operations
        }} 
        program={selectedProgram}
      />
    </div>
  );
};

export default Programs;