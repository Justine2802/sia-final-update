import React, { useEffect, useState } from 'react';
import { Plus, Search, BookOpen, DollarSign, Edit3, Trash2, Briefcase } from 'lucide-react';
import { programsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormInput, FormTextarea, FormSelect } from '@/components/FormFields';

function ProgramsPage() {
  const [programs, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    program_name: '',
    description: '',
    budget_allocation: '',
  });

  const programOptions = [
    { label: 'Senior Citizen Pension', value: 'Senior Citizen Pension' },
    { label: 'TUPAD', value: 'TUPAD' },
    { label: 'Rice Distribution', value: 'Rice Distribution' },
    { label: 'Financial Aid', value: 'Financial Aid' },
  ];

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await programsAPI.getAll();
      setProgramsData(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load social assistance programs.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await programsAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Program details updated.' });
      } else {
        await programsAPI.create(formData);
        setAlert({ type: 'success', message: 'New assistance program created.' });
      }
      setShowModal(false);
      await fetchPrograms(); // Sync background
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Check inputs and try again.' });
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.id);
    setFormData({
      program_name: program.program_name || '',
      description: program.description || '',
      budget_allocation: program.budget_allocation || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program? This will affect all current enrollments.')) return;
    try {
      await programsAPI.delete(id);
      // Optimistic UI Update: Filter local state immediately
      setProgramsData(prev => prev.filter(item => item.id !== id));
      setAlert({ type: 'success', message: 'Program successfully archived/removed.' });
      fetchPrograms(); // background sync
    } catch (error) {
      setAlert({ type: 'error', message: 'Cannot delete program while residents are enrolled.' });
    }
  };

  const filteredPrograms = programs.filter(p => 
    p.program_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'program_name', 
      label: 'Program Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900">{row.program_name}</p>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Active Program</p>
          </div>
        </div>
      )
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (row) => (
        <p className="text-xs text-gray-500 max-w-[250px] whitespace-normal line-clamp-2 leading-relaxed">
          {row.description}
        </p>
      )
    },
    {
      key: 'budget_allocation',
      label: 'Budget Allocation',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-black text-gray-900">
            ₱{parseFloat(row.budget_allocation).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Allocated Fund</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Assistance Programs</h1>
          <p className="text-gray-500 font-medium">Manage and monitor social services distribution.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ program_name: '', description: '', budget_allocation: '' });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus size={20} />
          Create Program
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search programs..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredPrograms}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Edit Program Details' : 'Initialize New Program'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormSelect
            label="Program Name"
            options={programOptions}
            value={formData.program_name}
            onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
            required
          />

          <FormTextarea
            label="Program Description"
            placeholder="Describe the scope and requirements of this program..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="4"
          />

          <div className="relative">
             <label className="block text-sm font-semibold text-gray-700 mb-1">Budget Allocation</label>
             <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
               <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.budget_allocation}
                onChange={(e) => setFormData({ ...formData, budget_allocation: e.target.value })}
                required
               />
             </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md">
              {editingId ? 'Save Changes' : 'Launch Program'}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="px-6 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProgramsPage;



