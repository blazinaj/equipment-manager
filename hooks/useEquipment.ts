import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type NewEquipment = Omit<Database['public']['Tables']['equipment']['Insert'], 'user_id'>;
export type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

// Default placeholder images for each equipment type
const DEFAULT_IMAGES = {
  'Vehicle': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
  'Motorcycle': 'https://images.pexels.com/photos/2393816/pexels-photo-2393816.jpeg',
  'Lawn & Garden': 'https://images.pexels.com/photos/589/garden-grass-lawn-mower.jpg',
  'Construction': 'https://images.pexels.com/photos/2590716/pexels-photo-2590716.jpeg',
  'Watercraft': 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg',
  'Recreational': 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg',
  'Other': 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg'
};

// Default placeholder background colors for each equipment type
const DEFAULT_COLORS = {
  'Vehicle': '#E2E8F0',
  'Motorcycle': '#FEE2E2',
  'Lawn & Garden': '#DCFCE7',
  'Construction': '#FEF9C3',
  'Watercraft': '#DBEAFE',
  'Recreational': '#F3E8FF',
  'Other': '#F1F5F9',
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

    // Subscribe to all equipment changes for the current user
    const channel = supabase
      .channel('equipment_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'equipment',
        filter: `user_id=eq.${session.user.id}`
      }, (payload) => {
        console.log('Equipment change detected:', payload.eventType);
        
        // Handle different types of changes
        switch (payload.eventType) {
          case 'INSERT':
            setEquipment(prev => [payload.new as Equipment, ...prev]);
            break;
          case 'UPDATE':
            setEquipment(prev => 
              prev.map(item => 
                item.id === payload.new.id ? (payload.new as Equipment) : item
              )
            );
            break;
          case 'DELETE':
            setEquipment(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
            break;
          default:
            // Fallback to fetching all data
            fetchEquipment();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user.id]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching equipment...');

      const { data, error: fetchError } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      console.log('Equipment fetched:', data?.length || 0, 'items');
      setEquipment(data || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
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

    console.log('Adding new equipment...');
    try {
      setError(null);
      await ensureUserProfile();

      let imageUrl = DEFAULT_IMAGES[newEquipment.type as keyof typeof DEFAULT_IMAGES] || DEFAULT_IMAGES.Other;

      if (newEquipment.imageFile) {
        try {
          imageUrl = await uploadImage(newEquipment.imageFile);
        } catch (err) {
          console.error('Failed to upload image:', err);
          imageUrl = null; // Use placeholder if image upload fails
        }
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
      console.log('Equipment added successfully');
      setEquipment(prev => [data!, ...prev]);

      return data!;
    } catch (err) {
      console.error('Error adding equipment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: EquipmentUpdate & { imageFile?: File }) => {
    try {
      setError(null);
      console.log('Updating equipment:', id);

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
      console.log('Equipment updated successfully');
      setEquipment(prev => prev.map(item => item.id === id ? data! : item));

      return data!;
    } catch (err) {
      console.error('Error updating equipment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      setError(null);
      console.log('Deleting equipment:', id);

      const { error: deleteError } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      console.log('Equipment deleted successfully');
      setEquipment(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting equipment:', err);
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
    defaultColors: DEFAULT_COLORS,
  };
}