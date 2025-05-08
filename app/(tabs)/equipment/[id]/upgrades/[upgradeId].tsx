import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, Wrench, FileText, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock } from 'lucide-react-native';
import { upgradeData } from '@/data/upgradeData';
import { equipmentData } from '@/data/equipmentData';

export default function UpgradeDetailsScreen() {
  const { id, upgradeId } = useLocalSearchParams();
  const router = useRouter();
  
  const upgrade = upgradeData.find(item => item.id === upgradeId);
  const equipment = equipmentData.find(item => item.id === id);

  if (!upgrade || !equipment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Upgrade not found</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  const getStatusIcon = () => {
    switch (upgrade.status) {
      case 'Installed':
        return <CheckCircle2 size={24} color="#10B981" />;
      case 'Planned':
        return <Clock size={24} color="#F59E0B" />;
      case 'Removed':
        return <AlertCircle size={24} color="#EF4444" />;
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.mainInfo}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{upgrade.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
              <Text style={styles.categoryText}>{upgrade.category}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            {getStatusIcon()}
            <Text style={styles.statusText}>{upgrade.status}</Text>
          </View>

          <TouchableOpacity 
            style={styles.equipmentButton}
            onPress={() => router.push(`/equipment/${equipment.id}`)}
          >
            <Wrench size={20} color="#64748B" />
            <Text style={styles.equipmentName}>{equipment.name}</Text>
            <Text style={styles.equipmentDetails}>{equipment.type} • {equipment.year}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#64748B" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.description}>{upgrade.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Calendar size={20} color="#64748B" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Install Date</Text>
                <Text style={styles.detailValue}>{upgrade.installDate}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <DollarSign size={20} color="#64748B" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Cost</Text>
                <Text style={styles.detailValue}>${upgrade.cost.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Wrench size={20} color="#64748B" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Installer</Text>
                <Text style={styles.detailValue}>{upgrade.installer}</Text>
              </View>
            </View>
          </View>
        </View>

        {upgrade.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <Text style={styles.notes}>{upgrade.notes}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/equipment/${id}/upgrades/edit/${upgradeId}`)}
          >
            <Text style={styles.editButtonText}>Edit Upgrade</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptySpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  content: {
    flex: 1,
  },
  mainInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginRight: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    marginLeft: 6,
  },
  equipmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
  },
  equipmentName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    marginLeft: 8,
    marginRight: 8,
  },
  equipmentDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailContent: {
    marginLeft: 8,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  notes: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
    lineHeight: 24,
  },
  actions: {
    padding: 16,
  },
  editButton: {
    backgroundColor: '#334155',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptySpace: {
    height: 40,
  },
});