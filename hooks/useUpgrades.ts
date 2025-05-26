import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

export type Upgrade = Database['public']['Tables']['upgrades']['Row'];
export type NewUpgrade = Omit<Database['public']['Tables']['upgrades']['Insert'], 'user_id'>;
export type UpgradeUpdate = Database['public']['Tables']['upgrades']['Update'];

export function useUpgrades(equipmentId?: string) {
  const { session } = useAuth();
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchUpgrades();
    }
  }, [session, equipmentId]);

  // Subscribe to changes
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('upgrades_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'upgrades',
        filter: equipmentId ? `equipment_id=eq.${equipmentId}` : undefined
      }, (payload) => {
        console.log('Upgrade change detected:', payload.eventType);
        
        switch (payload.eventType) {
          case 'INSERT':
            setUpgrades(prev => [payload.new as Upgrade, ...prev]);
            break;
          case 'UPDATE':
            setUpgrades(prev => 
              prev.map(item => 
                item.id === payload.new.id ? (payload.new as Upgrade) : item
              )
            );
            break;
          case 'DELETE':
            setUpgrades(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
            break;
          default:
            fetchUpgrades();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, equipmentId]);

  const fetchUpgrades = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('upgrades')
        .select('*')
        .order('created_at', { ascending: false });

      if (equipmentId) {
        query = query.eq('equipment_id', equipmentId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setUpgrades(data || []);
    } catch (err) {
      console.error('Error fetching upgrades:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session?.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('upgrade-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('upgrade-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      throw new Error('Failed to upload image');
    }
  };

  const addUpgrade = async (newUpgrade: NewUpgrade & { imageFile?: File }) => {
    if (!session?.user.id) throw new Error('User not authenticated');

    try {
      setError(null);

      let imageUrl = null;
      if (newUpgrade.imageFile) {
        try {
          imageUrl = await uploadImage(newUpgrade.imageFile);
        } catch (err) {
          console.error('Failed to upload image:', err);
        }
      }

      // Remove imageFile from the upgrade data before inserting
      const { imageFile, ...upgradeData } = newUpgrade;

      const { data, error: insertError } = await supabase
        .from('upgrades')
        .insert([{
          ...upgradeData,
          user_id: session.user.id,
          image_url: imageUrl,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state optimistically
      setUpgrades(prev => [data!, ...prev]);

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateUpgrade = async (id: string, updates: UpgradeUpdate & { imageFile?: File }) => {
    try {
      setError(null);

      let imageUrl;
      if (updates.imageFile) {
        imageUrl = await uploadImage(updates.imageFile);
        updates.image_url = imageUrl;
      }

      // Remove imageFile from updates before sending to database
      const { imageFile, ...updateData } = updates;

      const { data, error: updateError } = await supabase
        .from('upgrades')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state optimistically
      setUpgrades(prev => prev.map(item => item.id === id ? data! : item));

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteUpgrade = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('upgrades')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      setUpgrades(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    upgrades,
    loading,
    error,
    addUpgrade,
    updateUpgrade,
    deleteUpgrade,
    refresh: fetchUpgrades,
  };
}