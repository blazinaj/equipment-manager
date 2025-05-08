import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, DollarSign, PenTool as Tool, Truck, FileText, Gauge } from 'lucide-react-native';
import { useState } from 'react';
import { equipmentData } from '@/data/equipmentData';

export default function AddMaintenanceScreen() {
  const router = useRouter();
  const [selectedEquipment, setSelectedEquipment] = useState(equipmentData[0]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [cost, setCost] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
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
    // For now, we'll just go back
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
        <Text style={styles.headerTitle}>Add Maintenance</Text>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.equipmentSelector}>
          <Text style={styles.sectionTitle}>Select Equipment</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.equipmentList}
          >
            {equipmentData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.equipmentCard,
                  selectedEquipment?.id === item.id && styles.equipmentCardSelected
                ]}
                onPress={() => setSelectedEquipment(item)}
              >
                <Truck size={20} color={selectedEquipment?.id === item.id ? '#FFFFFF' : '#64748B'} />
                <Text 
                  style={[
                    styles.equipmentName,
                    selectedEquipment?.id === item.id && styles.equipmentNameSelected
                  ]}
                >
                  {item.name}
                </Text>
                <Text 
                  style={[
                    styles.equipmentType,
                    selectedEquipment?.id === item.id && styles.equipmentTypeSelected
                  ]}
                >
                  {item.type} • {item.year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.form}>
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
            <Text style={styles.saveButtonText}>Save Record</Text>
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
  equipmentSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginLeft: 16,
    marginBottom: 12,
  },
  equipmentList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  equipmentCard: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: 140,
  },
  equipmentCardSelected: {
    backgroundColor: '#334155',
  },
  equipmentName: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginTop: 8,
    textAlign: 'center',
  },
  equipmentNameSelected: {
    color: '#FFFFFF',
  },
  equipmentType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  equipmentTypeSelected: {
    color: '#94A3B8',
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