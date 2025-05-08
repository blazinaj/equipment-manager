import { Tabs } from 'expo-router';
import { LayoutGrid, Wrench, Receipt, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#334155',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingTop: 6,
          paddingBottom: 6,
          height: 60,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Equipment',
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Maintenance',
          tabBarIcon: ({ color, size }) => (
            <Wrench size={size} color={color} />
          ),
          href: '/maintenance',
        }}
      />
      <Tabs.Screen
        name="costs"
        options={{
          title: 'Costs',
          tabBarIcon: ({ color, size }) => (
            <Receipt size={size} color={color} />
          ),
          href: '/costs',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
      
      {/* Hide all detail/edit/add screens from tab bar */}
      <Tabs.Screen
        name="equipment/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="equipment/add"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="equipment/search"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="maintenance/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="maintenance/add"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="maintenance/edit/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="costs/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="costs/add"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="equipment/[id]/upgrades/[upgradeId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="equipment/[id]/upgrades/add"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}