import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { incidentsAPI } from '@/services/api';
import { Send, AlertTriangle } from 'lucide-react';
import Alert from '@/components/Alert';
import { FormSelect, FormTextarea } from '@/components/FormFields';

function ResidentIncidents() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ incident_type: '', description: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.incident_type || !formData.description) return;
    
    setLoading(true);
    try {
      await incidentsAPI.create({
        residents_id: user.id, // Map to Laravel residents_id
        incident_type: formData.incident_type,
        description: formData.description,
        status: 'Pending'
      });
      setAlert({ type: 'success', message: 'Incident reported. Thank you for your cooperation.' });
      setFormData({ incident_type: '', description: '' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to submit report. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight text-orange-600 flex items-center gap-3">
          <AlertTriangle size={32} /> Report Incident
        </h1>
        <p className="text-gray-500 font-medium">Provide details about community issues or security concerns.</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSelect
            label="What happened?"
            options={[
              { label: 'Theft / Robbery', value: 'Theft' },
              { label: 'Physical Dispute', value: 'Physical Altercation' },
              { label: 'Noise Disturbance', value: 'Noise Complaint' },
              { label: 'Other', value: 'Other' },
            ]}
            value={formData.incident_type}
            onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
            required
          />
          <FormTextarea
            label="Provide Description"
            placeholder="Type your detailed report here..."
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
            <Send size={18} />
            {loading ? 'SENDING...' : 'SUBMIT REPORT'}
          </button>
        </form>
      </div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}

export default ResidentIncidents;

