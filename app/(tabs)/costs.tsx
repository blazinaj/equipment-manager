import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ChartPie as PieChart, ChartBar as BarChart4, Wrench, Settings, Car, Fuel, Ban, Filter, ArrowDown, ArrowUp } from 'lucide-react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { CostItem } from '@/components/CostItem';
import { useCosts } from '@/hooks/useCosts';
import { useEquipment } from '@/hooks/useEquipment';

export default function CostsScreen() {
  const router = useRouter();
  const { aggregatedCosts, isLoading, error } = useCosts();
  const { equipment } = useEquipment();
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort costs
  const filteredCosts = aggregatedCosts
    .filter(item => !categoryFilter || item.category === categoryFilter)
    .filter(item => !equipmentFilter || item.equipment_id === equipmentFilter)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate totals from filtered costs
  const totalCosts = filteredCosts.reduce((sum, item) => sum + item.amount, 0);
  const maintenanceCosts = filteredCosts.filter(item => item.category === 'maintenance').reduce((sum, item) => sum + item.amount, 0);
  const repairCosts = filteredCosts.filter(item => item.category === 'repair').reduce((sum, item) => sum + item.amount, 0);
  const upgradeCosts = filteredCosts.filter(item => item.category === 'upgrade').reduce((sum, item) => sum + item.amount, 0);
  const fuelCosts = filteredCosts.filter(item => item.category === 'fuel').reduce((sum, item) => sum + item.amount, 0);
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return <Wrench size={20} color="#0D9488" />;
      case 'repair':
        return <Settings size={20} color="#F59E0B" />;
      case 'upgrade':
        return <Car size={20} color="#6366F1" />;
      case 'fuel':
        return <Fuel size={20} color="#EC4899" />;
      default:
        return <Ban size={20} color="#64748B" />;
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cost Tracker</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/costs/add')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterBar}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color="#334155" />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setSortOrder(order => order === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? (
              <ArrowDown size={20} color="#334155" />
            ) : (
              <ArrowUp size={20} color="#334155" />
            )}
          </TouchableOpacity>
        </View>
        
        {showFilters && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !categoryFilter && styles.filterChipSelected
                ]}
                onPress={() => setCategoryFilter(null)}
              >
                <Text style={[
                  styles.filterChipText,
                  !categoryFilter && styles.filterChipTextSelected
                ]}>All</Text>
              </TouchableOpacity>
              {['maintenance', 'repair', 'upgrade', 'fuel'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    categoryFilter === cat && styles.filterChipSelected
                  ]}
                  onPress={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                >
                  {getCategoryIcon(cat)}
                  <Text style={[
                    styles.filterChipText,
                    categoryFilter === cat && styles.filterChipTextSelected
                  ]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.filterTitle}>Equipment</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !equipmentFilter && styles.filterChipSelected
                ]}
                onPress={() => setEquipmentFilter(null)}
              >
                <Text style={[
                  styles.filterChipText,
                  !equipmentFilter && styles.filterChipTextSelected
                ]}>All</Text>
              </TouchableOpacity>
              {equipment.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.filterChip,
                    equipmentFilter === item.id && styles.filterChipSelected
                  ]}
                  onPress={() => setEquipmentFilter(equipmentFilter === item.id ? null : item.id)}
                >
                  <Text style={[
                    styles.filterChipText,
                    equipmentFilter === item.id && styles.filterChipTextSelected
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {isLoading ? (
          <View style={styles.loadingState}>
            <Text style={styles.loadingText}>Loading costs...</Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Total Expenses</Text>
                <View style={styles.periodSelector}>
                  <TouchableOpacity 
                    style={[styles.periodButton, periodFilter === 'monthly' && styles.periodButtonActive]}
                    onPress={() => setPeriodFilter('monthly')}
                  >
                    <Text style={[styles.periodText, periodFilter === 'monthly' && styles.periodTextActive]}>Monthly</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.periodButton, periodFilter === 'yearly' && styles.periodButtonActive]}
                    onPress={() => setPeriodFilter('yearly')}
                  >
                    <Text style={[styles.periodText, periodFilter === 'yearly' && styles.periodTextActive]}>Yearly</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.periodButton, periodFilter === 'all' && styles.periodButtonActive]}
                    onPress={() => setPeriodFilter('all')}
                  >
                    <Text style={[styles.periodText, periodFilter === 'all' && styles.periodTextActive]}>All</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.totalAmount}>${totalCosts.toLocaleString()}</Text>
              
              <View style={styles.chartControls}>
                <TouchableOpacity style={styles.chartButton}>
                  <PieChart size={18} color="#334155" />
                  <Text style={styles.chartButtonText}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartButton}>
                  <BarChart4 size={18} color="#334155" />
                  <Text style={styles.chartButtonText}>Timeline</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.categorySummary}>
                <View style={styles.categoryItem}>
                  <View style={[styles.categoryDot, { backgroundColor: '#0D9488' }]} />
                  <Text style={styles.categoryName}>Maintenance</Text>
                  <Text style={styles.categoryAmount}>${maintenanceCosts.toLocaleString()}</Text>
                </View>
                <View style={styles.categoryItem}>
                  <View style={[styles.categoryDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.categoryName}>Repairs</Text>
                  <Text style={styles.categoryAmount}>${repairCosts.toLocaleString()}</Text>
                </View>
                <View style={styles.categoryItem}>
                  <View style={[styles.categoryDot, { backgroundColor: '#6366F1' }]} />
                  <Text style={styles.categoryName}>Upgrades</Text>
                  <Text style={styles.categoryAmount}>${upgradeCosts.toLocaleString()}</Text>
                </View>
                <View style={styles.categoryItem}>
                  <View style={[styles.categoryDot, { backgroundColor: '#EC4899' }]} />
                  <Text style={styles.categoryName}>Fuel</Text>
                  <Text style={styles.categoryAmount}>${fuelCosts.toLocaleString()}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.recentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
                {filteredCosts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.costItem}
                    onPress={() => {
                      switch (item.source) {
                        case 'maintenance':
                          router.push(`/maintenance/${item.id}`);
                          break;
                        case 'repair':
                          router.push(`/equipment/${item.equipment_id}/repairs/${item.id}`);
                          break;
                        case 'upgrade':
                          router.push(`/equipment/${item.equipment_id}/upgrades/${item.id}`);
                          break;
                        default:
                          router.push(`/costs/${item.id}`);
                      }
                    }}
                  >
                    <View style={styles.costIcon}>
                      {getCategoryIcon(item.category)}
                    </View>
                    <View style={styles.costContent}>
                      <View style={styles.costHeader}>
                        <Text style={styles.costTitle}>{item.description}</Text>
                        <Text style={styles.costAmount}>${item.amount.toLocaleString()}</Text>
                      </View>
                      <View style={styles.costFooter}>
                        <View style={styles.costCategory}>
                          <Text style={styles.costCategoryText}>
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </Text>
                        </View>
                        <Text style={styles.costDate}>
                          {new Date(item.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                {aggregatedCosts.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No expenses recorded yet</Text>
                    <TouchableOpacity 
                      style={styles.emptyStateButton}
                      onPress={() => router.push('/costs/add')}
                    >
                      <Text style={styles.emptyStateButtonText}>Add First Expense</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                <View style={styles.emptySpace} />
              </ScrollView>
            </View>
          </>
        )}
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
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  sortButton: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
  },
  filterPanel: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  filterChipSelected: {
    backgroundColor: '#334155',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginLeft: 4,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  summaryCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#334155',
  },
  periodText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  totalAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginVertical: 8,
  },
  chartControls: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chartButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  categorySummary: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  categoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  recentContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  viewAllText: {
    fontSize: 14,
    color: '#334155',
    fontFamily: 'Inter-Medium',
  },
  transactionsList: {
    flex: 1,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  emptySpace: {
    height: 100,
  },
  costItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  costIcon: {
    marginRight: 16,
    justifyContent: 'center',
  },
  costContent: {
    flex: 1,
  },
  costHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  costTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginRight: 8,
  },
  costAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  costFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costCategory: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  costCategoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  costDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});