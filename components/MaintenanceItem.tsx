import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock } from 'lucide-react-native';
import { MaintenanceRecord } from '@/hooks/useMaintenance';

interface MaintenanceItemProps {
  item: MaintenanceRecord;
  onPress: () => void;
}

export function MaintenanceItem({ item, onPress }: MaintenanceItemProps) {
  const StatusIcon = () => {
    if (item.status === 'completed') {
      return <CheckCircle2 size={20} color="#10B981" />;
    } else if (item.status === 'overdue') {
      return <AlertCircle size={20} color="#EF4444" />;
    } else {
      return <Clock size={20} color="#F59E0B" />;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <StatusIcon />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.cost}>${item.cost.toLocaleString()}</Text>
          <Text style={styles.date}>
            {item.status === 'completed' 
              ? `Completed on ${new Date(item.completed_date!).toLocaleDateString()}` 
              : item.status === 'overdue' 
                ? `Overdue: ${new Date(item.due_date).toLocaleDateString()}` 
                : `Due: ${new Date(item.due_date).toLocaleDateString()}`}
          </Text>
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
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cost: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});