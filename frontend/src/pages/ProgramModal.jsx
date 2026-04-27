import React, { useState, useEffect } from 'react';
import { X, LayoutGrid, DollarSign, Calendar } from 'lucide-react';

const ProgramModal = ({ isOpen, onClose, program }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    implementation_date: ''
  });

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        description: program.description,
        budget: program.budget.replace('₱', ''),
        implementation_date: program.implementation_date || ''
      });
    } else {
      setFormData({ name: '', description: '', budget: '', implementation_date: '' });
    }
  }, [program, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Program:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 bg-emerald-600 flex items-center justify-between text-white">
          <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-3">
            <LayoutGrid size={20} /> {program ? 'Update Program' : 'New Program'}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 text-left">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Program Name</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text" 
              placeholder="e.g. Rice Distribution" 
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold focus:ring-4 focus:ring-emerald-500/5 transition outline-none" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Budget Allocation</label>
            <div className="relative">
              <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                type="number" 
                placeholder="500.00" 
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Implementation Date</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                name="implementation_date"
                value={formData.implementation_date}
                onChange={handleChange}
                type="date" 
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold outline-none" 
              />
            </div>
          </div>

          <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 -mx-10 -mb-10 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Cancel</button>
            <button type="submit" className="flex-[1.5] py-4 bg-emerald-600 text-white rounded-[20px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition">
              {program ? 'Save Changes' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramModal;