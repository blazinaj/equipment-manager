import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

export type Repair = Database['public']['Tables']['repairs']['Row'];
export type NewRepair = Omit<Database['public']['Tables']['repairs']['Insert'], 'user_id'>;
export type RepairUpdate = Database['public']['Tables']['repairs']['Update'];

export function useRepairs(equipmentId?: string) {
  const { session } = useAuth();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchRepairs();
    }
  }, [session, equipmentId]);

  // Subscribe to changes
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('repairs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'repairs',
        filter: equipmentId ? `equipment_id=eq.${equipmentId}` : undefined
      }, () => {
        fetchRepairs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, equipmentId]);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('repairs')
        .select('*')
        .order('repair_date', { ascending: false });

      if (equipmentId) {
        query = query.eq('equipment_id', equipmentId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setRepairs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addRepair = async (newRepair: NewRepair) => {
    if (!session?.user.id) throw new Error('User not authenticated');

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('repairs')
        .insert([{
          ...newRepair,
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state optimistically
      setRepairs(prev => [data!, ...prev]);

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateRepair = async (id: string, updates: RepairUpdate) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('repairs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state optimistically
      setRepairs(prev => prev.map(repair => repair.id === id ? data! : repair));

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteRepair = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('repairs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      setRepairs(prev => prev.filter(repair => repair.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    repairs,
    loading,
    error,
    addRepair,
    updateRepair,
    deleteRepair,
    refresh: fetchRepairs,
  };
}