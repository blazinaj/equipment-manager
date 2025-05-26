import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, SafeAreaView, Platform } from 'react-native';
import { User, Bell, Shield, CircleHelp as HelpCircle, ArrowUpRight, Trash2, Moon, Sun, Monitor } from 'lucide-react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.profileIcon}>
                <User size={24} color="#FFFFFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileEmail}>john.doe@example.com</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#64748B" />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#0D9488' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#64748B" />
                <Text style={styles.settingLabel}>Maintenance Reminders</Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: '#E2E8F0', true: '#0D9488' }}
                thumbColor={remindersEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <TouchableOpacity 
              style={[styles.themeOption, theme === 'light' && styles.themeOptionSelected]}
              onPress={() => setTheme('light')}
            >
              <View style={styles.themeOptionIcon}>
                <Sun size={20} color={theme === 'light' ? '#0D9488' : '#64748B'} />
              </View>
              <Text style={[styles.themeOptionText, theme === 'light' && styles.themeOptionTextSelected]}>
                Light
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.themeOption, theme === 'dark' && styles.themeOptionSelected]}
              onPress={() => setTheme('dark')}
            >
              <View style={styles.themeOptionIcon}>
                <Moon size={20} color={theme === 'dark' ? '#0D9488' : '#64748B'} />
              </View>
              <Text style={[styles.themeOptionText, theme === 'dark' && styles.themeOptionTextSelected]}>
                Dark
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.themeOption, theme === 'system' && styles.themeOptionSelected]}
              onPress={() => setTheme('system')}
            >
              <View style={styles.themeOptionIcon}>
                <Monitor size={20} color={theme === 'system' ? '#0D9488' : '#64748B'} />
              </View>
              <Text style={[styles.themeOptionText, theme === 'system' && styles.themeOptionTextSelected]}>
                System
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <HelpCircle size={20} color="#64748B" />
                <Text style={styles.settingLabel}>Help & Support</Text>
              </View>
              <ArrowUpRight size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Shield size={20} color="#64748B" />
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <ArrowUpRight size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Shield size={20} color="#64748B" />
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <ArrowUpRight size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.dangerButton}>
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>Version 1.0.0</Text>
          
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
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  editProfileButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#334155',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#334155',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F1F5F9',
  },
  themeOptionSelected: {
    backgroundColor: '#E6F7F5',
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  themeOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  themeOptionTextSelected: {
    color: '#0D9488',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 16,
  },
  emptySpace: {
    height: 60,
  },
});