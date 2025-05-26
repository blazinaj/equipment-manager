import { Tabs } from 'expo-router';
import { Grid2x2 as Grid, Wrench, Receipt, Settings } from 'lucide-react-native';
import { Platform, Dimensions } from 'react-native';

const ICON_SIZE = 24;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#334155',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter-Medium',
          marginTop: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarItemStyle: {
          height: Platform.OS === 'ios' ? 50 : 48,
          width: SCREEN_WIDTH / 4,
          padding: 0,
          margin: 0,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Fleet',
          tabBarIcon: ({ color, size }) => (
            <Grid size={ICON_SIZE} color={color} strokeWidth={1.5} />
          ),
          href: '/',
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Maintenance',
          tabBarIcon: ({ color, size }) => (
            <Wrench size={ICON_SIZE} color={color} strokeWidth={1.5} />
          ),
          href: '/maintenance',
        }}
      />
      <Tabs.Screen
        name="costs"
        options={{
          title: 'Costs',
          tabBarIcon: ({ color, size }) => (
            <Receipt size={ICON_SIZE} color={color} strokeWidth={1.5} />
          ),
          href: '/costs',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={ICON_SIZE} color={color} strokeWidth={1.5} />
          ),
          href: '/settings',
        }}
      />

      {/* Hide all detail/edit/add screens from tab bar */}
      <Tabs.Screen
        name="equipment/[id]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="equipment/add"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="equipment/search"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="equipment/edit/[id]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="maintenance/[id]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="maintenance/add"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="maintenance/edit/[id]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="costs/[id]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="costs/add"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="equipment/[id]/upgrades/[upgradeId]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="equipment/[id]/upgrades/add"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="equipment/[id]/repairs/[repairId]"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="equipment/[id]/repairs/add"
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}