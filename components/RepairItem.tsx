import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock, PenTool as Tool } from 'lucide-react-native';
import { Repair } from '@/hooks/useRepairs';

interface RepairItemProps {
  item: Repair;
  onPress: () => void;
}

export function RepairItem({ item, onPress }: RepairItemProps) {
  const StatusIcon = () => {
    switch (item.status) {
      case 'Completed':
        return <CheckCircle2 size={20} color="#10B981" />;
      case 'In Progress':
        return <Clock size={20} color="#F59E0B" />;
      case 'Cancelled':
        return <AlertCircle size={20} color="#EF4444" />;
      default:
        return <Tool size={20} color="#64748B" />;
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'Completed':
        return '#DCFCE7';
      case 'In Progress':
        return '#FEF9C3';
      case 'Cancelled':
        return '#FEE2E2';
      default:
        return '#F1F5F9';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <StatusIcon />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.footer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.cost}>${item.cost.toLocaleString()}</Text>
            <Text style={styles.date}>
              {item.status === 'Completed' 
                ? `Completed ${new Date(item.completed_date!).toLocaleDateString()}`
                : new Date(item.repair_date).toLocaleDateString()}
            </Text>
          </View>
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
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  details: {
    alignItems: 'flex-end',
  },
  cost: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});