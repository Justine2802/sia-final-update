import React, { useState } from 'react';
import { BookOpen, Send, Calendar, X, CheckCircle2 } from 'lucide-react';

function ResidentPrograms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const programs = [
    { id: 1, name: 'Rice Distribution', description: 'Monthly rice subsidy for qualified residents.' },
    { id: 2, name: 'TUPAD', description: 'Emergency employment program for displaced workers.' },
    { id: 3, name: 'Senior Citizen Pension', description: 'Financial assistance for elderly residents aged 60 and above.' }
  ];

  const handleApplyClick = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleSubmitApplication = () => {
    setSubmitting(true);
    
    // Logic for database recording goes here later
    // For now, we simulate a successful save
    setTimeout(() => {
      setSubmitting(false);
      setIsModalOpen(false);
      alert(`Application for ${selectedProgram.name} submitted successfully!`);
    }, 1000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Available Programs</h1>
        <p className="text-gray-500 font-medium">Select a social assistance program to begin your application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <BookOpen size={24} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">Available</span>
            </div>
            
            <h3 className="text-xl font-black text-gray-800 mb-2 tracking-tight">{prog.name}</h3>
            <p className="text-gray-500 text-sm mb-8 flex-1 leading-relaxed font-medium">{prog.description}</p>

            {/* RENAMED BUTTON: APPLY NOW */}
            <button
              onClick={() => handleApplyClick(prog)}
              className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-gray-200 uppercase text-[11px] tracking-widest"
            >
              <Send size={16} />
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* ENROLLMENT MODAL (Similar to Admin Portal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-emerald-600 flex items-center justify-between">
              <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <CheckCircle2 size={18} /> Confirm Application
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Selected Program</p>
                <p className="text-lg font-black text-gray-800 tracking-tight">{selectedProgram?.name}</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Application Date</label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition text-sm font-bold text-gray-700"
                    />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                  By submitting, your profile details will be sent to the Barangay Admin for verification.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-200 rounded-2xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="flex-1 py-4 text-[11px] font-black bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition uppercase tracking-widest disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentPrograms;