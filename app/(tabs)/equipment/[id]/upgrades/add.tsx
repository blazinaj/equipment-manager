import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, Camera, FileText, PenTool as Tool } from 'lucide-react-native';
import { useState } from 'react';
import { useUpgrades } from '@/hooks/useUpgrades';
import { DatePicker } from '@/components/DatePicker';

const CATEGORIES = [
  'Performance',
  'Appearance',
  'Utility',
  'Safety',
  'Other'
] as const;

const STATUSES = [
  'Installed',
  'Planned',
  'Removed'
] as const;

export default function AddUpgradeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addUpgrade } = useUpgrades();
  
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Performance');
  const [status, setStatus] = useState<typeof STATUSES[number]>('Planned');
  const [installDate, setInstallDate] = useState('');
  const [cost, setCost] = useState('');
  const [valueIncrease, setValueIncrease] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
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

    if (!manufacturer.trim()) {
      setError('Manufacturer is required');
      return;
    }

    if (!cost.trim() || isNaN(Number(cost)) || Number(cost) < 0) {
      setError('Valid cost is required');
      return;
    }

    if (valueIncrease && (isNaN(Number(valueIncrease)) || Number(valueIncrease) < 0)) {
      setError('Value increase must be a positive number');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await addUpgrade({
        equipment_id: id as string,
        name,
        manufacturer,
        description: description || null,
        category,
        status,
        install_date: installDate || null,
        cost: Number(cost),
        value_increase: valueIncrease ? Number(valueIncrease) : 0,
        notes: notes || null,
        imageFile,
      });

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add upgrade');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (cat: typeof CATEGORIES[number]) => {
    switch (cat) {
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

  const getStatusColor = (stat: typeof STATUSES[number]) => {
    switch (stat) {
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
        <Text style={styles.headerTitle}>Add Upgrade</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.imageSection}>
          {imageFile ? (
            <Image
              source={{ uri: URL.createObjectURL(imageFile) }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={32} color="#94A3B8" />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => document.getElementById('image-input')?.click()}
          >
            <Camera size={20} color="#334155" />
            <Text style={styles.uploadButtonText}>
              {imageFile ? 'Change Photo' : 'Upload Photo'}
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
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter upgrade name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Manufacturer</Text>
            <View style={styles.inputWithIcon}>
              <Tool size={20} color="#64748B" />
              <TextInput
                style={styles.iconInput}
                value={manufacturer}
                onChangeText={setManufacturer}
                placeholder="Enter manufacturer name"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter upgrade description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && { backgroundColor: getCategoryColor(cat) }
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text 
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextSelected
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusButtons}>
              {STATUSES.map((stat) => (
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
            <Text style={styles.label}>Install Date</Text>
            <DatePicker
              value={installDate}
              onChange={setInstallDate}
            />
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
            <Text style={styles.label}>Value Increase</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color="#64748B" />
              <TextInput
                style={styles.iconInput}
                value={valueIncrease}
                onChangeText={setValueIncrease}
                placeholder="0.00"
                keyboardType="decimal-pad"
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
              {saving ? 'Adding...' : 'Add Upgrade'}
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
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
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
  categoryList: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  categoryButtonTextSelected: {
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