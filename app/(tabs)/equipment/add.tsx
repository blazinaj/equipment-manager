import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, DollarSign, Truck, FileText, Camera } from 'lucide-react-native';
import { useState } from 'react';
import { useEquipment } from '@/hooks/useEquipment';
import { DatePicker } from '@/components/DatePicker';
import { YearPicker } from '@/components/YearPicker';

const EQUIPMENT_TYPES = [
  'Vehicle',
  'Motorcycle',
  'Lawn & Garden',
  'Construction',
  'Watercraft',
  'Recreational',
  'Other'
];

export default function AddEquipmentScreen() {
  const router = useRouter();
  const { addEquipment, defaultImages } = useEquipment();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<keyof typeof defaultImages>('Vehicle');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState<'Good' | 'Fair' | 'Poor'>('Good');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!type.trim()) {
      setError('Type is required');
      return;
    }

    // Year validation - optional but must be valid if provided
    if (year && (isNaN(Number(year)) || Number(year) < 1900 || Number(year) > new Date().getFullYear())) {
      setError('Please enter a valid year between 1900 and ' + new Date().getFullYear());
      return;
    }

    // Purchase price validation - optional but must be valid if provided
    if (purchasePrice && (isNaN(Number(purchasePrice)) || Number(purchasePrice) < 0)) {
      setError('Please enter a valid purchase price');
      return;
    }

    // Purchase date validation - optional but must be valid if provided
    if (purchaseDate && isNaN(Date.parse(purchaseDate))) {
      setError('Please enter a valid purchase date');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await addEquipment({
        name,
        type,
        year: year ? parseInt(year) : null,
        status,
        purchase_date: purchaseDate || null,
        purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
        vin_number: vinNumber || null,
        license_plate: licensePlate || null,
        notes: notes || null,
        imageFile: imageFile || undefined,
      });

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add equipment');
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Add Equipment</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.imageSection}>
          <Image
            source={{ uri: imageFile ? URL.createObjectURL(imageFile) : defaultImages[type] }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => document.getElementById('image-input')?.click()}
          >
            <Camera size={20} color="#334155" />
            <Text style={styles.uploadButtonText}>
              {imageFile ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
        </View>

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
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeList}
            >
              {EQUIPMENT_TYPES.map((equipmentType) => (
                <TouchableOpacity
                  key={equipmentType}
                  style={[
                    styles.typeButton,
                    type === equipmentType && styles.typeButtonSelected
                  ]}
                  onPress={() => setType(equipmentType as keyof typeof defaultImages)}
                >
                  <Text 
                    style={[
                      styles.typeButtonText,
                      type === equipmentType && styles.typeButtonTextSelected
                    ]}
                  >
                    {equipmentType}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year</Text>
            <YearPicker
              value={year}
              onChange={setYear}
              minYear={1900}
              maxYear={new Date().getFullYear()}
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
            <DatePicker
              value={purchaseDate}
              onChange={setPurchaseDate}
            />
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
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Adding...' : 'Add Equipment'}
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
  imageSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
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
  typeList: {
    paddingVertical: 4,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginRight: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#334155',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
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