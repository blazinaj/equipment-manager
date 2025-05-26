import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, PenTool as Tool, FileText, Gauge } from 'lucide-react-native';
import { useState } from 'react';
import { useRepairs } from '@/hooks/useRepairs';
import { DatePicker } from '@/components/DatePicker';

const REPAIR_STATUSES = [
  'Pending',
  'In Progress',
  'Completed',
  'Cancelled'
] as const;

export default function AddRepairScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addRepair } = useRepairs();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repairDate, setRepairDate] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [cost, setCost] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [status, setStatus] = useState<typeof REPAIR_STATUSES[number]>('Pending');
  const [serviceProvider, setServiceProvider] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [resolution, setResolution] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  const [warrantyDetails, setWarrantyDetails] = useState('');
  const [isWarrantyClaim, setIsWarrantyClaim] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    // Validate optional numeric fields if provided
    if (partsCost && (isNaN(Number(partsCost)) || Number(partsCost) < 0)) {
      setError('Parts cost must be a valid number');
      return;
    }
    
    if (laborCost && (isNaN(Number(laborCost)) || Number(laborCost) < 0)) {
      setError('Labor cost must be a valid number');
      return;
    }
    
    if (cost && (isNaN(Number(cost)) || Number(cost) < 0)) {
      setError('Cost must be a valid number');
      return;
    }
    
    if (odometerReading && isNaN(Number(odometerReading))) {
      setError('Odometer reading must be a valid number');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await addRepair({
        equipment_id: id as string,
        title,
        description: description || null,
        repair_date: repairDate || new Date().toISOString().split('T')[0],
        completed_date: completedDate || null,
        cost: cost ? Number(cost) : 0,
        parts_cost: partsCost ? Number(partsCost) : null,
        labor_cost: laborCost ? Number(laborCost) : null,
        status,
        service_provider: serviceProvider || null,
        parts_replaced: partsReplaced ? partsReplaced.split(',').map(part => part.trim()) : null,
        diagnosis: diagnosis || null,
        resolution: resolution || null,
        odometer_reading: odometerReading ? Number(odometerReading) : null,
        warranty_claim: isWarrantyClaim,
        warranty_details: warrantyDetails || null,
        notes: notes || null,
      });

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add repair');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (stat: typeof REPAIR_STATUSES[number]) => {
    switch (stat) {
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Repair</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter repair title"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter repair description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusButtons}>
              {REPAIR_STATUSES.map((stat) => (
                <TouchableOpacity
                  key={stat}
                  style={[
                    styles.statusButton,
                    status === stat && styles.statusButtonActive,
                    { backgroundColor: status === stat ? getStatusColor(stat) : '#F1F5F9' }
                  ]}
                  onPress={() => setStatus(stat)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    status === stat && styles.statusButtonTextActive
                  ]}>
                    {stat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repair Date</Text>
            <DatePicker
              value={repairDate}
              onChange={setRepairDate}
            />
          </View>

          {status === 'Completed' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Completion Date</Text>
              <DatePicker
                value={completedDate}
                onChange={setCompletedDate}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Cost</Text>
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
            <Text style={styles.label}>Parts Cost</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#64748B" />
              <TextInput
                style={styles.iconInput}
                value={partsCost}
                onChangeText={setPartsCost}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Labor Cost</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#64748B" />
              <TextInput
                style={styles.iconInput}
                value={laborCost}
                onChangeText={setLaborCost}
                placeholder="0.00"
                keyboardType="decimal-pad"
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
            <Text style={styles.label}>Parts Replaced</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={partsReplaced}
              onChangeText={setPartsReplaced}
              placeholder="Enter parts replaced (comma-separated)"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Diagnosis</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={diagnosis}
              onChangeText={setDiagnosis}
              placeholder="Enter repair diagnosis"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resolution</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={resolution}
              onChangeText={setResolution}
              placeholder="Enter repair resolution"
              multiline
              numberOfLines={4}
            />
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
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  isWarrantyClaim && styles.checkboxChecked
                ]}
                onPress={() => setIsWarrantyClaim(!isWarrantyClaim)}
              >
                {isWarrantyClaim && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Warranty Claim</Text>
            </View>
          </View>

          {isWarrantyClaim && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Warranty Details</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={warrantyDetails}
                onChangeText={setWarrantyDetails}
                placeholder="Enter warranty claim details"
                multiline
                numberOfLines={4}
              />
            </View>
          )}

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
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Adding...' : 'Add Repair'}
            </Text>
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
  errorMessage: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    textAlign: 'center',
  },
  form: {
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
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonActive: {
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  statusButtonTextActive: {
    color: '#334155',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#334155',
    borderColor: '#334155',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptySpace: {
    height: 40,
  },
});