import React, { useState, useEffect } from 'react';
import { Send, Phone, ShieldAlert, CheckCircle2, Clock, MessageSquare, RefreshCw } from 'lucide-react';
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

  const fetchMyHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await incidentsAPI.getAll();
      // Filters incidents by matching the logged-in user's ID
      // We check for both resident_id and residents_id to be safe
      const filtered = (response.data || []).filter(inc => 
        (inc.resident_id === user?.id || inc.residents_id === user?.id)
      );
      
      // Sort by newest first and take top 5
      const sorted = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setMyIncidents(sorted.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyHistory();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.incident_type || !formData.description) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        resident_id: user.id,
        incident_type: formData.incident_type,
        description: formData.description,
        status: 'PENDING' 
      };

      await incidentsAPI.create(payload);
      
      setAlert({ type: 'success', message: 'Report submitted successfully!' });
      setFormData({ incident_type: '', description: '' });
      fetchMyHistory(); 
    } catch (error) {
      console.error("Submission Error:", error.response?.data);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to submit report.' 
      });
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
        {/* LEFT: FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Incident Type</label>
              <select 
                value={formData.incident_type}
                onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 focus:ring-4 focus:ring-orange-500/5 transition outline-none"
              >
                <option value="">-- Select Type --</option>
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
                placeholder="Describe the incident, location, and individuals involved..."
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

        {/* RIGHT: TRACKING SIDEBAR */}
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
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking Your Reports</h3>
               <button onClick={fetchMyHistory} className="text-gray-400 hover:text-orange-500 transition">
                 <RefreshCw size={14} className={historyLoading ? 'animate-spin' : ''} />
               </button>
            </div>
            
            <div className="space-y-6">
              {historyLoading ? (
                <p className="text-xs text-gray-400 italic text-center py-4">Syncing with registry...</p>
              ) : myIncidents.length > 0 ? (
                myIncidents.map((inc) => (
                  <div key={inc.id} className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${inc.status?.toUpperCase() === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {inc.status?.toUpperCase() === 'RESOLVED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800">{inc.incident_type}</p>
                        <p className={`text-[10px] uppercase font-black tracking-tighter ${inc.status?.toUpperCase() === 'RESOLVED' ? 'text-emerald-600' : 'text-orange-500'}`}>
                          {inc.status} • {new Date(inc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {inc.remarks && (
                      <div className="ml-11 p-3 bg-gray-50 rounded-2xl border border-gray-100 relative">
                        <div className="absolute -left-2 top-3 w-4 h-4 bg-gray-50 border-l border-t border-gray-100 rotate-45"></div>
                        <div className="flex items-start gap-2">
                          <MessageSquare size={12} className="text-orange-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Official Response:</p>
                            <p className="text-[10px] text-gray-600 font-medium leading-relaxed italic">"{inc.remarks}"</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Safe & Clear</p>
                  <p className="text-[10px] text-gray-400 mt-1">No community reports filed yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentIncidents;