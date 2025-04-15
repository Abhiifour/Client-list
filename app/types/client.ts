export interface Client {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'company';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface SortCriterion {
  id: string;
  field: keyof Client;
  direction: 'asc' | 'desc';
} 