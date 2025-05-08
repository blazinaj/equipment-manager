import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Filter, Search } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { EquipmentCard } from '@/components/EquipmentCard';
import { StatusBar } from 'expo-status-bar';
import { equipmentData } from '@/data/equipmentData';

export default function EquipmentScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Good' | 'Fair' | 'Poor'>('All');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  // Get unique equipment types
  const equipmentTypes = useMemo(() => {
    const types = new Set(equipmentData.map(item => item.type));
    return ['All', ...Array.from(types)];
  }, []);

  // Filter equipment based on selected type and status
  const filteredEquipment = useMemo(() => {
    return equipmentData.filter(item => {
      const typeMatch = selectedType === 'All' || item.type === selectedType;
      const statusMatch = selectedStatus === 'All' || item.status === selectedStatus;
      return typeMatch && statusMatch;
    });
  }, [selectedType, selectedStatus]);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Equipment</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/equipment/add')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#94A3B8" />
            <TouchableOpacity 
              style={styles.searchInputContainer}
              onPress={() => router.push('/equipment/search')}
            >
              <Text style={styles.searchPlaceholder}>Search equipment...</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, showStatusFilter && styles.filterButtonActive]}
            onPress={() => setShowStatusFilter(!showStatusFilter)}
          >
            <Filter size={20} color={showStatusFilter ? '#FFFFFF' : '#334155'} />
          </TouchableOpacity>
        </View>

        {showStatusFilter && (
          <View style={styles.statusFilterContainer}>
            <Text style={styles.filterLabel}>Filter by Status:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statusButtons}
            >
              {(['All', 'Good', 'Fair', 'Poor'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    selectedStatus === status && styles.statusButtonActive,
                    selectedStatus === status && {
                      backgroundColor: status === 'Good' ? '#DCFCE7' :
                                     status === 'Fair' ? '#FEF9C3' :
                                     status === 'Poor' ? '#FEE2E2' :
                                     '#334155'
                    }
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    selectedStatus === status && styles.statusButtonTextActive
                  ]}>{status}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesScroll}
          >
            {equipmentTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.categoryButton,
                  selectedType === type && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedType === type && styles.categoryTextActive
                ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <ScrollView style={styles.equipmentList} showsVerticalScrollIndicator={false}>
          {filteredEquipment.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No equipment found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your filters or add new equipment
              </Text>
              <TouchableOpacity 
                style={styles.addFirstButton}
                onPress={() => router.push('/equipment/add')}
              >
                <Text style={styles.addFirstButtonText}>Add Equipment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.equipmentGrid}>
              {filteredEquipment.map((item) => (
                <EquipmentCard 
                  key={item.id}
                  equipment={item}
                  onPress={() => router.push(`/equipment/${item.id}`)}
                />
              ))}
            </View>
          )}
          
          <View style={styles.emptySpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterButtonActive: {
    backgroundColor: '#334155',
    borderColor: '#334155',
  },
  statusFilterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
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
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryButtonActive: {
    backgroundColor: '#334155',
    borderColor: '#334155',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  equipmentList: {
    flex: 1,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  addFirstButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptySpace: {
    height: 100,
  },
});