import React, { useEffect, useState } from 'react';
import { Plus, Search, UserCheck, BookOpen, Clock, XCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { enrollmentsAPI, residentsAPI, programsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormSelect, FormTextarea } from '@/components/FormFields';

function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    residents_id: '',
    program_id: '',
    status: 'Applied',
    remarks: '',
  });

  const statusOptions = [
    { label: 'Applied', value: 'Applied' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Claimed', value: 'Claimed' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  useEffect(() => {
    fetchEnrollments();
    fetchResidents();
    fetchPrograms();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await enrollmentsAPI.getAll();
      setEnrollments(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load enrollment records.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await residentsAPI.getAll();
      setResidents(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) { console.error(error); }
  };

  const fetchPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      setPrograms(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await enrollmentsAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Enrollment status updated.' });
      } else {
        await enrollmentsAPI.create(formData);
        setAlert({ type: 'success', message: 'Resident enrolled successfully.' });
      }
      setShowModal(false);
      await fetchEnrollments();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error processing enrollment.' });
    }
  };

  const handleEdit = (enrollment) => {
    setEditingId(enrollment.id);
    setFormData({
      residents_id: enrollment.resident_id || enrollment.residents_id || '',
      program_id: enrollment.program_id || '',
      status: enrollment.status || 'Applied',
      remarks: enrollment.remarks || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this resident from the program?')) return;
    try {
      await enrollmentsAPI.delete(id);
      setEnrollments(prev => prev.filter(item => item.id !== id));
      setAlert({ type: 'success', message: 'Enrollment cancelled.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to remove enrollment.' });
    }
  };

  const getResidentName = (id) => {
    const resident = residents.find(r => r.id === id);
    return resident ? `${resident.first_name} ${resident.last_name}` : 'Unknown';
  };

  const getProgramName = (id) => {
    const program = programs.find(p => p.id === id);
    return program ? program.program_name : 'Unknown Program';
  };

  const filteredData = enrollments.filter(e => 
    getResidentName(e.resident_id || e.residents_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProgramName(e.program_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'resident', 
      label: 'Beneficiary',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
            {getResidentName(row.resident_id || row.residents_id).split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-bold text-gray-900">{getResidentName(row.resident_id || row.residents_id)}</span>
        </div>
      )
    },
    { 
      key: 'program', 
      label: 'Program',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen size={14} className="text-gray-400" />
          <span className="text-sm font-medium">{getProgramName(row.program_id)}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const styles = {
          'Applied': 'text-blue-600 bg-blue-50 border-blue-100',
          'Approved': 'text-indigo-600 bg-indigo-50 border-indigo-100',
          'Claimed': 'text-emerald-600 bg-emerald-50 border-emerald-100',
          'Rejected': 'text-red-600 bg-red-50 border-red-100',
        };
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black border ${styles[row.status]}`}>
             {row.status === 'Claimed' ? <CheckCircle2 size={12} /> : row.status === 'Rejected' ? <XCircle size={12} /> : <Clock size={12} />}
             {row.status.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (row) => <span className="text-xs text-gray-400 italic truncate max-w-[120px] inline-block">{row.remarks || 'No notes'}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Program Enrollments</h1>
          <p className="text-sm text-gray-500 font-medium">Tracking beneficiaries across active social programs.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ residents_id: '', program_id: '', status: 'Applied', remarks: '' });
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <UserCheck size={20} /> Enroll Resident
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or program..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Modify Enrollment' : 'New Program Enrollment'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormSelect
            label="Target Resident"
            options={residents.map(r => ({ value: r.id, label: `${r.first_name} ${r.last_name}` }))}
            value={formData.residents_id}
            onChange={(e) => setFormData({ ...formData, residents_id: e.target.value })}
            required
            disabled={!!editingId}
          />

          <FormSelect
            label="Assistance Program"
            options={programs.map(p => ({ value: p.id, label: p.program_name }))}
            value={formData.program_id}
            onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
            required
            disabled={!!editingId}
          />

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Enrollment Status</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: opt.value })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    formData.status === opt.value 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <FormTextarea
            label="Admin Remarks"
            placeholder="Add notes about eligibility or distribution..."
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows="3"
          />

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md">
              {editingId ? 'Update Enrollment' : 'Confirm Enrollment'}
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

export default EnrollmentsPage;
