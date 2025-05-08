import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ArrowDown, ChartPie as PieChart, ChartBar as BarChart4 } from 'lucide-react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { CostItem } from '@/components/CostItem';
import { useCosts } from '@/hooks/useCosts';

export default function CostsScreen() {
  const router = useRouter();
  const { costs, loading, error } = useCosts();
  const [periodFilter, setPeriodFilter] = useState('monthly');
  
  // Calculate totals
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const maintenanceCosts = costs.filter(item => item.category === 'maintenance').reduce((sum, item) => sum + item.amount, 0);
  const repairCosts = costs.filter(item => item.category === 'repair').reduce((sum, item) => sum + item.amount, 0);
  const upgradeCosts = costs.filter(item => item.category === 'upgrade').reduce((sum, item) => sum + item.amount, 0);
  const fuelCosts = costs.filter(item => item.category === 'fuel').reduce((sum, item) => sum + item.amount, 0);
  
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

        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {loading ? (
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
                {costs.slice(0, 10).map((item) => (
                  <CostItem 
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/costs/${item.id}`)}
                  />
                ))}

                {costs.length === 0 && (
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
});