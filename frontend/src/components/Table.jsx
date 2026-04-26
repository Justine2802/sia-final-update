import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

function Table({ columns, data, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="text-center py-20 font-medium text-gray-500 italic">Fetching records...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-20 text-gray-400">No records found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
              {columns.map((col) => (
                <td key={`${row.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all border border-transparent hover:border-blue-400"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-transparent hover:border-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

