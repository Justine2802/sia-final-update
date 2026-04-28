import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, FileText, CheckCircle2, Clock, 
  MoreVertical, CreditCard, TrendingUp, DollarSign, Wallet 
} from 'lucide-react';
import { certificatesAPI } from '@/services/api';
import Loading from '@/components/Loading';
import NewCertificateModal from './NewCertificateModal';

const Certificates = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch live certificates from database
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await certificatesAPI.getAll();
      setRequests(response.data || []);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // 2. Dynamic Revenue Calculation
  const calculateDailyCollection = () => {
    const today = new Date().toLocaleDateString();
    return requests
      .filter(req => 
        new Date(req.created_at).toLocaleDateString() === today && 
        (req.status === 'Issued' || req.status === 'Ready for Pickup')
      )
      .reduce((sum, req) => sum + parseFloat(req.amount || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Certificate Requests</h1>
          <p className="text-gray-500 font-medium">Manage document issuance and payment automation.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-black text-[11px] uppercase tracking-widest"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE: TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search requests..." 
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-blue-500/10 font-bold" 
                    />
                </div>
                <div className="flex gap-2">
                   <button className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-tighter hover:bg-blue-100 transition">
                      Automation On
                   </button>
                </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Document</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests
                  .filter(req => 
                    req.certificate_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (req.resident?.first_name + ' ' + req.resident?.last_name).toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${req.status === 'Issued' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            <FileText size={18} />
                        </div>
                        <div>
                           <div className="font-black text-gray-700 text-sm">{req.certificate_type}</div>
                           <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                             {req.resident ? `${req.resident.first_name} ${req.resident.last_name}` : `ID: ${req.resident_id}`}
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-800">{formatCurrency(req.amount || 0)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase ${
                        req.status === 'Issued' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        req.status === 'Requested' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {req.status === 'Requested' ? (
                          <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-100" title="Process Payment">
                             <CreditCard size={16} />
                          </button>
                        ) : (
                          <button className="p-2 text-gray-300 hover:text-blue-600 transition">
                             <MoreVertical size={18} />
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="p-12 text-center text-gray-400 font-bold italic">No requests found.</div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: PAYMENT INSIGHTS */}
        <div className="space-y-6">
           <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-white/10 rounded-2xl">
                    <DollarSign size={24} />
                 </div>
                 <span className="flex items-center gap-1 text-[10px] font-black bg-white/20 px-2 py-1 rounded-lg uppercase">
                    <TrendingUp size={12} /> Live
                 </span>
              </div>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Collection Today</p>
              <h2 className="text-3xl font-black tracking-tight">{formatCurrency(calculateDailyCollection())}</h2>
           </div>

           <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Automated Methods</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[20px] border border-gray-100">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600"><Wallet size={16} /></div>
                       <span className="text-xs font-black text-gray-700 tracking-tight">GCash Link</span>
                    </div>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                       <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[20px] border border-gray-100">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white rounded-xl shadow-sm text-gray-400"><CreditCard size={16} /></div>
                       <span className="text-xs font-black text-gray-700 tracking-tight">Stripe API</span>
                    </div>
                    <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                       <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                 </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-6 font-medium leading-relaxed italic">
                Real-time collection monitoring active for all barangay documents.
              </p>
           </div>
        </div>
      </div>

      <NewCertificateModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchCertificates();
        }} 
      />
    </div>
  );
};

export default Certificates;