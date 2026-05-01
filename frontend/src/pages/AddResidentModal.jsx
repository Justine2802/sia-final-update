import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar, MapPin, Phone, Mail, FileText, Vote, Briefcase, User } from 'lucide-react';
import { residentsAPI } from '@/services/api';

const AddResidentModal = ({ isOpen, onClose, resident }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    birth_date: '',
    gender: 'Male',
    civil_status: 'Single',
    phone: '',
    email: '',
    address: '',
    purok: '',
    occupation: '',
    is_voter: '0',
    is_verified: '0'
  });

  useEffect(() => {
    if (resident) {
      setFormData({
        first_name: resident.first_name || '',
        middle_name: resident.middle_name || '',
        last_name: resident.last_name || '',
        birth_date: resident.birth_date || '',
        gender: resident.gender || 'Male',
        civil_status: resident.civil_status || 'Single',
        phone: resident.phone || '',
        email: resident.email || '',
        address: resident.address || '',
        purok: resident.purok || '',
        occupation: resident.occupation || '',
        is_voter: String(resident.is_voter === true || resident.is_voter == 1 ? '1' : '0'),
        is_verified: String(resident.is_verified === true || resident.is_verified == 1 ? '1' : '0')
      });
    } else {
      setFormData({ 
        first_name: '', middle_name: '', last_name: '', birth_date: '', 
        gender: 'Male', civil_status: 'Single', phone: '', email: '', 
        address: '', purok: '', occupation: '', is_voter: '0', is_verified: '0' 
      });
    }
    setError('');
  }, [resident, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Prepare data for Laravel (convert '1'/'0' to actual booleans)
    const payload = {
      ...formData,
      is_voter: formData.is_voter === '1',
      is_verified: formData.is_verified === '1',
    };

    try {
      if (resident?.id) {
        // Update existing resident
        await residentsAPI.update(resident.id, payload);
      } else {
        // Register new resident via Admin
        await residentsAPI.create({
            ...payload,
            password: 'password123', // Default password for admin-created accounts
            password_confirmation: 'password123'
        });
      }
      onClose(); 
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      // Capture specific validation errors from Laravel if available
      const backendMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message;
        
      setError(backendMessage || 'Failed to save resident record. Check data types.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl my-8 animate-in fade-in zoom-in duration-200">
        
        <div className="p-8 bg-gray-900 flex items-center justify-between rounded-t-[40px]">
          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3">
            <UserPlus size={20} className="text-blue-400" /> 
            {resident ? 'Update Resident Record' : 'Register New Resident'}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-10 mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-10 space-y-8 text-left max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* SECTION 1: Personal Information */}
            <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-6 flex items-center gap-2">
                    <User size={16} className="text-blue-500"/> Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">First Name</label>
                      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Middle Name</label>
                      <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Last Name</label>
                      <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Birth Date</label>
                      <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 outline-none appearance-none">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Civil Status</label>
                      <select name="civil_status" value={formData.civil_status} onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 outline-none appearance-none">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </select>
                  </div>
                </div>
            </div>

            {/* SECTION 2: Contact & Residency */}
            <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-6 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500"/> Contact & Residency
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Phone Number</label>
                      <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="09XX XXX XXXX"
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Email Address</label>
                      <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email for portal access"
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" />
                      </div>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Complete Address (Street, House No.)</label>
                          <input type="text" name="address" value={formData.address} onChange={handleChange} required
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Purok / Zone</label>
                          <select name="purok" value={formData.purok} onChange={handleChange} required
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 outline-none appearance-none">
                            <option value="">Select Purok...</option>
                            <option value="Purok 1">Purok 1</option>
                            <option value="Purok 2">Purok 2</option>
                            <option value="Purok 3">Purok 3</option>
                            <option value="Purok 4">Purok 4</option>
                            <option value="Purok 5">Purok 5</option>
                          </select>
                      </div>
                  </div>
                </div>
            </div>

            {/* SECTION 3: Demographics & System Flags */}
            <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b-2 border-gray-100 pb-2 mb-6 flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-500"/> Demographics & Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Occupation</label>
                      <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g. Vendor, Student"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" />
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center gap-1"><Vote size={12}/> Voter Status</label>
                      <select name="is_voter" value={formData.is_voter} onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 outline-none appearance-none">
                        <option value="1">Registered Voter</option>
                        <option value="0">Not Registered</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center gap-1"><FileText size={12}/> Record Status</label>
                      <select name="is_verified" value={formData.is_verified} onChange={handleChange}
                      className={`w-full px-6 py-4 border rounded-[20px] font-bold outline-none appearance-none ${formData.is_verified === '1' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                        <option value="0">Pending / Unverified</option>
                        <option value="1">Verified Citizen</option>
                      </select>
                  </div>
                </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 rounded-b-[40px]">
            <button type="button" onClick={onClose} 
              className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-[1.5] py-4 bg-gray-900 text-white rounded-[20px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-gray-200 hover:bg-black transition disabled:opacity-50">
              {submitting ? 'Processing...' : (resident ? 'Save Changes' : 'Register to Barangay')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResidentModal;