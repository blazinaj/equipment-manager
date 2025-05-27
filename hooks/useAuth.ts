import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export type AuthError = {
  message: string;
  code?: string;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        // Handle auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          setSession(session);
          
          // Handle token refresh
          if (event === 'TOKEN_REFRESHED') {
            setRefreshing(false);
          }
          
          // Handle signed out state
          if (event === 'SIGNED_OUT') {
            // Clear any cached data
            await clearAuthData();
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError({
          message: 'Failed to initialize authentication',
          code: 'AUTH_INIT_ERROR'
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle token refresh
  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;

    if (session?.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Refresh 5 minutes before expiry
      const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
      
      refreshTimer = setTimeout(async () => {
        try {
          setRefreshing(true);
          const { error } = await supabase.auth.refreshSession();
          if (error) throw error;
        } catch (err) {
          console.error('Token refresh error:', err);
          setError({
            message: 'Failed to refresh authentication token',
            code: 'TOKEN_REFRESH_ERROR'
          });
          // Force re-authentication
          await supabase.auth.signOut();
        }
      }, refreshTime);
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [session?.expires_at]);

  const clearAuthData = async () => {
    try {
      if (Platform.OS === 'web') {
        // Only clear storage that's safe to access
        await AsyncStorage.clear();
      } else {
        // Clear secure storage
        const keys = await SecureStore.getItemAsync('keys');
        if (keys) {
          const parsedKeys = JSON.parse(keys);
          await Promise.all(
            parsedKeys.map((key: string) => SecureStore.deleteItemAsync(key))
          );
        }
      }
    } catch (err) {
      console.error('Error clearing auth data:', err);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await clearAuthData();
    } catch (err) {
      setError({
        message: 'Failed to sign out',
        code: 'SIGN_OUT_ERROR'
      });
      throw err;
    }
  };

  return {
    session,
    loading,
    error,
    refreshing,
    setSession,
    signOut
  };
}