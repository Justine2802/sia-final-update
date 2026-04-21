import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { enrollmentsAPI, residentsAPI, programsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormInput, FormSelect, FormTextarea } from '@/components/FormFields';

function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    residents_id: '',
    program_id: '',
    status: 'Approved',
    remarks: '',
  });

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
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
      setEnrollments(response.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load enrollments' });
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

  const fetchPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      setPrograms(response.data || []);
    } catch (error) {
      console.error('Failed to load programs:', error);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      residents_id: '',
      program_id: '',
      status: 'Approved',
      remarks: '',
    });
    setShowModal(true);
  };

  const handleEdit = (enrollment) => {
    setEditingId(enrollment.id);
    setFormData(enrollment);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await enrollmentsAPI.delete(id);
      setAlert({ type: 'success', message: 'Enrollment deleted successfully' });
      fetchEnrollments();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete enrollment' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await enrollmentsAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Enrollment updated successfully' });
      } else {
        await enrollmentsAPI.create(formData);
        setAlert({ type: 'success', message: 'Enrollment created successfully' });
      }
      setShowModal(false);
      fetchEnrollments();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'An error occurred' });
    }
  };

  const getResidentName = (residentId) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? `${resident.first_name} ${resident.last_name}` : 'Unknown';
  };

  const getProgramName = (programId) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.program_name : 'Unknown';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-success';
      case 'Pending':
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  };

  const columns = [
    {
      key: 'residents_id',
      label: 'Resident',
      render: (row) => getResidentName(row.residents_id || row.resident_id),
    },
    {
      key: 'program_id',
      label: 'Program',
      render: (row) => getProgramName(row.program_id),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    { key: 'remarks', label: 'Remarks' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Enrollments</h1>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Enrollment
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
            data={enrollments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Enrollment' : 'Add Enrollment'} size="lg">
        <form onSubmit={handleSubmit}>
          <FormSelect
            label="Resident"
            options={residents.map(r => ({
              value: r.id,
              label: `${r.first_name} ${r.last_name}`
            }))}
            value={formData.residents_id}
            onChange={(e) =>
              setFormData({ ...formData, residents_id: e.target.value })
            }
            required
          />
          <FormSelect
            label="Program"
            options={programs.map(p => ({
              value: p.id,
              label: p.program_name
            }))}
            value={formData.program_id}
            onChange={(e) =>
              setFormData({ ...formData, program_id: e.target.value })
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
          <FormTextarea
            label="Remarks"
            placeholder="Enter remarks"
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            rows="3"
          />
          <div className="flex gap-2 mt-6">
            <button type="submit" className="btn btn-primary flex-1">
              {editingId ? 'Update' : 'Create'}
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

export default EnrollmentsPage;
