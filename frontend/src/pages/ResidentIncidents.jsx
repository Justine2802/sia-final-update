import React from 'react';
import { Send, Phone, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

const ResidentIncidents = () => {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE: THE FORM (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">What happened?</label>
              <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] font-bold text-gray-700 focus:ring-4 focus:ring-orange-500/5 transition appearance-none">
                <option>-- Select --</option>
                <option>Noise Complaint</option>
                <option>Security Threat</option>
                <option>Sanitation Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Provide Description</label>
              <textarea 
                rows="6"
                placeholder="Type your detailed report here..."
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[24px] font-medium text-gray-700 focus:ring-4 focus:ring-orange-500/5 transition resize-none"
              ></textarea>
            </div>

            <button className="w-full py-5 bg-[#eb5e28] hover:bg-[#d44d1d] text-white rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-200 transition-all mt-4">
              <Send size={20} />
              Submit Report
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: SIDEBAR (Takes up 1 column) */}
        <div className="space-y-6">
          {/* Emergency Contacts */}
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

          {/* Mini History View */}
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Recent Reports</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Noise Complaint</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Apr 27 • PENDING</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Streetlight Issue</p>
                  <p className="text-[10px] text-emerald-600 uppercase font-black tracking-tighter">Apr 25 • RESOLVED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentIncidents;