import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Upgrade } from '@/types/upgrade';
import { Wrench } from 'lucide-react-native';

interface UpgradeCardProps {
  upgrade: Upgrade;
  onPress: () => void;
}

export function UpgradeCard({ upgrade, onPress }: UpgradeCardProps) {
  const getCategoryColor = () => {
    switch (upgrade.category) {
      case 'Performance':
        return '#6366F1';
      case 'Appearance':
        return '#EC4899';
      case 'Utility':
        return '#0D9488';
      case 'Safety':
        return '#F59E0B';
      default:
        return '#64748B';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{upgrade.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
            <Text style={styles.categoryText}>{upgrade.category}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {upgrade.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.info}>
            <Wrench size={14} color="#64748B" />
            <Text style={styles.installer}>{upgrade.installer}</Text>
          </View>
          <Text style={styles.cost}>${upgrade.cost.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
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
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  installer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 6,
  },
  cost: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
});