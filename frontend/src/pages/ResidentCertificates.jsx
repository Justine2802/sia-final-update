import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { certificatesAPI } from '@/services/api';
import { FileText, Award, CreditCard } from 'lucide-react';
import Alert from '@/components/Alert';
import { FormSelect } from '@/components/FormFields';

function ResidentCertificates() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ certificate_type: '', purpose: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Extracted save logic so both buttons can use it
  const saveCertificateRequest = async (paymentStatus = 'Requested') => {
    if (!formData.certificate_type || !formData.purpose) {
      setAlert({ type: 'error', message: 'Please select both a certificate type and purpose.' });
      return;
    }

    setLoading(true);
    try {
      await certificatesAPI.create({
        resident_id: user.id, 
        certificate_type: formData.certificate_type,
        purpose: formData.purpose,
        status: paymentStatus 
      });
      setAlert({ type: 'success', message: 'Document request sent. Check your dashboard for updates.' });
      setFormData({ certificate_type: '', purpose: '' });
    } catch (err) {
      setAlert({ type: 'error', message: 'An error occurred. Check if you have pending requests.' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Standard "Pay at the Barangay Hall" Submission
  const handleFreeSubmit = async (e) => {
    e.preventDefault();
    if (!formData.certificate_type || !formData.purpose) {
       setAlert({ type: 'error', message: 'Please select both type and purpose.' });
       return;
    }
    setLoading(true);
    try {
      await saveCertificateRequest('Requested');
      setAlert({ type: 'success', message: 'Request sent! Pay at the Barangay Hall.' });
      setFormData({ certificate_type: '', purpose: '' });
    } catch (err) {
      setAlert({ type: 'error', message: 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!formData.certificate_type || !formData.purpose) {
      setAlert({ type: 'error', message: 'Please select both type and purpose.' });
      return;
    }

    setLoading(true);
    try {
      // COMMENT OUT THESE TWO LINES BELOW:
      // const res = await saveCertificateRequest('Pending Payment');
      // const id = res.data.id; 

      // CHANGE THIS PART to use a dummy ID (like '1') so it doesn't crash
      const stripeRes = await certificatesAPI.initiateStripe({
        id: 1, // DUMMY ID for testing
        certificate_type: formData.certificate_type,
        purpose: formData.purpose, // Add this just in case
        price: 50
      });

      if (stripeRes.data.url) {
        window.location.href = stripeRes.data.url;
      }
    } catch (err) {
      console.log(err); // This will help us see the actual error in console
      setAlert({ type: 'error', message: 'Stripe failed to load.' });
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

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <form className="space-y-6">
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
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              type="button" 
              onClick={handleFreeSubmit}
              disabled={loading} 
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              <FileText size={16} />
              {loading ? 'Processing...' : 'Pay at Hall'}
            </button>

            <button 
              type="button" 
              onClick={handleStripePayment}
              disabled={loading} 
              className="flex-[1.5] bg-[#635BFF] hover:bg-[#4B44CC] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              <CreditCard size={18} />
              {loading ? 'Processing...' : 'Pay via Stripe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResidentCertificates;