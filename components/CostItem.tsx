import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wrench, Settings, Fuel, Car, Ban } from 'lucide-react-native';
import { Cost } from '@/types/cost';

interface CostItemProps {
  item: Cost;
  onPress: () => void;
}

export function CostItem({ item, onPress }: CostItemProps) {
  const getCategoryIcon = () => {
    switch (item.category) {
      case 'maintenance':
        return <Wrench size={20} color="#0D9488" />;
      case 'repair':
        return <Settings size={20} color="#F59E0B" />;
      case 'upgrade':
        return <Car size={20} color="#6366F1" />;
      case 'fuel':
        return <Fuel size={20} color="#EC4899" />;
      default:
        return <Ban size={20} color="#64748B" />;
    }
  };

  const getCategoryName = () => {
    switch (item.category) {
      case 'maintenance':
        return 'Maintenance';
      case 'repair':
        return 'Repair';
      case 'upgrade':
        return 'Upgrade';
      case 'fuel':
        return 'Fuel';
      default:
        return 'Other';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        {getCategoryIcon()}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.description}</Text>
          <Text style={styles.amount}>${item.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.details}>
            <Text style={styles.equipment}>{item.equipmentName}</Text>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{getCategoryName()}</Text>
            </View>
          </View>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginRight: 8,
  },
  category: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});