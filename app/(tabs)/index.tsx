import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Filter, Search, ChevronRight } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEquipment } from '@/hooks/useEquipment';

const EQUIPMENT_TYPES = [
  'All',
  'Vehicle',
  'Motorcycle',
  'Lawn & Garden',
  'Construction',
  'Watercraft',
  'Recreational',
  'Other'
];

export default function EquipmentScreen() {
  const router = useRouter();
  const { equipment, loading, error, refresh } = useEquipment();
  const [selectedType, setSelectedType] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  
  const filteredEquipment = selectedType === 'All' 
    ? equipment 
    : equipment.filter(item => item.type === selectedType);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return '#DCFCE7';
      case 'Fair':
        return '#FEF9C3';
      case 'Poor':
        return '#FEE2E2';
      default:
        return '#F1F5F9';
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Equipment</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/equipment/add')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => router.push('/equipment/search')}
          >
            <Search size={20} color="#94A3B8" />
            <Text style={styles.searchPlaceholder}>Search equipment...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#334155" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesScroll}
          >
            {EQUIPMENT_TYPES.map((type) => (
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
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#334155"
              colors={['#334155']} // Android
              progressBackgroundColor="#FFFFFF" // Android
              style={{ backgroundColor: 'transparent' }} // iOS
            />
          }
        >
          {error && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {loading && !refreshing ? (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>Loading equipment...</Text>
            </View>
          ) : filteredEquipment.length > 0 ? (
            <View style={styles.equipmentList}>
              {filteredEquipment.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.equipmentCard}
                  onPress={() => router.push(`/equipment/${item.id}`)}
                >
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.equipmentImage}
                    resizeMode="cover"
                  />
                  <View style={styles.equipmentContent}>
                    <View style={styles.equipmentHeader}>
                      <Text style={styles.equipmentName}>{item.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.equipmentType}>{item.type} • {item.year}</Text>
                    <View style={styles.equipmentFooter}>
                      <Text style={styles.equipmentPrice}>${item.purchase_price.toLocaleString()}</Text>
                      <ChevronRight size={20} color="#94A3B8" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Equipment Found</Text>
              <Text style={styles.emptyStateText}>
                {selectedType === 'All' 
                  ? 'Start by adding your first piece of equipment'
                  : `No ${selectedType} equipment found`}
              </Text>
              {selectedType === 'All' ? (
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/equipment/add')}
                >
                  <Text style={styles.emptyStateButtonText}>Add Equipment</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => setSelectedType('All')}
                >
                  <Text style={styles.emptyStateButtonText}>Show All Equipment</Text>
                </TouchableOpacity>
              )}
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
  content: {
    flex: 1,
  },
  equipmentList: {
    paddingHorizontal: 16,
  },
  equipmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F1F5F9',
  },
  equipmentContent: {
    padding: 16,
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  equipmentName: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  equipmentType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  equipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
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
  loadingState: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptySpace: {
    height: 100,
  },
});