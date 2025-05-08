export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      equipment: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          year: number
          status: 'Good' | 'Fair' | 'Poor'
          image_url: string | null
          purchase_date: string
          purchase_price: number
          vin_number: string | null
          license_plate: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          year: number
          status: 'Good' | 'Fair' | 'Poor'
          image_url?: string | null
          purchase_date: string
          purchase_price: number
          vin_number?: string | null
          license_plate?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          year?: number
          status?: 'Good' | 'Fair' | 'Poor'
          image_url?: string | null
          purchase_date?: string
          purchase_price?: number
          vin_number?: string | null
          license_plate?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_records: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          title: string
          description: string | null
          status: 'upcoming' | 'overdue' | 'completed'
          due_date: string
          completed_date: string | null
          cost: number
          odometer_reading: number | null
          service_provider: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          user_id: string
          title: string
          description?: string | null
          status: 'upcoming' | 'overdue' | 'completed'
          due_date: string
          completed_date?: string | null
          cost: number
          odometer_reading?: number | null
          service_provider?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'upcoming' | 'overdue' | 'completed'
          due_date?: string
          completed_date?: string | null
          cost?: number
          odometer_reading?: number | null
          service_provider?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      costs: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          category: 'maintenance' | 'repair' | 'upgrade' | 'fuel' | 'other'
          amount: number
          date: string
          description: string
          receipt_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          user_id: string
          category: 'maintenance' | 'repair' | 'upgrade' | 'fuel' | 'other'
          amount: number
          date: string
          description: string
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          user_id?: string
          category?: 'maintenance' | 'repair' | 'upgrade' | 'fuel' | 'other'
          amount?: number
          date?: string
          description?: string
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}