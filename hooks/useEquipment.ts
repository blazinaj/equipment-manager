import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type NewEquipment = Omit<Database['public']['Tables']['equipment']['Insert'], 'user_id'>;
export type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

// Default images for each equipment type
const DEFAULT_IMAGES = {
  'Vehicle': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Motorcycle': 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Lawn & Garden': 'https://images.pexels.com/photos/589/garden-equipment-machine-lawn-mower.jpg?auto=compress&cs=tinysrgb&w=800',
  'Construction': 'https://images.pexels.com/photos/2058128/pexels-photo-2058128.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Watercraft': 'https://images.pexels.com/photos/673031/pexels-photo-673031.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Recreational': 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Other': 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800',
};

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

  // Subscribe to changes
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('equipment_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'equipment'
      }, () => {
        fetchEquipment();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        return;
      }

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
    } catch (err) {
      console.error('Error ensuring user profile:', err);
      throw err;
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session?.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('equipment-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('equipment-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      throw new Error('Failed to upload image');
    }
  };

  const addEquipment = async (newEquipment: NewEquipment & { imageFile?: File }) => {
    if (!session?.user.id) throw new Error('User not authenticated');

    try {
      setError(null);
      await ensureUserProfile();

      let imageUrl = DEFAULT_IMAGES[newEquipment.type as keyof typeof DEFAULT_IMAGES] || DEFAULT_IMAGES.Other;

      if (newEquipment.imageFile) {
        imageUrl = await uploadImage(newEquipment.imageFile);
      }

      // Remove imageFile from the equipment data before inserting
      const { imageFile, ...equipmentData } = newEquipment;

      const { data, error: insertError } = await supabase
        .from('equipment')
        .insert([{
          ...equipmentData,
          user_id: session.user.id,
          image_url: imageUrl,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state optimistically
      setEquipment(prev => [data!, ...prev]);

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: EquipmentUpdate & { imageFile?: File }) => {
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
        .from('equipment')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update local state optimistically
      setEquipment(prev => prev.map(item => item.id === id ? data! : item));

      return data!;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      setEquipment(prev => prev.filter(item => item.id !== id));
    } catch (err) {
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
    defaultImages: DEFAULT_IMAGES,
  };
}