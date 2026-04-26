import React from 'react';
import { Loader } from 'lucide-react';

function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader size={32} className="animate-spin text-blue-500 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export default Loading;