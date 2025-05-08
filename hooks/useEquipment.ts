import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type NewEquipment = Database['public']['Tables']['equipment']['Insert'];
export type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

export function useEquipment() {
  const { session } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchEquipment();
    }
  }, [session]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setEquipment(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const ensureUserProfile = async () => {
    if (!session?.user.id) throw new Error('User not authenticated');

    try {
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError;
      }

      // If profile exists, return early
      if (existingProfile) {
        return true;
      }

      // If profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          email: session.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      return true;
    } catch (err) {
      console.error('Error ensuring user profile:', err);
      throw err;
    }
  };

  const addEquipment = async (newEquipment: Omit<NewEquipment, 'user_id'>) => {
    if (!session?.user.id) throw new Error('User not authenticated');

    // Create optimistic equipment entry
    const optimisticEquipment: Equipment = {
      id: crypto.randomUUID(), // Temporary ID
      user_id: session.user.id,
      image_url: 'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?auto=compress&cs=tinysrgb&w=800',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...newEquipment,
    };

    // Add optimistic entry to state
    setEquipment(prev => [optimisticEquipment, ...prev]);

    try {
      setError(null);

      // Ensure user profile exists before adding equipment
      await ensureUserProfile();

      const { data, error: insertError } = await supabase
        .from('equipment')
        .insert([{
          ...newEquipment,
          user_id: session.user.id,
          image_url: optimisticEquipment.image_url,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Replace optimistic entry with real data
      setEquipment(prev => 
        prev.map(item => 
          item.id === optimisticEquipment.id ? data! : item
        )
      );

      return data!;
    } catch (err) {
      // Remove optimistic entry on error
      setEquipment(prev => 
        prev.filter(item => item.id !== optimisticEquipment.id)
      );
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: EquipmentUpdate) => {
    // Store original equipment for rollback
    const originalEquipment = equipment.find(item => item.id === id);
    if (!originalEquipment) throw new Error('Equipment not found');

    // Apply optimistic update
    setEquipment(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      )
    );

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update with actual server data
      setEquipment(prev => prev.map(item => item.id === id ? data! : item));
      return data!;
    } catch (err) {
      // Rollback on error
      setEquipment(prev => 
        prev.map(item => 
          item.id === id ? originalEquipment : item
        )
      );
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    // Store equipment for potential rollback
    const deletedEquipment = equipment.find(item => item.id === id);
    if (!deletedEquipment) throw new Error('Equipment not found');

    // Optimistically remove equipment
    setEquipment(prev => prev.filter(item => item.id !== id));

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      // Restore equipment on error
      setEquipment(prev => [...prev, deletedEquipment]);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    equipment,
    loading,
    error,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    refresh: fetchEquipment,
  };
}