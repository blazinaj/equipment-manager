export interface Equipment {
  id: string;
  name: string;
  type: string;
  year: number;
  image: string;
  status: 'Good' | 'Fair' | 'Poor';
  purchaseDate: string;
  purchasePrice: number;
  vinNumber?: string;
  licensePlate?: string;
  nextMaintenanceDate?: string;
  maintenanceCount: number;
  totalCost: number;
  notes?: string;
}