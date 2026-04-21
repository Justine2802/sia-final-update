import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { programsAPI } from '@/services/api';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { FormInput, FormTextarea, FormSelect } from '@/components/FormFields';

function ProgramsPage() {
  const [programs, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setProgramsData(response.data || []);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load programs' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      program_name: '',
      description: '',
      budget_allocation: '',
    });
    setShowModal(true);
  };

  const handleEdit = (program) => {
    setEditingId(program.id);
    setFormData(program);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await programsAPI.delete(id);
      setAlert({ type: 'success', message: 'Program deleted successfully' });
      fetchPrograms();
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete program' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await programsAPI.update(editingId, formData);
        setAlert({ type: 'success', message: 'Program updated successfully' });
      } else {
        await programsAPI.create(formData);
        setAlert({ type: 'success', message: 'Program created successfully' });
      }
      setShowModal(false);
      fetchPrograms();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'An error occurred' });
    }
  };

  const columns = [
    { key: 'program_name', label: 'Program Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'budget_allocation',
      label: 'Budget',
      render: (row) => `₱${parseFloat(row.budget_allocation).toLocaleString()}`,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Programs</h1>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Program
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
            data={programs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Program' : 'Add Program'} size="lg">
        <form onSubmit={handleSubmit}>
          <FormSelect
            label="Program Name"
            options={programOptions}
            value={formData.program_name}
            onChange={(e) =>
              setFormData({ ...formData, program_name: e.target.value })
            }
            required
          />
          <FormTextarea
            label="Description"
            placeholder="Enter program description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            rows="4"
          />
          <FormInput
            label="Budget Allocation"
            type="number"
            placeholder="Enter budget amount"
            value={formData.budget_allocation}
            onChange={(e) =>
              setFormData({ ...formData, budget_allocation: e.target.value })
            }
            required
            step="0.01"
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

export default ProgramsPage;
