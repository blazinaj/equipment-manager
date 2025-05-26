import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, DollarSign, Truck, FileText, Camera } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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

export default function EditEquipmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { equipment, loading, error: equipmentError, updateEquipment, defaultImages } = useEquipment();
  const currentEquipment = equipment.find(item => item.id === id);

  const [name, setName] = useState('');
  const [type, setType] = useState<keyof typeof defaultImages>('Vehicle');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [status, setStatus] = useState<'Good' | 'Fair' | 'Poor'>('Good');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentEquipment) {
      setName(currentEquipment.name);
      setType(currentEquipment.type as keyof typeof defaultImages);
      setYear(currentEquipment.year?.toString() || '');
      setMake(currentEquipment.make || '');
      setModel(currentEquipment.model || '');
      setModelNumber(currentEquipment.model_number || '');
      setStatus(currentEquipment.status);
      setPurchaseDate(currentEquipment.purchase_date || '');
      setPurchasePrice(currentEquipment.purchase_price?.toString() || '');
      setVinNumber(currentEquipment.vin_number || '');
      setLicensePlate(currentEquipment.license_plate || '');
      setNotes(currentEquipment.notes || '');
    }
  }, [currentEquipment]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
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

  const handleSave = async () => {
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

    try {
      setSaving(true);
      setError(null);
      
      const updates: any = {
        name,
        type,
        make: make || null,
        model: model || null,
        model_number: modelNumber || null,
        status,
        vin_number: vinNumber || null,
        license_plate: licensePlate || null,
        notes: notes || null,
      };
      
      if (year) {
        updates.year = parseInt(year);
      }
      
      if (purchaseDate) {
        updates.purchase_date = purchaseDate;
      }
      
      if (purchasePrice) {
        updates.purchase_price = parseFloat(purchasePrice);
      }

      if (imageFile) {
        updates.imageFile = imageFile;
      }

      await updateEquipment(currentEquipment.id, updates);

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update equipment');
    } finally {
      setSaving(false);
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
        <Text style={styles.headerTitle}>Edit Equipment</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.imageSection}>
          <Image
            source={{ uri: imageFile ? URL.createObjectURL(imageFile) : currentEquipment.image_url || defaultImages[type] }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => document.getElementById('image-input')?.click()}
          >
            <Camera size={20} color="#334155" />
            <Text style={styles.uploadButtonText}>
              {imageFile ? 'Change Image' : 'Change Image'}
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
            <Text style={styles.label}>Make</Text>
            <TextInput
              style={styles.input}
              value={make}
              onChangeText={setMake}
              placeholder="Enter make (e.g., Ford, John Deere)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.input}
              value={model}
              onChangeText={setModel}
              placeholder="Enter model (e.g., F-150, X350)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model Number</Text>
            <TextInput
              style={styles.input}
              value={modelNumber}
              onChangeText={setModelNumber}
              placeholder="Enter model number or serial number"
            />
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
              {saving ? 'Saving...' : 'Save Changes'}
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