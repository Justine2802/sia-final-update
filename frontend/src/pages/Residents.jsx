import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { residentsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormInput, FormSelect } from '@/components/FormFields';

function ResidentsPage() {
  const [residents, setResidents] = useState([]);
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
      setAlert({ type: 'error', message: 'Failed to load residents' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      first_name: '',
      last_name: '',
      birth_date: '',
      address: '',
      is_verified: false,
    });
    setShowModal(true);
  };

  const handleEdit = (resident) => {
    setEditingId(resident.id);
    setFormData(resident);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await residentsAPI.delete(id);
      setAlert({ type: 'success', message: 'Resident deleted successfully' });
      fetchResidents();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete resident' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await residentsAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Resident updated successfully' });
      } else {
        await residentsAPI.create(formData);
        setAlert({ type: 'success', message: 'Resident created successfully' });
      }
      setShowModal(false);
      fetchResidents();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'An error occurred' });
    }
  };

  const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'birth_date', label: 'Birth Date' },
    { key: 'address', label: 'Address' },
    {
      key: 'is_verified',
      label: 'Verified',
      render: (row) => (
        <span className={`badge ${row.is_verified ? 'badge-success' : 'badge-warning'}`}>
          {row.is_verified ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Residents</h1>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Resident
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
            data={residents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Resident' : 'Add Resident'}>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="First Name"
            type="text"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
          />
          <FormInput
            label="Last Name"
            type="text"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
          />
          <FormInput
            label="Birth Date"
            type="date"
            value={formData.birth_date}
            onChange={(e) =>
              setFormData({ ...formData, birth_date: e.target.value })
            }
            required
          />
          <FormInput
            label="Address"
            type="text"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />
          <div className="form-group flex items-center">
            <input
              type="checkbox"
              id="verified"
              checked={formData.is_verified}
              onChange={(e) =>
                setFormData({ ...formData, is_verified: e.target.checked })
              }
              className="w-4 h-4 rounded"
            />
            <label htmlFor="verified" className="form-label ml-2 mb-0">
              Verified
            </label>
          </div>
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

export default ResidentsPage;
