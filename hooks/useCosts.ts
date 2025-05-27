import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useRepairs } from './useRepairs';
import { useMaintenance } from './useMaintenance';
import { useUpgrades } from './useUpgrades';
import { useAuth } from './useAuth';

export type Cost = Database['public']['Tables']['costs']['Row'];
export type NewCost = Omit<Database['public']['Tables']['costs']['Insert'], 'user_id'>;
export type CostUpdate = Database['public']['Tables']['costs']['Update'];

export type AggregatedCost = {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: 'maintenance' | 'repair' | 'upgrade' | 'fuel' | 'other';
  equipment_id: string;
  source: 'maintenance' | 'repair' | 'upgrade' | 'cost';
};

export function useCosts(equipmentId?: string) {
  const { session } = useAuth();
  const [costs, setCosts] = useState<Cost[]>([]);
  const [aggregatedCosts, setAggregatedCosts] = useState<AggregatedCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get data from other hooks
  const { repairs, loading: repairsLoading } = useRepairs(equipmentId);
  const { records: maintenance, loading: maintenanceLoading } = useMaintenance(equipmentId);
  const { upgrades, loading: upgradesLoading } = useUpgrades(equipmentId);

  useEffect(() => {
    if (session) {
      fetchCosts();
    }
  }, [session, equipmentId]);

  // Aggregate costs whenever source data changes
  useEffect(() => {
    const allCosts: AggregatedCost[] = [
      // Direct costs
      ...costs.map(cost => ({
        id: cost.id,
        amount: cost.amount,
        date: cost.date,
        description: cost.description,
        category: cost.category,
        equipment_id: cost.equipment_id,
        source: 'cost' as const
      })),
      // Maintenance costs
      ...maintenance.map(record => ({
        id: record.id,
        amount: record.cost,
        date: record.completed_date || record.due_date,
        description: record.title,
        category: 'maintenance' as const,
        equipment_id: record.equipment_id,
        source: 'maintenance' as const
      })),
      // Repair costs
      ...repairs.map(repair => ({
        id: repair.id,
        amount: repair.cost,
        date: repair.completed_date || repair.repair_date,
        description: repair.title,
        category: 'repair' as const,
        equipment_id: repair.equipment_id,
        source: 'repair' as const
      })),
      // Upgrade costs
      ...upgrades.map(upgrade => ({
        id: upgrade.id,
        amount: upgrade.cost,
        date: upgrade.install_date || new Date().toISOString().split('T')[0],
        description: upgrade.name,
        category: 'upgrade' as const,
        equipment_id: upgrade.equipment_id,
        source: 'upgrade' as const
      }))
    ];

    // Sort by date descending
    allCosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setAggregatedCosts(allCosts);
  }, [costs, maintenance, repairs, upgrades]);

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
    aggregatedCosts,
    loading,
    isLoading: loading || repairsLoading || maintenanceLoading || upgradesLoading,
    error,
    addCost,
    updateCost,
    deleteCost,
    refresh: fetchCosts,
  };
}