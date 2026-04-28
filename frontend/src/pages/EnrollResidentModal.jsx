import React, { useState, useEffect } from 'react';
import { X, UserCheck, Calendar, BookOpen } from 'lucide-react';
import { residentsAPI, programsAPI, programResidentsAPI } from '@/services/api';

const EnrollResidentModal = ({ isOpen, onClose }) => {
  const [residents, setResidents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    resident_id: '',
    program_id: '',
    date_applied: new Date().toISOString().split('T')[0],
    status: 'Approved', // Admins enrolling someone directly skips the "Applied" phase
    remarks: ''
  });

  // Fetch real data for the dropdowns when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchDropdownData = async () => {
        setLoading(true);
        try {
          const [resData, progData] = await Promise.all([
            residentsAPI.getAll(),
            programsAPI.getAll()
          ]);
          setResidents(resData.data || []);
          setPrograms(progData.data || []);
        } catch (error) {
          console.error("Failed to fetch data for modal:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDropdownData();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.resident_id || !formData.program_id) {
      alert("Please select both a resident and a program.");
      return;
    }

    setSubmitting(true);
    try {
      await programResidentsAPI.create({
        resident_id: formData.resident_id,
        program_id: formData.program_id,
        date_applied: formData.date_applied,
        status: formData.status,
        remarks: formData.remarks || 'Admin direct enrollment'
      });
      onClose(); // Parent component (Enrollments.jsx) will handle the refresh
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to enroll resident.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-600">
          <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest text-[13px]">
            <UserCheck size={20} /> New Program Enrollment
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Select Resident */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Resident</label>
            <select 
              value={formData.resident_id}
              onChange={(e) => setFormData({...formData, resident_id: e.target.value})}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition text-sm font-medium outline-none"
            >
                <option value="">{loading ? 'Loading...' : '-- Select a resident --'}</option>
                {residents.map(res => (
                  <option key={res.id} value={res.id}>
                    {res.first_name} {res.last_name} (ID: {res.id})
                  </option>
                ))}
            </select>
          </div>

          {/* Select Program */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assigned Program</label>
            <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <select 
                  value={formData.program_id}
                  onChange={(e) => setFormData({...formData, program_id: e.target.value})}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition text-sm font-medium outline-none"
                >
                    <option value="">{loading ? 'Loading...' : '-- Select a program --'}</option>
                    {programs.map(prog => (
                      <option key={prog.id} value={prog.id}>
                        {prog.program_name}
                      </option>
                    ))}
                </select>
            </div>
          </div>

          {/* APPLICATION DATE */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Application Date</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                    type="date" 
                    value={formData.date_applied}
                    onChange={(e) => setFormData({...formData, date_applied: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition text-sm font-medium outline-none"
                />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex gap-2">
          <button 
            onClick={onClose} 
            disabled={submitting}
            className="flex-1 py-3 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-200 rounded-xl transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="flex-1 py-3 text-[11px] font-black bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition uppercase tracking-widest disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Confirm Enrollment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollResidentModal;