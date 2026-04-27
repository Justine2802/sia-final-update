import React, { useState } from 'react';
import { 
  Search, Plus, FileText, CheckCircle2, Clock, 
  MoreVertical, CreditCard, TrendingUp, DollarSign, Wallet 
} from 'lucide-react';
import NewCertificateModal from './NewCertificateModal';

const Certificates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const requests = [
    { id: 'CERT-001', resident: 'Ivan Dequiros', type: 'Barangay Clearance', amount: '₱100.00', date: '4/28/2026', status: 'PENDING', payment: 'UNPAID' },
    { id: 'CERT-002', resident: 'Recy Dequiros', type: 'Indigency', amount: '₱25.00', date: '4/27/2026', status: 'COMPLETED', payment: 'PAID' },
  ];

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
        {/* LEFT SIDE: TABLE (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Search requests..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-blue-500/10" />
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
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${req.payment === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            <FileText size={18} />
                        </div>
                        <div>
                           <div className="font-black text-gray-700 text-sm">{req.type}</div>
                           <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{req.resident}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-800">{req.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${req.payment === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {req.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {req.payment === 'UNPAID' ? (
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
          </div>
        </div>

        {/* RIGHT SIDE: PAYMENT INSIGHTS (Takes 1 column) */}
        <div className="space-y-6">
           {/* Total Revenue Card */}
           <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-white/10 rounded-2xl">
                    <DollarSign size={24} />
                 </div>
                 <span className="flex items-center gap-1 text-[10px] font-black bg-white/20 px-2 py-1 rounded-lg uppercase">
                    <TrendingUp size={12} /> +24%
                 </span>
              </div>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Collection Today</p>
              <h2 className="text-3xl font-black tracking-tight">₱1,450.00</h2>
           </div>

           {/* Quick Settings / Methods */}
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
                Payment status updates automatically upon resident transaction.
              </p>
           </div>
        </div>
      </div>

      <NewCertificateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Certificates;