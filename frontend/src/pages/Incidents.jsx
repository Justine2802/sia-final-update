import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Clock, Calendar, MapPin, AlertCircle, Trash2 } from 'lucide-react';
import ProcessIncidentModal from './ProcessIncidentModal';

const Incidents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [incidents, setIncidents] = useState([
    { id: 'INC-2026-001', reporter: 'Ivan Dequiros', type: 'Noise Complaint', location: 'Pandan Angeles', date_occurred: '2026-04-27', time_occurred: '10:30 PM', status: 'PENDING' },
    { id: 'INC-2026-002', reporter: 'Recy Dequiros', type: 'Streetlight Issue', location: 'San Roque Hall', date_occurred: '2026-04-26', time_occurred: '07:15 PM', status: 'DISMISSED' },
  ]);

  // READ & UPDATE (Processing)
  const handleProcess = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (window.confirm("Permanent delete this incident report?")) {
      setIncidents(incidents.filter(inc => inc.id !== id));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Incident Reports</h1>
          <p className="text-gray-500 font-medium">Monitor and manage community safety concerns.</p>
        </div>
      </div>

      {/* Stats Quick View (Read functionality) */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Reports</p>
          <p className="text-2xl font-black text-gray-800">{incidents.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-2xl font-black text-orange-600">{incidents.filter(i => i.status === 'PENDING').length}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Incident & Location</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reporter</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                  <div className="font-black text-gray-800 text-sm tracking-tight">{inc.type}</div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-orange-400" /> {inc.location}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-600">{inc.reporter}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${
                    inc.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {inc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleProcess(inc)}
                    className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-orange-600 hover:text-white rounded-xl transition font-black text-[11px] uppercase tracking-widest inline-flex items-center gap-2"
                  >
                    <Clock size={14} /> Process
                  </button>
                  <button 
                    onClick={() => handleDelete(inc.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProcessIncidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        incident={selectedIncident}
      />
    </div>
  );
};

export default Incidents;