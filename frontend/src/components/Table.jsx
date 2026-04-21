import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

function Table({ columns, data, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={`${row.id}-${col.key}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
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
