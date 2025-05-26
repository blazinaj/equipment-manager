import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Upgrade } from '@/hooks/useUpgrades';
import { Wrench, Gauge, Palette, Shield, PenTool as Tool, CircleCheck, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';

interface UpgradeCardProps {
  upgrade: Upgrade;
  onPress: () => void;
}

export function UpgradeCard({ upgrade, onPress }: UpgradeCardProps) {
  const getCategoryIcon = () => {
    switch (upgrade.category) {
      case 'Performance':
        return <Gauge size={20} color="#6366F1" />;
      case 'Appearance':
        return <Palette size={20} color="#EC4899" />;
      case 'Utility':
        return <Tool size={20} color="#0D9488" />;
      case 'Safety':
        return <Shield size={20} color="#F59E0B" />;
      default:
        return <Wrench size={20} color="#64748B" />;
    }
  };

  const getStatusIcon = () => {
    switch (upgrade.status) {
      case 'Installed':
        return <CircleCheck size={20} color="#10B981" />;
      case 'Planned':
        return <Clock size={20} color="#F59E0B" />;
      case 'Removed':
        return <AlertCircle size={20} color="#EF4444" />;
    }
  };

  const getStatusColor = () => {
    switch (upgrade.status) {
      case 'Installed':
        return '#DCFCE7';
      case 'Planned':
        return '#FEF9C3';
      case 'Removed':
        return '#FEE2E2';
    }
  };

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
      {upgrade.image_url && (
        <Image
          source={{ uri: upgrade.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{upgrade.name}</Text>
            <Text style={styles.manufacturer}>{upgrade.manufacturer}</Text>
          </View>
          
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
            {getCategoryIcon()}
            <Text style={styles.categoryText}>{upgrade.category}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {upgrade.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Cost</Text>
              <Text style={styles.statValue}>${upgrade.cost.toLocaleString()}</Text>
            </View>
            
            {upgrade.value_increase > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Value Added</Text>
                <Text style={styles.statValue}>+${upgrade.value_increase.toLocaleString()}</Text>
              </View>
            )}
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            {getStatusIcon()}
            <Text style={styles.statusText}>{upgrade.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 4,
  },
  manufacturer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
});