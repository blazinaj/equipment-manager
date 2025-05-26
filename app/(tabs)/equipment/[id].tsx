import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, TextInput, Modal, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, PenTool as Tool, Truck, FileText, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock, Gauge, PenLine, Trash2, Receipt, Wrench, ChevronRight, Plus, X } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { MaintenanceItem } from '@/components/MaintenanceItem';
import { CostItem } from '@/components/CostItem';
import { UpgradeCard } from '@/components/UpgradeCard';
import { RepairItem } from '@/components/RepairItem';
import { useEquipment } from '@/hooks/useEquipment';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useCosts } from '@/hooks/useCosts';
import { useUpgrades } from '@/hooks/useUpgrades';
import { useRepairs } from '@/hooks/useRepairs';

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function EquipmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { equipment, loading, error: equipmentError, deleteEquipment } = useEquipment();
  const { records: maintenanceRecords, loading: maintenanceLoading } = useMaintenance(id as string);
  const { costs, loading: costsLoading } = useCosts(id as string);
  const { upgrades, loading: upgradesLoading } = useUpgrades(id as string);
  const { repairs, loading: repairsLoading } = useRepairs(id as string);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const currentEquipment = equipment.find(item => item.id === id);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8, 0.7],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE + 20],
    extrapolate: 'clamp',
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const [isMaintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [cost, setCost] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteEquipment(id as string);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete equipment');
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading equipment details...</Text>
      </View>
    );
  }

  if (equipmentError || !currentEquipment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {equipmentError || 'Equipment not found'}
        </Text>
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

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Image
          source={{ uri: currentEquipment.image_url || 'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <Animated.View 
          style={[
            styles.headerOverlay,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }]
            }
          ]} 
        />

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push(`/equipment/edit/${currentEquipment.id}`)}
        >
          <PenLine size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => setDeleteModalVisible(true)}
        >
          <Trash2 size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Animated.View 
          style={[
            styles.collapsedHeader,
            {
              opacity: headerContentOpacity,
              transform: [{ translateY: titleTranslateY }]
            }
          ]}
        >
          <View style={styles.collapsedContent}>
            <Image
              source={{ uri: currentEquipment.image_url || 'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.collapsedImage}
              resizeMode="cover"
            />
            <View style={styles.collapsedInfo}>
              <Text style={styles.collapsedTitle} numberOfLines={1} ellipsizeMode="tail">
                {currentEquipment.name}
              </Text>
              <Text style={styles.collapsedSubtitle} numberOfLines={1}>
                {currentEquipment.type} • {currentEquipment.year}
              </Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </View>
        </Animated.View>
      </Animated.View>
      
      <Animated.ScrollView
        style={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>{currentEquipment.name}</Text>
          <View style={[styles.statusBadge, 
            currentEquipment.status === 'Good' 
              ? styles.statusGood 
              : currentEquipment.status === 'Fair' 
                ? styles.statusFair 
                : styles.statusPoor
          ]}>
            <Text style={styles.statusText}>{currentEquipment.status}</Text>
          </View>
        </View>
        
        <Text style={styles.subtitle}>{currentEquipment.type} • {currentEquipment.year}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Tool size={20} color="#64748B" />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Make & Model</Text>
              <Text style={styles.statValue}>
                {currentEquipment.make} {currentEquipment.model}
              </Text>
            </View>
          </View>
          
          {currentEquipment.model_number && (
            <View style={styles.statItem}>
              <FileText size={20} color="#64748B" />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Model Number</Text>
                <Text style={styles.statValue}>
                  {currentEquipment.model_number}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.statItem}>
            <Calendar size={20} color="#64748B" />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Purchase Date</Text>
              <Text style={styles.statValue}>
                {new Date(currentEquipment.purchase_date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <DollarSign size={20} color="#64748B" />
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Purchase Price</Text>
              <Text style={styles.statValue}>
                ${currentEquipment.purchase_price.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        
        {(currentEquipment.vin_number || currentEquipment.license_plate) && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Truck size={20} color="#64748B" />
              <Text style={styles.infoTitle}>Vehicle Information</Text>
            </View>
            <View style={styles.infoContent}>
              {currentEquipment.vin_number && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>VIN Number</Text>
                  <Text style={styles.infoValue}>{currentEquipment.vin_number}</Text>
                </View>
              )}
              {currentEquipment.license_plate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>License Plate</Text>
                  <Text style={styles.infoValue}>{currentEquipment.license_plate}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {currentEquipment.notes && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <FileText size={20} color="#64748B" />
              <Text style={styles.infoTitle}>Notes</Text>
            </View>
            <Text style={styles.notes}>{currentEquipment.notes}</Text>
          </View>
        )}

        {/* Maintenance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Wrench size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Maintenance</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/maintenance/add')}
            >
              <Plus size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          {maintenanceLoading ? (
            <Text style={styles.loadingText}>Loading maintenance records...</Text>
          ) : maintenanceRecords.length > 0 ? (
            maintenanceRecords.map((record) => (
              <MaintenanceItem
                key={record.id}
                item={record}
                onPress={() => router.push(`/maintenance/${record.id}`)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No maintenance records yet</Text>
          )}
        </View>

        {/* Upgrades Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Tool size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Upgrades</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push(`/equipment/${currentEquipment.id}/upgrades/add`)}
            >
              <Plus size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          {upgradesLoading ? (
            <Text style={styles.loadingText}>Loading upgrades...</Text>
          ) : upgrades.length > 0 ? (
            upgrades.map((upgrade) => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                onPress={() => router.push(`/equipment/${currentEquipment.id}/upgrades/${upgrade.id}`)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No upgrades installed yet</Text>
          )}
        </View>

        {/* Repairs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Tool size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Repairs</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push(`/equipment/${currentEquipment.id}/repairs/add`)}
            >
              <Plus size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          {repairsLoading ? (
            <Text style={styles.loadingText}>Loading repairs...</Text>
          ) : repairs.length > 0 ? (
            repairs.map((repair) => (
              <RepairItem
                key={repair.id}
                item={repair}
                onPress={() => router.push(`/equipment/${currentEquipment.id}/repairs/${repair.id}`)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No repairs recorded yet</Text>
          )}
        </View>

        {/* Costs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Receipt size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Expenses</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/costs/add')}
            >
              <Plus size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          {costsLoading ? (
            <Text style={styles.loadingText}>Loading expenses...</Text>
          ) : costs.length > 0 ? (
            costs.map((cost) => (
              <CostItem
                key={cost.id}
                item={cost}
                onPress={() => router.push(`/costs/${cost.id}`)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No expenses recorded yet</Text>
          )}
        </View>

        <View style={styles.emptySpace} />
      </Animated.ScrollView>

      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteModalHeader}>
              <Trash2 size={24} color="#EF4444" />
              <Text style={styles.deleteModalTitle}>Delete Equipment</Text>
            </View>

            <Text style={styles.deleteModalText}>
              Are you sure you want to delete "{currentEquipment.name}"? This action cannot be undone.
            </Text>

            <Text style={styles.deleteModalWarning}>
              All associated maintenance records, costs, and upgrades will also be deleted.
            </Text>

            <View style={styles.deleteModalActions}>
              <TouchableOpacity 
                style={styles.cancelDeleteButton}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.confirmDeleteButton, deleting && styles.confirmDeleteButtonDisabled]}
                onPress={handleDelete}
                disabled={deleting}
              >
                <Text style={styles.confirmDeleteButtonText}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
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
    height: HEADER_MAX_HEIGHT,
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  collapsedHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  collapsedImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
  },
  collapsedInfo: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  collapsedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 2,
  },
  collapsedSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
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
  deleteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 64,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#F8FAFC',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginLeft: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding:  24,
    width: '90%',
    maxWidth: 400,
  },
  deleteModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginLeft: 12,
  },
  deleteModalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
    marginBottom: 12,
    lineHeight: 24,
  },
  deleteModalWarning: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginBottom: 24,
  },
  deleteModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelDeleteButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  confirmDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  confirmDeleteButtonDisabled: {
    opacity: 0.5,
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorMessageText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  modalForm: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  iconInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptySpace: {
    height: 40,
  },
});