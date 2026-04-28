import React, { useState, useEffect } from 'react';
import { Send, Phone, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { incidentsAPI } from '@/services/api';
import Alert from '@/components/Alert';

const ResidentIncidents = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [myIncidents, setMyIncidents] = useState([]);
  const [alert, setAlert] = useState(null);
  
  const [formData, setFormData] = useState({
    incident_type: '',
    description: ''
  });

  // 1. Fetch this specific resident's incident history
  const fetchMyHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await incidentsAPI.getAll();
      // Filter for reports belonging to this user
      const filtered = (response.data || []).filter(inc => inc.resident_id === user?.id);
      setMyIncidents(filtered.slice(0, 5)); // Just show the top 5
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyHistory();
  }, [user?.id]);

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.incident_type || !formData.description) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    try {
      await incidentsAPI.create({
        resident_id: user.id,
        incident_type: formData.incident_type,
        description: formData.description,
        status: 'Pending'
      });
      
      setAlert({ type: 'success', message: 'Report submitted successfully!' });
      setFormData({ incident_type: '', description: '' });
      fetchMyHistory(); // Refresh history list
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to submit report.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Report Incident</h1>
          <p className="text-gray-500 font-medium">Provide details about community issues or security concerns.</p>
        </div>
      </div>

      {alert && <div className="mb-6"><Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE: THE FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">What happened?</label>
              <select 
                value={formData.incident_type}
                onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 focus:ring-4 focus:ring-orange-500/5 transition outline-none"
              >
                <option value="">-- Select --</option>
                <option value="Theft">Theft</option>
                <option value="Physical Altercation">Physical Altercation</option>
                <option value="Noise Complaint">Noise Complaint</option>
                <option value="Property Damage">Property Damage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Provide Description</label>
              <textarea 
                rows="6"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Type your detailed report here..."
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[24px] font-medium text-gray-700 focus:ring-4 focus:ring-orange-500/5 transition resize-none outline-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#eb5e28] hover:bg-[#d44d1d] text-white rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-200 transition-all mt-4 disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>

        {/* RIGHT SIDE: SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-[32px] p-6 text-white shadow-xl">
            <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-4">Emergency Hotlines</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg"><Phone size={16}/></div>
                    <span className="text-xs font-bold">Barangay Tanod</span>
                </div>
                <span className="text-xs font-black text-orange-400">911-BRGY</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><Phone size={16}/></div>
                    <span className="text-xs font-bold">Local Police</span>
                </div>
                <span className="text-xs font-black text-blue-400">117</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Recent Reports</h3>
            <div className="space-y-4">
              {historyLoading ? (
                <p className="text-xs text-gray-400 italic">Loading history...</p>
              ) : myIncidents.length > 0 ? (
                myIncidents.map((inc) => (
                  <div key={inc.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      {inc.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{inc.incident_type}</p>
                      <p className={`text-[10px] uppercase font-black tracking-tighter ${inc.status === 'Resolved' ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {new Date(inc.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} • {inc.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No reports filed yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentIncidents;