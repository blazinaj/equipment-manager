import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CalendarClock, Wrench, Car, Bike, Scissors, Truck, Bot as Boat, Tent, PenTool as Tool } from 'lucide-react-native';
import { Equipment } from '@/hooks/useEquipment';

interface EquipmentListItemProps {
  equipment: Equipment;
  onPress: () => void;
}

const getEquipmentIcon = (type: string) => {
  switch (type) {
    case 'Vehicle':
      return <Car size={24} color="#64748B" />;
    case 'Motorcycle':
      return <Bike size={24} color="#64748B" />;
    case 'Lawn & Garden':
      return <Scissors size={24} color="#64748B" />;
    case 'Construction':
      return <Truck size={24} color="#64748B" />;
    case 'Watercraft':
      return <Boat size={24} color="#64748B" />;
    case 'Recreational':
      return <Tent size={24} color="#64748B" />;
    default:
      return <Tool size={24} color="#64748B" />;
  }
};

export function EquipmentListItem({ equipment, onPress }: EquipmentListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {equipment.image_url ? (
          <Image
            source={{ uri: equipment.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.iconContainer}>
            {getEquipmentIcon(equipment.type)}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1}>{equipment.name}</Text>
            <Text style={styles.subtitle}>{equipment.type} • {equipment.year}</Text>
          </View>
          <View style={[styles.statusBadge, equipment.status === 'Good' 
            ? styles.statusGood 
            : equipment.status === 'Fair' 
              ? styles.statusFair 
              : styles.statusPoor]}>
            <Text style={styles.statusText}>{equipment.status}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <CalendarClock size={14} color="#64748B" />
            <Text style={styles.infoText}>
              {new Date(equipment.purchase_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Wrench size={14} color="#64748B" />
            <Text style={styles.infoText}>${equipment.purchase_price.toLocaleString()}</Text>
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
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
});