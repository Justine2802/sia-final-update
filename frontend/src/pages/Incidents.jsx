import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { incidentsAPI, residentsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormInput, FormSelect, FormTextarea } from '@/components/FormFields';

function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchIncidents();
    fetchResidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentsAPI.getAll();
      setIncidents(response.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load incidents' });
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
      residents_id: '',
      incident_type: '',
      description: '',
      status: 'Pending',
    });
    setShowModal(true);
  };

  const handleEdit = (incident) => {
    setEditingId(incident.id);
    setFormData({
      residents_id: incident.residents_id,
      incident_type: incident.incident_type,
      description: incident.description,
      status: incident.status || 'Pending',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await incidentsAPI.delete(id);
      setAlert({ type: 'success', message: 'Incident deleted successfully' });
      fetchIncidents();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete incident' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await incidentsAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Incident updated successfully' });
      } else {
        await incidentsAPI.create(formData);
        setAlert({ type: 'success', message: 'Incident reported successfully' });
      }
      setShowModal(false);
      fetchIncidents();
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
      case 'Resolved':
        return 'badge-success';
      case 'Under Investigation':
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  };

  const columns = [
    {
      key: 'residents_id',
      label: 'Resident',
      render: (row) => getResidentName(row.residents_id),
    },
    { key: 'incident_type', label: 'Type' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Incidents</h1>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Report Incident
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
            data={incidents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Incident' : 'Report Incident'} size="lg">
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
            label="Incident Type"
            options={incidentTypeOptions}
            value={formData.incident_type}
            onChange={(e) =>
              setFormData({ ...formData, incident_type: e.target.value })
            }
            required
          />
          <FormTextarea
            label="Description"
            placeholder="Describe the incident"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows="4"
          />
          {editingId && (
            <FormSelect
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            />
          )}
          <div className="flex gap-2 mt-6">
            <button type="submit" className="btn btn-primary flex-1">
              {editingId ? 'Update' : 'Report'}
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

export default IncidentsPage;
