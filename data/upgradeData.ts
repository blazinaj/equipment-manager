import { Upgrade } from '@/types/upgrade';

export const upgradeData: Upgrade[] = [
  {
    id: '1',
    equipmentId: '1',
    name: 'Tonneau Cover',
    description: 'BAK Revolver X4 Hard Rolling Truck Bed Cover',
    installDate: 'Apr 15, 2023',
    cost: 1200,
    installer: 'AutoCustoms',
    category: 'Utility',
    status: 'Installed',
    notes: 'Improved fuel efficiency and cargo protection'
  },
  {
    id: '2',
    equipmentId: '1',
    name: 'LED Light Bar',
    description: '32" Curved LED Light Bar with Spot/Flood Combo',
    installDate: 'May 20, 2023',
    cost: 450,
    installer: 'DIY',
    category: 'Safety',
    status: 'Installed',
    notes: 'Improved visibility for off-road use'
  },
  {
    id: '3',
    equipmentId: '2',
    name: 'Pro Circuit Exhaust',
    description: 'T-6 Pro Circuit Complete Exhaust System',
    installDate: 'Jun 5, 2023',
    cost: 899,
    installer: 'MotoTech',
    category: 'Performance',
    status: 'Installed',
    notes: 'Increased power and improved sound'
  },
  {
    id: '4',
    equipmentId: '5',
    name: 'Ceramic Coating',
    description: 'Professional ceramic coating application',
    installDate: 'Apr 20, 2023',
    cost: 650,
    installer: 'DetailPro',
    category: 'Appearance',
    status: 'Installed',
    notes: 'Long-term paint protection and easier cleaning'
  }
];