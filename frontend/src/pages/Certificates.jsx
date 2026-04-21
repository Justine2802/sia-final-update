import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    resident_id: '',
    certificate_type: '',
    purpose: '',
    status: 'Pending',
    issued_at: '',
  });

  const certificateTypeOptions = [
    { label: 'Barangay Clearance', value: 'Barangay Clearance' },
    { label: 'Residency Certificate', value: 'Residency Certificate' },
    { label: 'Good Moral Certificate', value: 'Good Moral Certificate' },
    { label: 'Indigency Certificate', value: 'Indigency Certificate' },
  ];

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Issued', value: 'Issued' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  useEffect(() => {
    fetchCertificates();
    fetchResidents();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificatesAPI.getAll();
      setCertificates(response.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load certificates' });
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await residentsAPI.getAll();
      setResidents(response.data || []);
    } catch (error) {
      console.error('Failed to load residents:', error);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      resident_id: '',
      certificate_type: '',
      purpose: '',
      status: 'Pending',
      issued_at: '',
    });
    setShowModal(true);
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setFormData(cert);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await certificatesAPI.delete(id);
      setAlert({ type: 'success', message: 'Certificate deleted successfully' });
      fetchCertificates();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete certificate' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await certificatesAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Certificate updated successfully' });
      } else {
        await certificatesAPI.create(formData);
        setAlert({ type: 'success', message: 'Certificate created successfully' });
      }
      setShowModal(false);
      fetchCertificates();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'An error occurred' });
    }
  };

  const getResidentName = (residentId) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? `${resident.first_name} ${resident.last_name}` : 'Unknown';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Issued':
        return 'badge-success';
      case 'Approved':
        return 'badge-info';
      case 'Pending':
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  };

  const columns = [
    {
      key: 'resident_id',
      label: 'Resident',
      render: (row) => getResidentName(row.resident_id),
    },
    { key: 'certificate_type', label: 'Type' },
    { key: 'purpose', label: 'Purpose' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'issued_at',
      label: 'Issued At',
      render: (row) => row.issued_at ? new Date(row.issued_at).toLocaleDateString() : '-',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Certificates</h1>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Issue Certificate
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            data={certificates}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Certificate' : 'Issue Certificate'} size="lg">
        <form onSubmit={handleSubmit}>
          <FormSelect
            label="Resident"
            options={residents.map(r => ({
              value: r.id,
              label: `${r.first_name} ${r.last_name}`
            }))}
            value={formData.resident_id}
            onChange={(e) =>
              setFormData({ ...formData, resident_id: e.target.value })
            }
            required
          />
          <FormSelect
            label="Certificate Type"
            options={certificateTypeOptions}
            value={formData.certificate_type}
            onChange={(e) =>
              setFormData({ ...formData, certificate_type: e.target.value })
            }
            required
          />
          <FormInput
            label="Purpose"
            type="text"
            placeholder="Enter purpose"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            required
          />
          <FormSelect
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          />
          <FormInput
            label="Issued At"
            type="datetime-local"
            value={formData.issued_at}
            onChange={(e) =>
              setFormData({ ...formData, issued_at: e.target.value })
            }
          />
          <div className="flex gap-2 mt-6">
            <button type="submit" className="btn btn-primary flex-1">
              {editingId ? 'Update' : 'Issue'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CertificatesPage;
