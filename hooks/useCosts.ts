import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

export type Cost = Database['public']['Tables']['costs']['Row'];
export type NewCost = Omit<Database['public']['Tables']['costs']['Insert'], 'user_id'>;
export type CostUpdate = Database['public']['Tables']['costs']['Update'];

export function useCosts(equipmentId?: string) {
  const { session } = useAuth();
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchCosts();
    }
  }, [session, equipmentId]);

  // Subscribe to changes
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('costs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'costs',
        filter: equipmentId ? `equipment_id=eq.${equipmentId}` : undefined
      }, () => {
        fetchCosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, equipmentId]);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('costs')
        .select('*')
        .order('date', { ascending: false });

      if (equipmentId) {
        query = query.eq('equipment_id', equipmentId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setCosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addCost = async (newCost: NewCost) => {
    if (!session?.user.id) throw new Error('User not authenticated');

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('costs')
        .insert([{
          ...newCost,
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state optimistically
      setCosts(prev => [data!, ...prev]);

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateCost = async (id: string, updates: CostUpdate) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state optimistically
      setCosts(prev => prev.map(cost => cost.id === id ? data! : cost));

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteCost = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('costs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      setCosts(prev => prev.filter(cost => cost.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    costs,
    loading,
    error,
    addCost,
    updateCost,
    deleteCost,
    refresh: fetchCosts,
  };
}