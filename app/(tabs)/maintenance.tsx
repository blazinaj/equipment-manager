import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Plus, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { MaintenanceItem } from '@/components/MaintenanceItem';
import { useMaintenance } from '@/hooks/useMaintenance';

export default function MaintenanceScreen() {
  const router = useRouter();
  const { records, loading, error } = useMaintenance();
  
  const upcomingMaintenance = records.filter(item => item.status === 'upcoming');
  const completedMaintenance = records.filter(item => item.status === 'completed');
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Maintenance</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/maintenance/add')}
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
            <Text style={styles.loadingText}>Loading maintenance records...</Text>
          </View>
        ) : (
          <>
            <View style={styles.upcomingContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                <Calendar size={20} color="#64748B" />
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.upcomingScroll}
              >
                {upcomingMaintenance.slice(0, 3).map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.upcomingCard}
                    onPress={() => router.push(`/maintenance/${item.id}`)}
                  >
                    <View style={styles.upcomingCardContent}>
                      <Text style={styles.upcomingDate}>{new Date(item.due_date).toLocaleDateString()}</Text>
                      <Text style={styles.upcomingTitle}>{item.title}</Text>
                      <Text style={styles.upcomingEquipment}>${item.cost.toLocaleString()}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {upcomingMaintenance.length > 3 && (
                  <TouchableOpacity style={styles.viewAllCard}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <ChevronRight size={16} color="#334155" />
                  </TouchableOpacity>
                )}
                {upcomingMaintenance.length === 0 && (
                  <View style={styles.emptyUpcomingCard}>
                    <Text style={styles.emptyStateText}>No upcoming maintenance</Text>
                  </View>
                )}
              </ScrollView>
            </View>
            
            <View style={styles.historyContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent History</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                {completedMaintenance.slice(0, 5).map((item) => (
                  <MaintenanceItem 
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/maintenance/${item.id}`)}
                  />
                ))}

                {completedMaintenance.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No maintenance history</Text>
                    <TouchableOpacity 
                      style={styles.emptyStateButton}
                      onPress={() => router.push('/maintenance/add')}
                    >
                      <Text style={styles.emptyStateButtonText}>Add First Record</Text>
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
  upcomingContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
  },
  upcomingScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  upcomingCard: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
  upcomingCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  upcomingDate: {
    fontSize: 14,
    color: '#0D9488',
    fontFamily: 'Inter-Medium',
  },
  upcomingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginVertical: 4,
  },
  upcomingEquipment: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  viewAllCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  emptyUpcomingCard: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#334155',
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  historyContainer: {
    flex: 1,
  },
  historyList: {
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