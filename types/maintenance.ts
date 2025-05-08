export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  title: string;
  description: string;
  status: 'upcoming' | 'overdue' | 'completed';
  dueDate: string;
  completedDate?: string;
  cost: number;
  odometerReading?: number;
  serviceProvider?: string;
  notes?: string;
}