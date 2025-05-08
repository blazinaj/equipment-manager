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

    // Create optimistic cost
    const optimisticCost: Cost = {
      id: crypto.randomUUID(),
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...newCost,
    };

    setCosts(prev => [optimisticCost, ...prev]);

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

      setCosts(prev => 
        prev.map(cost => 
          cost.id === optimisticCost.id ? data! : cost
        )
      );

      return data!;
    } catch (err) {
      setCosts(prev => 
        prev.filter(cost => cost.id !== optimisticCost.id)
      );
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateCost = async (id: string, updates: CostUpdate) => {
    const originalCost = costs.find(cost => cost.id === id);
    if (!originalCost) throw new Error('Cost not found');

    setCosts(prev => 
      prev.map(cost => 
        cost.id === id 
          ? { ...cost, ...updates, updated_at: new Date().toISOString() }
          : cost
      )
    );

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setCosts(prev => prev.map(cost => cost.id === id ? data! : cost));
      return data!;
    } catch (err) {
      setCosts(prev => 
        prev.map(cost => 
          cost.id === id ? originalCost : cost
        )
      );
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteCost = async (id: string) => {
    const deletedCost = costs.find(cost => cost.id === id);
    if (!deletedCost) throw new Error('Cost not found');

    setCosts(prev => prev.filter(cost => cost.id !== id));

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('costs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setCosts(prev => [...prev, deletedCost]);
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