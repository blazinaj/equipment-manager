import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, Truck, FileText } from 'lucide-react-native';
import { useState } from 'react';
import { equipmentData } from '@/data/equipmentData';

export default function EditEquipmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const equipment = equipmentData.find(item => item.id === id);

  const [name, setName] = useState(equipment?.name || '');
  const [type, setType] = useState(equipment?.type || '');
  const [year, setYear] = useState(equipment?.year.toString() || '');
  const [status, setStatus] = useState<'Good' | 'Fair' | 'Poor'>(equipment?.status || 'Good');
  const [purchaseDate, setPurchaseDate] = useState(equipment?.purchaseDate || '');
  const [purchasePrice, setPurchasePrice] = useState(equipment?.purchasePrice.toString() || '');
  const [vinNumber, setVinNumber] = useState(equipment?.vinNumber || '');
  const [licensePlate, setLicensePlate] = useState(equipment?.licensePlate || '');
  const [notes, setNotes] = useState(equipment?.notes || '');
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!type.trim()) {
      setError('Type is required');
      return;
    }

    if (!year.trim() || isNaN(Number(year))) {
      setError('Valid year is required');
      return;
    }

    if (!purchaseDate.trim()) {
      setError('Purchase date is required');
      return;
    }

    if (!purchasePrice.trim() || isNaN(Number(purchasePrice))) {
      setError('Valid purchase price is required');
      return;
    }

    // In a real app, this would update the database
    router.back();
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
        <Text style={styles.headerTitle}>Edit Equipment</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputWithIcon}>
              <Truck size={20} color="#64748B" />
              <TextInput
                style={styles.iconInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter equipment name"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              style={styles.input}
              value={type}
              onChangeText={setType}
              placeholder="Enter equipment type"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="Enter year"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity 
                style={[
                  styles.statusButton,
                  status === 'Good' && styles.statusButtonActive,
                  { backgroundColor: status === 'Good' ? '#DCFCE7' : '#F1F5F9' }
                ]}
                onPress={() => setStatus('Good')}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'Good' && styles.statusButtonTextActive
                ]}>Good</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.statusButton,
                  status === 'Fair' && styles.statusButtonActive,
                  { backgroundColor: status === 'Fair' ? '#FEF9C3' : '#F1F5F9' }
                ]}
                onPress={() => setStatus('Fair')}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'Fair' && styles.statusButtonTextActive
                ]}>Fair</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.statusButton,
                  status === 'Poor' && styles.statusButtonActive,
                  { backgroundColor: status === 'Poor' ? '#FEE2E2' : '#F1F5F9' }
                ]}
                onPress={() => setStatus('Poor')}
              >
                <Text style={[
                  styles.statusButtonText,
                  status === 'Poor' && styles.statusButtonTextActive
                ]}>Poor</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Date</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color="#64748B" />
              <TextInput
                style={styles.iconInput}
                value={purchaseDate}
                onChangeText={setPurchaseDate}
                placeholder="MM/DD/YYYY"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Price</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#64748B" />
              <TextInput
                style={styles.iconInput}
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>VIN Number</Text>
            <TextInput
              style={styles.input}
              value={vinNumber}
              onChangeText={setVinNumber}
              placeholder="Enter VIN number (optional)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>License Plate</Text>
            <TextInput
              style={styles.input}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="Enter license plate (optional)"
            />
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
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptySpace: {
    height: 40,
  },
});