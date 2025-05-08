export interface Cost {
  id: string;
  equipmentId: string;
  equipmentName: string;
  category: 'maintenance' | 'repair' | 'upgrade' | 'fuel' | 'other';
  amount: number;
  date: string;
  description: string;
  receiptImage?: string;
  notes?: string;
}