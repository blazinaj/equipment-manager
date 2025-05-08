import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CalendarClock, Wrench } from 'lucide-react-native';
import { Equipment } from '@/types/equipment';

interface EquipmentCardProps {
  equipment: Equipment;
  onPress: () => void;
}

export function EquipmentCard({ equipment, onPress }: EquipmentCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: equipment.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{equipment.name}</Text>
          <View style={[styles.statusBadge, equipment.status === 'Good' 
            ? styles.statusGood 
            : equipment.status === 'Fair' 
              ? styles.statusFair 
              : styles.statusPoor]}>
            <Text style={styles.statusText}>{equipment.status}</Text>
          </View>
        </View>
        
        <Text style={styles.subtitle} numberOfLines={1}>{equipment.type} • {equipment.year}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <CalendarClock size={14} color="#64748B" />
            <Text style={styles.infoText}>
              {equipment.nextMaintenanceDate ? equipment.nextMaintenanceDate : 'No scheduled maintenance'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Wrench size={14} color="#64748B" />
            <Text style={styles.infoText}>{equipment.maintenanceCount} records</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '46%',
    marginHorizontal: '2%',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  content: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginRight: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusGood: {
    backgroundColor: '#DCFCE7',
  },
  statusFair: {
    backgroundColor: '#FEF9C3',
  },
  statusPoor: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  infoRow: {
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
});