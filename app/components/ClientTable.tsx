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
  // Simple sorting function
  const sortedData = [...clients].sort((a, b) => {
    // Loop through each sort criterion in order
    for (const criterion of sortCriteria) {
      // Get values to compare
      const aValue = a[criterion.field];
      const bValue = b[criterion.field];
      
      // Skip if values are equal (move to next criterion)
      if (aValue === bValue) continue;
      
      // Determine sort direction (1 for ascending, -1 for descending)
      const direction = criterion.direction === 'asc' ? 1 : -1;
      
      // Compare values based on their type
      if (aValue instanceof Date && bValue instanceof Date) {
        // For dates, compare timestamps
        return (aValue.getTime() - bValue.getTime()) * direction;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        // For strings, use localeCompare
        return aValue.localeCompare(bValue) * direction;
      } else {
        // For other types (numbers, enums), use simple comparison
        return (aValue > bValue ? 1 : -1) * direction;
      }
    }
    
    // If all criteria are equal, maintain original order
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