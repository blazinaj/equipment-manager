import 'react-native-url-polyfill/auto';
import { createClient, type AuthChangeEvent } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { Platform } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Get platform-specific storage implementation
const getStorageAdapter = () => {
  if (Platform.OS === 'web') {
    return AsyncStorage;
  }

  return {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorageAdapter(),
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: __DEV__,
    // Set cookie options for web platform
    cookieOptions: Platform.OS === 'web' ? {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
    } : undefined,
  },
});