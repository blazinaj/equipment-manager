import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, PenTool as Tool, Truck, FileText, Plus, X, Gauge, PenLine } from 'lucide-react-native';
import { useState } from 'react';
import { MaintenanceItem } from '@/components/MaintenanceItem';
import { CostItem } from '@/components/CostItem';
import { equipmentData } from '@/data/equipmentData';
import { maintenanceData } from '@/data/maintenanceData';
import { costData } from '@/data/costData';
import { upgradeData } from '@/data/upgradeData';
import { UpgradeCard } from '@/components/UpgradeCard';

export default function EquipmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const equipment = equipmentData.find(item => item.id === id);
  const maintenanceHistory = maintenanceData.filter(item => item.equipmentId === id);
  const costHistory = costData.filter(item => item.equipmentId === id);
  const upgrades = upgradeData.filter(item => item.equipmentId === id);

  const [isMaintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [cost, setCost] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddMaintenance = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!dueDate.trim()) {
      setError('Due date is required');
      return;
    }

    if (!cost.trim() || isNaN(Number(cost))) {
      setError('Valid cost is required');
      return;
    }

    // In a real app, this would save to the database
    setMaintenanceModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setCost('');
    setOdometerReading('');
    setServiceProvider('');
    setNotes('');
    setError(null);
  };

  if (!equipment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Equipment not found</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Image
          source={{ uri: equipment.image }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push(`/equipment/edit/${equipment.id}`)}
        >
          <PenLine size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{equipment.name}</Text>
          <View style={[styles.statusBadge, 
            equipment.status === 'Good' 
              ? styles.statusGood 
              : equipment.status === 'Fair' 
                ? styles.statusFair 
                : styles.statusPoor
          ]}>
            <Text style={styles.statusText}>{equipment.status}</Text>
          </View>
        </View>
        
        <Text style={styles.subtitle}>{equipment.type} • {equipment.year}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Calendar size={20} color="#64748B" />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Purchase Date</Text>
              <Text style={styles.statValue}>{equipment.purchaseDate}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <DollarSign size={20} color="#64748B" />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Purchase Price</Text>
              <Text style={styles.statValue}>${equipment.purchasePrice.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <Tool size={20} color="#64748B" />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Maintenance Records</Text>
              <Text style={styles.statValue}>{equipment.maintenanceCount}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <DollarSign size={20} color="#64748B" />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Cost</Text>
              <Text style={styles.statValue}>${equipment.totalCost.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        
        {equipment.vinNumber && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Truck size={20} color="#64748B" />
              <Text style={styles.infoTitle}>Vehicle Information</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>VIN Number</Text>
                <Text style={styles.infoValue}>{equipment.vinNumber}</Text>
              </View>
              {equipment.licensePlate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>License Plate</Text>
                  <Text style={styles.infoValue}>{equipment.licensePlate}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {equipment.notes && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <FileText size={20} color="#64748B" />
              <Text style={styles.infoTitle}>Notes</Text>
            </View>
            <Text style={styles.notes}>{equipment.notes}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upgrades & Modifications</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push(`/equipment/${id}/upgrades/add`)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {upgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              onPress={() => router.push(`/equipment/${id}/upgrades/${upgrade.id}`)}
            />
          ))}
          
          {upgrades.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No upgrades or modifications added yet
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push(`/equipment/${id}/upgrades/add`)}
              >
                <Text style={styles.emptyStateButtonText}>Add First Upgrade</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Maintenance</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setMaintenanceModalVisible(true)}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {maintenanceHistory.slice(0, 3).map((item) => (
            <MaintenanceItem 
              key={item.id}
              item={item}
              onPress={() => router.push(`/maintenance/${item.id}`)}
            />
          ))}
          {maintenanceHistory.length > 3 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/maintenance')}
            >
              <Text style={styles.viewAllText}>View All Maintenance Records</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/costs/add')}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {costHistory.slice(0, 3).map((item) => (
            <CostItem 
              key={item.id}
              item={item}
              onPress={() => router.push(`/costs/${item.id}`)}
            />
          ))}
          {costHistory.length > 3 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/costs')}
            >
              <Text style={styles.viewAllText}>View All Expenses</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.emptySpace} />
      </ScrollView>

      <Modal
        visible={isMaintenanceModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Maintenance</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setMaintenanceModalVisible(false);
                  resetForm();
                }}
              >
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorMessage}>
                <Text style={styles.errorMessageText}>{error}</Text>
              </View>
            )}

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter maintenance title"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter maintenance description"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Due Date</Text>
                <View style={styles.inputWithIcon}>
                  <Calendar size={20} color="#64748B" />
                  <TextInput
                    style={styles.iconInput}
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholder="MM/DD/YYYY"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cost</Text>
                <View style={styles.inputWithIcon}>
                  <DollarSign size={20} color="#64748B" />
                  <TextInput
                    style={styles.iconInput}
                    value={cost}
                    onChangeText={setCost}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Odometer Reading</Text>
                <View style={styles.inputWithIcon}>
                  <Gauge size={20} color="#64748B" />
                  <TextInput
                    style={styles.iconInput}
                    value={odometerReading}
                    onChangeText={setOdometerReading}
                    placeholder="Enter current mileage"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Provider</Text>
                <View style={styles.inputWithIcon}>
                  <Tool size={20} color="#64748B" />
                  <TextInput
                    style={styles.iconInput}
                    value={serviceProvider}
                    onChangeText={setServiceProvider}
                    placeholder="Enter service provider"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <View style={styles.inputWithIcon}>
                  <FileText size={20} color="#64748B" />
                  <TextInput
                    style={[styles.iconInput, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Enter additional notes"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setMaintenanceModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddMaintenance}
              >
                <Text style={styles.saveButtonText}>Add Record</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    height: 240,
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F8FAFC',
    paddingTop: 24,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  statItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  statContent: {
    marginLeft: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginLeft: 8,
  },
  infoContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  notes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#334155',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  emptySpace: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorMessageText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  modalForm: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  iconInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
});