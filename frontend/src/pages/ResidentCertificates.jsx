import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { certificatesAPI } from '@/services/api';
import { FileText, Award } from 'lucide-react';
import Alert from '@/components/Alert';
import { FormSelect } from '@/components/FormFields';

function ResidentCertificates() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ certificate_type: '', purpose: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await certificatesAPI.create({
        resident_id: user.id, // Map to your Certificates model resident_id
        certificate_type: formData.certificate_type,
        purpose: formData.purpose,
        status: 'Requested'
      });
      setAlert({ type: 'success', message: 'Document request sent. Check your dashboard for updates.' });
      setFormData({ certificate_type: '', purpose: '' });
    } catch (err) {
      setAlert({ type: 'error', message: 'An error occurred. Check if you have pending requests.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight text-purple-600 flex items-center gap-3">
          <Award size={32} /> Request Document
        </h1>
        <p className="text-gray-500 font-medium">Request official clearances or certificates.</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSelect
            label="Type of Certificate"
            options={[
              { label: 'Barangay Clearance', value: 'Barangay Clearance' },
              { label: 'Indigency Certificate', value: 'Indigency' },
              { label: 'Residency Certificate', value: 'Residency' },
            ]}
            value={formData.certificate_type}
            onChange={(e) => setFormData({...formData, certificate_type: e.target.value})}
            required
          />
          <FormSelect
            label="Purpose of Request"
            options={[
              { label: 'Job Application', value: 'Employment' },
              { label: 'Scholarship / School Requirement', value: 'Education' },
              { label: 'Legal / Court Requirement', value: 'Legal' },
              { label: 'General Identification', value: 'General' },
            ]}
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
            <FileText size={18} />
            {loading ? 'PROCESSING...' : 'REQUEST DOCUMENT'}
          </button>
        </form>
      </div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}

export default ResidentCertificates;





