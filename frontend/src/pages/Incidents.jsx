
import React, { useEffect, useState } from 'react';
import { Plus, Search, AlertCircle, Clock, CheckCircle2, User, Calendar } from 'lucide-react';
import { incidentsAPI, residentsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormSelect, FormTextarea } from '@/components/FormFields';

function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    residents_id: '',
    incident_type: '',
    description: '',
    status: 'Pending',
  });

  const incidentTypeOptions = [
    { label: 'Theft', value: 'Theft' },
    { label: 'Physical Altercation', value: 'Physical Altercation' },
    { label: 'Noise Complaint', value: 'Noise Complaint' },
    { label: 'Other', value: 'Other' },
  ];

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Under Investigation', value: 'Under Investigation' },
    { label: 'Resolved', value: 'Resolved' },
  ];

  useEffect(() => {
    const init = async () => {
      await fetchResidents();
      await fetchIncidents();
    };
    init();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentsAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setIncidents(data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load incident reports.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await residentsAPI.getAll();
      setResidents(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) { console.error('Error fetching residents:', error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update Existing
        await incidentsAPI.update(editingId, formData);
        
        // Sync Local UI State
        setIncidents(prev => prev.map(inc => 
          inc.id === editingId ? { ...inc, ...formData } : inc
        ));
        
        setAlert({ type: 'success', message: 'Incident status updated.' });
      } else {
        // Create New
        const response = await incidentsAPI.create(formData);
        
        // Optimistic UI Update: Add new record to list immediately
        const newIncident = response.data.data || response.data;
        setIncidents(prev => [newIncident, ...prev]);
        
        setAlert({ type: 'success', message: 'Incident report filed successfully.' });
      }
      
      setShowModal(false);
      // Background Sync
      await fetchIncidents();
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Error saving report. Please verify all fields.';
      setAlert({ type: 'error', message: msg });
    }
  };

  const handleEdit = (incident) => {
    setEditingId(incident.id);
    setFormData({
      residents_id: incident.residents_id || '',
      incident_type: incident.incident_type || '',
      description: incident.description || '',
      status: incident.status || 'Pending',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this record?')) return;
    try {
      await incidentsAPI.delete(id);
      // Remove from UI instantly
      setIncidents(prev => prev.filter(item => item.id !== id));
      setAlert({ type: 'success', message: 'Record deleted.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Delete failed.' });
    }
  };

  const getResidentName = (id) => {
    const resident = residents.find(r => r.id == id);
    return resident ? `${resident.first_name} ${resident.last_name}` : 'Unknown Resident';
  };

  const filteredIncidents = incidents.filter(i => 
    getResidentName(i.residents_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.incident_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'residents_id', 
      label: 'Reported By',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shadow-inner border border-slate-200">
            {getResidentName(row.residents_id).split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none">{getResidentName(row.residents_id)}</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold italic">Registered Citizen</p>
          </div>
        </div>
      )
    },
    { 
      key: 'incident_type', 
      label: 'Type',
      render: (row) => (
        <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 uppercase tracking-widest">
          {row.incident_type}
        </span>
      )
    },
    { 
      key: 'description', 
      label: 'Details',
      render: (row) => (
        <p className="text-xs text-gray-500 max-w-[200px] truncate">
          {row.description}
        </p>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const styles = {
          'Pending': 'text-amber-600 bg-amber-50 border-amber-100',
          'Under Investigation': 'text-blue-600 bg-blue-50 border-blue-100',
          'Resolved': 'text-emerald-600 bg-emerald-50 border-emerald-100',
        };
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black border ${styles[row.status] || ''}`}>
            {row.status.toUpperCase()}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Incidents</h1>
          <p className="text-sm text-gray-500 font-medium">Monitoring community safety reports.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ residents_id: '', incident_type: '', description: '', status: 'Pending' });
            setShowModal(true);
          }}
          className="bg-[#111827] hover:bg-black text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} /> New Report
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter incidents..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredIncidents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Edit Incident Status' : 'Create New Report'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormSelect
            label="Complainant / Resident"
            options={residents.map(r => ({ value: r.id, label: `${r.first_name} ${r.last_name}` }))}
            value={formData.residents_id}
            onChange={(e) => setFormData({ ...formData, residents_id: e.target.value })}
            required
          />

          <FormSelect
            label="Incident Category"
            options={incidentTypeOptions}
            value={formData.incident_type}
            onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
            required
          />

          <FormTextarea
            label="Description of Anomaly"
            placeholder="Describe the incident in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="4"
          />

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Investigation Status</label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: opt.value })}
                  className={`py-2 px-1 rounded-lg text-[10px] font-black border transition-all ${
                    formData.status === opt.value 
                    ? 'bg-orange-600 border-orange-600 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300'
                  }`}
                >
                  {opt.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100 mt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md">
              {editingId ? 'Save Changes' : 'Post Report'}
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

export default IncidentsPage;



