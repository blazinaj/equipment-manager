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

    // Create optimistic record
    const optimisticRecord: MaintenanceRecord = {
      id: crypto.randomUUID(),
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...newRecord,
    };

    setRecords(prev => [optimisticRecord, ...prev]);

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

      setRecords(prev => 
        prev.map(record => 
          record.id === optimisticRecord.id ? data! : record
        )
      );

      return data!;
    } catch (err) {
      setRecords(prev => 
        prev.filter(record => record.id !== optimisticRecord.id)
      );
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateRecord = async (id: string, updates: MaintenanceUpdate) => {
    const originalRecord = records.find(record => record.id === id);
    if (!originalRecord) throw new Error('Maintenance record not found');

    setRecords(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, ...updates, updated_at: new Date().toISOString() }
          : record
      )
    );

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('maintenance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setRecords(prev => prev.map(record => record.id === id ? data! : record));
      return data!;
    } catch (err) {
      setRecords(prev => 
        prev.map(record => 
          record.id === id ? originalRecord : record
        )
      );
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    const deletedRecord = records.find(record => record.id === id);
    if (!deletedRecord) throw new Error('Maintenance record not found');

    setRecords(prev => prev.filter(record => record.id !== id));

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setRecords(prev => [...prev, deletedRecord]);
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