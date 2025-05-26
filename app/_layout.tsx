import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { ThemeContext, useThemeProvider } from '@/hooks/useTheme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SplashScreen } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const { session, loading: authLoading, setSession } = useAuth();
  const themeContext = useThemeProvider();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  // Listen for auth state changes
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  // Hide splash screen once fonts are loaded and auth is checked
  useEffect(() => {
    if ((fontsLoaded || fontError) && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authLoading]);

  // Return null to keep splash screen visible while loading
  if (!fontsLoaded && !fontError && authLoading) {
    return null;
  }

  return (
    <>
      <ThemeContext.Provider value={themeContext}>
        <Stack screenOptions={{ headerShown: false }}>
          {session ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          )}
        </Stack>
        <StatusBar style={themeContext.isDark ? 'light' : 'dark'} />
      </ThemeContext.Provider>
    </>
  );
}