import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

function Alert({ type = 'info', message, onClose }) {
  const typeConfig = {
    success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    error: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    warning: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
    info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 mb-4 flex items-center justify-between ${config.text}`}>
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="hover:opacity-70 transition-opacity"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export default Alert;
