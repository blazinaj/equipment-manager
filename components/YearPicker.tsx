import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react-native';

interface YearPickerProps {
  value: string;
  onChange: (year: string) => void;
  minYear?: number;
  maxYear?: number;
}

export function YearPicker({ value, onChange, minYear = 1900, maxYear = new Date().getFullYear() }: YearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  return (
    <View>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsOpen(true)}
      >
        <Calendar size={20} color="#64748B" />
        <Text style={styles.inputText}>
          {value || 'Select year'}
        </Text>
        <ChevronDown size={20} color="#64748B" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Year</Text>
            
            <ScrollView style={styles.yearList}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearItem,
                    value === year.toString() && styles.selectedYear
                  ]}
                  onPress={() => {
                    onChange(year.toString());
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.yearText,
                    value === year.toString() && styles.selectedYearText
                  ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  yearList: {
    maxHeight: 300,
  },
  yearItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  yearText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
    textAlign: 'center',
  },
  selectedYear: {
    backgroundColor: '#F1F5F9',
  },
  selectedYearText: {
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
});