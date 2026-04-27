import React from 'react';
import { X, Clock } from 'lucide-react';

const ResidentHistoryModal = ({ isOpen, onClose, resident, activities }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Activity History</h3>
            <p className="text-sm text-gray-500">Records for {resident?.name || 'Resident'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activities && activities.length > 0 ? (
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200">
                      <Clock size={16} />
                    </div>
                    {index !== activities.length - 1 && <div className="w-px h-full bg-gray-200 my-2"></div>}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800">{activity.type}</h4>
                      <span className="text-xs text-gray-400 font-mono">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <span className="mt-2 inline-block text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 italic">No activity found.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentHistoryModal;