import React, { useState, useEffect } from 'react';
import { X, Receipt, User, FileType } from 'lucide-react';

const NewCertificateModal = ({ isOpen, onClose }) => {
  const [certType, setCertType] = useState("");
  const [amount, setAmount] = useState(0);

  // PRICE MAPPING LOGIC
  const prices = {
    "Barangay Clearance": 100,
    "Certificate of Indigency": 25,
    "Certificate of Residency": 50,
    "Business Clearance": 250,
    "No Pending Case": 100,
    "Senior Citizen Certification": 100
  };

  // Automatically update amount when certType changes
  useEffect(() => {
    if (certType) {
      setAmount(prices[certType]);
    } else {
      setAmount(0);
    }
  }, [certType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-600">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt size={20} /> New Certificate Request
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Resident Selection (Static for now) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Resident</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 transition text-sm appearance-none">
                    <option>Ivan Dequiros</option>
                    <option>Recy Dequiros</option>
                </select>
            </div>
          </div>

          {/* Certificate Type Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Certificate Type</label>
            <div className="relative">
                <FileType className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 transition text-sm appearance-none"
                >
                    <option value="">-- Choose Certificate --</option>
                    <option value="Barangay Clearance">Barangay Clearance</option>
                    <option value="Certificate of Indigency">Certificate of Indigency</option>
                    <option value="Certificate of Residency">Certificate of Residency</option>
                    <option value="Business Clearance">Business Clearance</option>
                    <option value="No Pending Case">Certificate of No Pending Case</option>
                    <option value="Senior Citizen Certification">Senior Citizen Certification</option>
                </select>
            </div>
          </div>

          {/* AUTOMATIC AMOUNT FIELD */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Total Amount</span>
                <span className="text-2xl font-black text-blue-700">₱{amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-gray-400 hover:bg-gray-200 rounded-xl transition">
            Cancel
          </button>
          <button className="flex-1 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition">
            Create Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCertificateModal;