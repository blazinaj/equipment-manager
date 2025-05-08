import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Root() {
  const { session } = useAuth();
  return <Redirect href={session ? '/(tabs)' : '/auth/sign-in'} />;
}