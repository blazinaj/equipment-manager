import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

export type MaintenanceRecord = Database['public']['Tables']['maintenance_records']['Row'];
export type NewMaintenanceRecord = Omit<Database['public']['Tables']['maintenance_records']['Insert'], 'user_id'>;
export type MaintenanceUpdate = Database['public']['Tables']['maintenance_records']['Update'];

export function useMaintenance(equipmentId?: string) {
  const { session } = useAuth();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchRecords();
    }
  }, [session, equipmentId]);

  // Subscribe to changes
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('maintenance_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'maintenance_records',
        filter: equipmentId ? `equipment_id=eq.${equipmentId}` : undefined
      }, () => {
        fetchRecords();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, equipmentId]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('maintenance_records')
        .select('*')
        .order('due_date', { ascending: true });

      if (equipmentId) {
        query = query.eq('equipment_id', equipmentId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (newRecord: NewMaintenanceRecord) => {
    if (!session?.user.id) throw new Error('User not authenticated');

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('maintenance_records')
        .insert([{
          ...newRecord,
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state optimistically
      setRecords(prev => [data!, ...prev].sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ));

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateRecord = async (id: string, updates: MaintenanceUpdate) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('maintenance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state optimistically
      setRecords(prev => prev.map(record => record.id === id ? data! : record)
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      );

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    records,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    refresh: fetchRecords,
  };
}