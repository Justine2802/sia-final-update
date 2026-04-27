import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  Clock, 
  Calendar, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

// UI Components
import ProcessIncidentModal from './ProcessIncidentModal';

const Incidents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Updated sample data with Location, Date Occurred, and Time Occurred
  const [incidents] = useState([
    { 
      id: 'INC-2026-001', 
      reporter: 'Ivan Dequiros', 
      type: 'Noise Complaint', 
      location: 'Blk 12, Lot 4, Pandan Street',
      date_occurred: '2026-04-27',
      time_occurred: '10:30 PM',
      date_filed: '4/27/2026', 
      status: 'PENDING' 
    },
    { 
      id: 'INC-2026-002', 
      reporter: 'Recy Dequiros', 
      type: 'Streetlight Issue', 
      location: 'San Roque Hall Entrance',
      date_occurred: '2026-04-26',
      time_occurred: '07:15 PM',
      date_filed: '4/27/2026', 
      status: 'DISMISSED' 
    },
  ]);

  const handleProcess = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Incident Reports</h1>
          <p className="text-gray-500 font-medium">Monitor and manage community safety concerns.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 transition shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Reports</div>
          <div className="text-2xl font-black text-gray-800">24</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Pending</div>
          <div className="text-2xl font-black text-orange-600">08</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Resolved</div>
          <div className="text-2xl font-black text-emerald-600">16</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by reporter or type..." 
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Incident & Location</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Occurrence Info</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Reporter</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-gray-50/50 transition group">
                {/* Type & Location */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <div className="font-black text-gray-800 text-sm">{inc.type}</div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <MapPin size={12} className="text-orange-400" />
                        {inc.location}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Occurrence Info (Date & Time) */}
                <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                            <Calendar size={14} className="text-gray-300" />
                            {inc.date_occurred}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                            <Clock size={14} className="text-gray-300" />
                            {inc.time_occurred}
                        </div>
                    </div>
                </td>

                {/* Reporter Info */}
                <td className="px-6 py-4">
                    <div className="font-bold text-gray-700 text-sm">{inc.reporter}</div>
                    <div className="text-[10px] text-gray-400 italic">Filed: {inc.date_filed}</div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${
                    inc.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {inc.status}
                  </span>
                </td>

                {/* Action Button */}
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleProcess(inc)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-orange-600 hover:text-white rounded-xl transition duration-200 text-[11px] font-black uppercase tracking-wider"
                  >
                    <AlertCircle size={14} /> Process
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* The Modal */}
      <ProcessIncidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        incident={selectedIncident}
      />
    </div>
  );
};

export default Incidents;