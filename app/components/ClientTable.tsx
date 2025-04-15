import { format } from 'date-fns';
import { Client, SortCriterion } from '../types/client';

interface ClientTableProps {
  clients: Client[];
  sortCriteria: SortCriterion[];
}

// Define table columns
const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Client Name' },
  { id: 'email', label: 'Email' },
  { id: 'type', label: 'Client Type' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
];

export default function ClientTable({ clients, sortCriteria }: ClientTableProps) {
  // Sort the clients based on the sort criteria
  const sortedData = [...clients].sort((a, b) => {
    for (const criterion of sortCriteria) {
      const aValue = a[criterion.field];
      const bValue = b[criterion.field];
      
      if (aValue === bValue) continue;
      
      const modifier = criterion.direction === 'asc' ? 1 : -1;
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return (aValue.getTime() - bValue.getTime()) * modifier;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      
      // For other types (like status enum)
      return (aValue > bValue ? 1 : -1) * modifier;
    }
    return 0;
  });

  // Format cell value based on field type
  const formatCellValue = (client: Client, field: keyof Client) => {
    const value = client[field];
    
    if (value instanceof Date) {
      return format(value, 'MMM d, yyyy');
    }
    
    if (field === 'id') {
        return (
          <span
            className='text-blue-500 uppercase'
          >
            {value}
          </span>
        );
      }

    if (field === 'status') {
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : value === 'inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value}
        </span>
      );
    }
    
    return value;
  };

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={`${client.id}-${column.id}`}
                  className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-sm"
                >
                  {formatCellValue(client, column.id as keyof Client)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 