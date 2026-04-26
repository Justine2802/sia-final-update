import React, { useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, ShieldCheck, ShieldAlert, MapPin, Calendar as CalIcon } from 'lucide-react';
import { residentsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormInput } from '@/components/FormFields';

function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    address: '',
    is_verified: false,
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await residentsAPI.getAll();
      setResidents(response.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch resident records.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await residentsAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Resident updated successfully.' });
      } else {
        await residentsAPI.create(formData);
        setAlert({ type: 'success', message: 'New resident added to system.' });
      }
      setShowModal(false);
      fetchResidents();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Operation failed.' });
    }
  };

  const handleEdit = (resident) => {
    setEditingId(resident.id);
    setFormData(resident);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resident record permanently?')) return;
    try {
      await residentsAPI.delete(id);
      setAlert({ type: 'success', message: 'Record removed.' });
      fetchResidents();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete record.' });
    }
  };

  const filteredResidents = residents.filter(r => 
    `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'name', 
      label: 'Resident Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {row.first_name[0]}{row.last_name[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{row.first_name} {row.last_name}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: #{row.id.toString().padStart(4, '0')}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'birth_date', 
      label: 'Birth Date',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <CalIcon size={14} className="text-gray-400" />
          <span className="text-sm">{new Date(row.birth_date).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      key: 'address', 
      label: 'Address',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-600 max-w-[200px]">
          <MapPin size={14} className="text-gray-400 shrink-0" />
          <span className="text-sm truncate">{row.address}</span>
        </div>
      )
    },
    {
      key: 'is_verified',
      label: 'Status',
      render: (row) => (
        row.is_verified ? (
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-[11px] font-bold border border-emerald-100 w-fit">
            <ShieldCheck size={12} /> VERIFIED
          </span>
        ) : (
          <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-[11px] font-bold border border-orange-100 w-fit">
            <ShieldAlert size={12} /> PENDING
          </span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Residents Registry</h1>
          <p className="text-gray-500 font-medium">Manage and verify barangay resident information.</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ first_name: '', last_name: '', birth_date: '', address: '', is_verified: false }); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Resident
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? <Loading /> : (
          <Table
            columns={columns}
            data={filteredResidents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Update Information' : 'New Resident Registration'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="First Name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
            <FormInput label="Last Name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
          </div>
          <FormInput label="Birth Date" type="date" value={formData.birth_date} onChange={(e) => setFormData({...formData, birth_date: e.target.value})} required />
          <FormInput label="Full Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
          
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer group hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              checked={formData.is_verified} 
              onChange={(e) => setFormData({...formData, is_verified: e.target.checked})}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-700">Verified Resident</span>
              <span className="text-[10px] text-gray-500 uppercase font-medium">Account is verified and active</span>
            </div>
          </label>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
              {editingId ? 'Save Changes' : 'Register Resident'}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all text-sm">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ResidentsPage;



