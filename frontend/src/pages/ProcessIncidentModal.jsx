import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';
import { incidentsAPI } from '@/services/api';

const ProcessIncidentModal = ({ isOpen, onClose, incident }) => {
  const [formData, setFormData] = useState({ status: '', remarks: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (incident) {
      setFormData({ 
        // Ensure status is always uppercase to match backend 'in:PENDING,RESOLVED,DISMISSED' rules
        status: incident.status?.toUpperCase() || 'PENDING', 
        remarks: incident.remarks || '' 
      });
    }
  }, [incident, isOpen]);

  const handleUpdate = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      // Calls PUT /incidents/{id}
      const response = await incidentsAPI.update(incident.id, {
        status: formData.status,
        remarks: formData.remarks
      });

      if (response.status === 200 || response.status === 204) {
        alert("Report updated successfully!");
        onClose(); // This triggers fetchIncidents() in the parent
      }
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      alert(error.response?.data?.message || "Failed to update database.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <form onSubmit={handleUpdate} className="p-10 space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-3 text-orange-600">
              <AlertTriangle size={20} /> Process Report #{incident?.id}
            </h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
              Update Status
            </label>
            <div className="relative">
              <select 
                name="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 outline-none cursor-pointer focus:ring-4 focus:ring-orange-500/5 appearance-none"
              >
                <option value="PENDING">PENDING INVESTIGATION</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="DISMISSED">DISMISSED / INVALID</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Remarks Field */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">
              Internal Remarks
            </label>
            <textarea 
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Investigation notes..."
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[24px] font-medium text-gray-700 outline-none resize-none min-h-[120px] focus:ring-4 focus:ring-orange-500/5 transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-gray-400 uppercase text-[11px] hover:bg-gray-50 rounded-2xl transition-all">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[1.5] py-4 bg-orange-600 text-white rounded-[20px] font-black uppercase text-[11px] hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessIncidentModal;