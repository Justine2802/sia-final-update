import React, { useEffect, useState } from 'react';
import { Plus, Search, Award, CheckCircle2, Clock, XCircle, User, FileText, Calendar } from 'lucide-react';
import { certificatesAPI, residentsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormInput, FormSelect } from '@/components/FormFields';

function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    resident_id: '',
    certificate_type: '',
    purpose: '',
    status: 'Requested',
    issued_at: '',
  });

  const certificateTypes = [
    { label: 'Barangay Clearance', value: 'Barangay Clearance' },
    { label: 'Indigency', value: 'Indigency' },
    { label: 'Residency', value: 'Residency' },
  ];

  const purposeOptions = [
    { label: 'Employment', value: 'Employment' },
    { label: 'Education', value: 'Education' },
    { label: 'Legal', value: 'Legal' },
    { label: 'General', value: 'General' },
  ];

  useEffect(() => {
    fetchCertificates();
    fetchResidents();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificatesAPI.getAll();
      setCertificates(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch certificate requests.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await residentsAPI.getAll();
      setResidents(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Resident fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await certificatesAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Certificate status updated.' });
      } else {
        await certificatesAPI.create(formData);
        setAlert({ type: 'success', message: 'Certificate request submitted.' });
      }
      setShowModal(false);
      await fetchCertificates();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to save certificate.' });
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setFormData({
      resident_id: cert.resident_id || '',
      certificate_type: cert.certificate_type || '',
      purpose: cert.purpose || '',
      status: cert.status || 'Requested',
      issued_at: cert.issued_at ? cert.issued_at.split(' ')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this certificate record?')) return;
    try {
      await certificatesAPI.delete(id);
      setCertificates(prev => prev.filter(item => item.id !== id));
      setAlert({ type: 'success', message: 'Record removed.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error deleting record.' });
    }
  };

  const getResidentName = (id) => {
    const resident = residents.find(r => r.id === id);
    return resident ? `${resident.first_name} ${resident.last_name}` : 'Unknown Resident';
  };

  const filteredCertificates = certificates.filter(c => 
    getResidentName(c.resident_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificate_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'resident', 
      label: 'Resident',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <User size={16} />
          </div>
          <span className="font-bold text-gray-900">{getResidentName(row.resident_id)}</span>
        </div>
      )
    },
    { key: 'certificate_type', label: 'Type' },
    { 
      key: 'purpose', 
      label: 'Purpose',
      render: (row) => <span className="text-xs text-gray-500 font-medium">{row.purpose}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const styles = {
          'Requested': 'text-blue-600 bg-blue-50 border-blue-100',
          'Processing': 'text-amber-600 bg-amber-50 border-amber-100',
          'Issued': 'text-emerald-600 bg-emerald-50 border-emerald-100',
          'Denied': 'text-red-600 bg-red-50 border-red-100',
        };
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black border ${styles[row.status]}`}>
             {row.status === 'Issued' ? <CheckCircle2 size={12} /> : row.status === 'Denied' ? <XCircle size={12} /> : <Clock size={12} />}
             {row.status.toUpperCase()}
          </span>
        );
      },
    },
    {
        key: 'date',
        label: 'Issued At',
        render: (row) => (
            <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={14} />
                <span className="text-xs">{row.issued_at ? row.issued_at.split(' ')[0] : 'Not Yet'}</span>
            </div>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Certificates</h1>
          <p className="text-sm text-gray-500 font-medium">Issue and manage official barangay documents.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ resident_id: '', certificate_type: '', purpose: '', status: 'Requested', issued_at: '' });
            setShowModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Issue New
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter certificates..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredCertificates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Process Request' : 'New Certificate Request'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormSelect
            label="Resident"
            options={residents.map(r => ({ value: r.id, label: `${r.first_name} ${r.last_name}` }))}
            value={formData.resident_id}
            onChange={(e) => setFormData({ ...formData, resident_id: e.target.value })}
            required
            disabled={!!editingId}
          />

          <FormSelect
            label="Certificate Type"
            options={certificateTypes}
            value={formData.certificate_type}
            onChange={(e) => setFormData({ ...formData, certificate_type: e.target.value })}
            required
          />

          <FormSelect
            label="Purpose"
            options={purposeOptions}
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            required
          />

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Application Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['Requested', 'Processing', 'Issued', 'Denied'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    formData.status === status 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-purple-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <FormInput
            label="Issuance Date (Optional)"
            type="date"
            value={formData.issued_at}
            onChange={(e) => setFormData({ ...formData, issued_at: e.target.value })}
          />

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all shadow-md">
              {editingId ? 'Update Record' : 'Create Entry'}
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

export default CertificatesPage;