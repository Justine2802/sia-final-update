import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar, MapPin } from 'lucide-react';

const AddResidentModal = ({ isOpen, onClose, resident }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    status: 'PENDING',
    address: ''
  });

  // 1. Sync form data when the modal opens or a resident is selected for editing
  useEffect(() => {
    if (resident) {
      setFormData({
        name: resident.name || '',
        birthDate: resident.birthDate || '',
        status: resident.status || 'PENDING',
        address: resident.address || ''
      });
    } else {
      setFormData({ name: '', birthDate: '', status: 'PENDING', address: '' });
    }
  }, [resident, isOpen]);

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate database recording (CRUD)
    setTimeout(() => {
      console.log("Saving Resident Data:", formData);
      setSubmitting(false);
      onClose(); // Close modal after saving
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Dynamically updates based on mode */}
        <div className="p-8 bg-gray-900 flex items-center justify-between">
          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3">
            <UserPlus size={20} className="text-blue-400" /> 
            {resident ? 'Update Resident Record' : 'Register New Resident'}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="p-10 space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Juan Dela Cruz" 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold focus:ring-4 focus:ring-blue-500/5 transition outline-none" 
                  required
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Birth Date</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="date" 
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" 
                    required
                  />
                </div>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Initial Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 outline-none appearance-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="VERIFIED">VERIFIED</option>
                </select>
              </div>
            </div>

            {/* Complete Address */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Complete Address</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, Phase, Block/Lot" 
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" 
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="flex-[1.5] py-4 bg-gray-900 text-white rounded-[20px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-gray-200 hover:bg-black transition disabled:opacity-50"
            >
              {submitting ? 'Processing...' : (resident ? 'Save Changes' : 'Add to Registry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResidentModal;