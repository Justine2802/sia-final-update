import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, Clock, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { incidentsAPI } from '@/services/api';
import Loading from '@/components/Loading';
import ProcessIncidentModal from './ProcessIncidentModal';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const response = await incidentsAPI.getAll();
      setIncidents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // FIXED: Case-insensitive stats calculation
  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.status?.toUpperCase() === 'PENDING').length,
    resolved: incidents.filter(i => i.status?.toUpperCase() === 'RESOLVED').length,
  };

  const handleProcess = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Incident Reports</h1>
          <p className="text-gray-500 font-medium">Monitor and manage community safety concerns.</p>
        </div>
        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 transition shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Dynamic Stats Quick View */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Reports</div>
          <div className="text-2xl font-black text-gray-800">{stats.total}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Pending</div>
          <div className="text-2xl font-black text-orange-600">{String(stats.pending).padStart(2, '0')}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Resolved</div>
          <div className="text-2xl font-black text-emerald-600">{String(stats.resolved).padStart(2, '0')}</div>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by reporter or type..." 
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition shadow-sm font-bold text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Incident Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Occurrence Info</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Reporter</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {incidents
              .filter(i => 
                i.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (`${i.resident?.first_name} ${i.resident?.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((inc) => (
              <tr key={inc.id} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <div className="font-black text-gray-800 text-sm">{inc.incident_type}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[180px]">{inc.description.substring(0, 30)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-bold text-gray-700">{new Date(inc.created_at).toLocaleDateString()}</div>
                  <div className="text-[11px] text-gray-400">{new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-700 text-sm">{inc.resident ? `${inc.resident.first_name} ${inc.resident.last_name}` : 'Unknown'}</div>
                  <div className="text-[10px] text-gray-400">ID: #{inc.resident_id}</div>
                </td>
                <td className="px-6 py-4">
                  {/* Case-insensitive badge logic */}
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase ${
                    inc.status?.toUpperCase() === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                    inc.status?.toUpperCase() === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    inc.status?.toUpperCase() === 'DISMISSED' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {inc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleProcess(inc)} className="p-2 bg-gray-50 hover:bg-orange-600 hover:text-white rounded-xl transition-all">
                    <AlertCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProcessIncidentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchIncidents(); // CRITICAL: Updates UI with database changes
        }} 
        incident={selectedIncident}
      />
    </div>
  );
};

export default Incidents;