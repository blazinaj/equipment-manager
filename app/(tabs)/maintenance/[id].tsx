import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, PenTool as Tool, Truck, FileText, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock, Gauge } from 'lucide-react-native';
import { maintenanceData } from '@/data/maintenanceData';
import { equipmentData } from '@/data/equipmentData';

export default function MaintenanceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const maintenance = maintenanceData.find(item => item.id === id);
  const equipment = maintenance ? equipmentData.find(item => item.id === maintenance.equipmentId) : null;

  if (!maintenance || !equipment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Maintenance record not found</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const StatusIcon = () => {
    if (maintenance.status === 'completed') {
      return <CheckCircle2 size={24} color="#10B981" />;
    } else if (maintenance.status === 'overdue') {
      return <AlertCircle size={24} color="#EF4444" />;
    } else {
      return <Clock size={24} color="#F59E0B" />;
    }
  };

  const getStatusColor = () => {
    switch (maintenance.status) {
      case 'completed':
        return '#DCFCE7';
      case 'overdue':
        return '#FEE2E2';
      default:
        return '#FEF9C3';
    }
  };

  const getStatusText = () => {
    switch (maintenance.status) {
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Upcoming';
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
        <Text style={styles.headerTitle}>Maintenance Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.mainInfo}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{maintenance.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <StatusIcon />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.equipmentButton}
            onPress={() => router.push(`/equipment/${equipment.id}`)}
          >
            <Truck size={20} color="#64748B" />
            <Text style={styles.equipmentName}>{equipment.name}</Text>
            <Text style={styles.equipmentDetails}>{equipment.type} • {equipment.year}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tool size={20} color="#64748B" />
            <Text style={styles.sectionTitle}>Service Details</Text>
          </View>
          
          <Text style={styles.description}>{maintenance.description}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Calendar size={20} color="#64748B" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Due Date</Text>
                <Text style={styles.detailValue}>{maintenance.dueDate}</Text>
              </View>
            </View>

            {maintenance.completedDate && (
              <View style={styles.detailItem}>
                <CheckCircle2 size={20} color="#64748B" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Completed</Text>
                  <Text style={styles.detailValue}>{maintenance.completedDate}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailItem}>
              <DollarSign size={20} color="#64748B" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Cost</Text>
                <Text style={styles.detailValue}>${maintenance.cost.toLocaleString()}</Text>
              </View>
            </View>

            {maintenance.odometerReading && (
              <View style={styles.detailItem}>
                <Gauge size={20} color="#64748B" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Odometer</Text>
                  <Text style={styles.detailValue}>{maintenance.odometerReading.toLocaleString()} miles</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {maintenance.serviceProvider && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Tool size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Service Provider</Text>
            </View>
            <Text style={styles.serviceProvider}>{maintenance.serviceProvider}</Text>
          </View>
        )}

        {maintenance.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <Text style={styles.notes}>{maintenance.notes}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/maintenance/edit/${maintenance.id}`)}
          >
            <Text style={styles.editButtonText}>Edit Record</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
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
    marginBottom: 16,
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
  serviceProvider: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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