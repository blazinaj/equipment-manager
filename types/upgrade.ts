export interface Upgrade {
  id: string;
  equipmentId: string;
  name: string;
  description: string;
  installDate: string;
  cost: number;
  installer: string;
  category: 'Performance' | 'Appearance' | 'Utility' | 'Safety' | 'Other';
  status: 'Installed' | 'Planned' | 'Removed';
  notes?: string;
}