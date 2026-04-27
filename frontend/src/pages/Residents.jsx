import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import ResidentHistoryModal from './ResidentHistoryModal';
import AddResidentModal from './AddResidentModal'; // Ensure this file exists

const Residents = () => {
  // 1. All States must be inside the component
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  

  // Static Data
  const [residents, setResidents] = useState([
    { id: '#0001', name: 'Ivan Dequiros', birthDate: '4/27/2026', address: 'Pandan Angeles', status: 'PENDING' },
    { id: '#0002', name: 'Recy Dequiros', birthDate: '4/27/2026', address: 'San Roque Hall, Main St...', status: 'PENDING' },
  ]);

  // BUTTON ACTIONS
  const handleAdd = () => {
  setSelectedResident(null); // Clear any previous selection
  setIsAddModalOpen(true);
};
  
  
const handleEdit = (resident) => {
  setSelectedResident(resident); // Load this resident's data
  setIsAddModalOpen(true);
};

  const handleDelete = (id) => {
    const confirm = window.confirm("Delete this resident record?");
    if(confirm) setResidents(residents.filter(r => r.id !== id));
  };

  const handleViewHistory = (resident) => {
    setSelectedResident(resident);
    setIsHistoryOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Residents Registry</h1>
          <p className="text-gray-500 font-medium">Manage and verify barangay resident information.</p>
        </div>
        <button 
          onClick={handleAdd} 
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition shadow-lg shadow-gray-200 font-black text-[11px] uppercase tracking-widest"
        >
          <Plus size={18} /> Add Resident
        </button>
      </div>

      {/* SEARCH LOGIC */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 transition outline-none text-sm font-bold"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Resident Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Birth Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Address</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {residents.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((res) => (
              <tr key={res.id} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                    <div className="font-black text-gray-800 text-sm tracking-tight">{res.name}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {res.id}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-500">{res.birthDate}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-500">{res.address}</td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button 
                    onClick={() => handleViewHistory(res)} 
                    className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="History"
                  >
                    <Clock size={18} />
                  </button>
                  <button 
                    onClick={() => handleEdit(res)} 
                    className="p-2 text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(res.id)} 
                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. MODAL COMPONENTS */}
      <AddResidentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        resident={selectedResident} // Pass for editing
      />

      <ResidentHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        resident={selectedResident} 
        activities={[]} 
      />
    </div>
  );
};

export default Residents;