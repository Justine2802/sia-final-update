import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, AlertTriangle, Ban, FileText } from 'lucide-react';

const ProcessIncidentModal = ({ isOpen, onClose, incident }) => {
  const [formData, setFormData] = useState({ status: '', remarks: '', date_reported: '' });

  useEffect(() => {
    if (incident) {
      setFormData({ 
        status: incident.status, 
        remarks: '', 
        date_reported: new Date().toISOString().split('T')[0] 
      });
    }
  }, [incident, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Orange Theme for Alerts */}
        <div className="p-8 bg-[#ea580c] flex items-center justify-between">
          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3">
            <div className="bg-white/20 p-1 rounded-full"><AlertTriangle size={18} /></div>
            Process Report: {incident?.id}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-10 space-y-6 text-left">
          {/* Status Selection */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Update Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 outline-none appearance-none cursor-pointer"
            >
              <option value="PENDING">PENDING INVESTIGATION</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="DISMISSED">DISMISSED / INVALID</option>
            </select>
          </div>

          {/* Date Reported */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Date Processed</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="date" value={formData.date_reported} className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" readOnly />
            </div>
          </div>

          {/* Admin Remarks */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Internal Remarks</label>
            <textarea 
              rows="3"
              placeholder="Add investigation notes here..."
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[24px] font-medium text-gray-700 outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-[12px] font-black text-gray-400 uppercase tracking-widest">Cancel</button>
          <button className="flex-[1.5] py-4 bg-[#ea580c] text-white rounded-[20px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-orange-100 hover:bg-[#c2410c] transition">
            Update Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessIncidentModal;