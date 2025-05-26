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
          year: number | null
          status: 'Good' | 'Fair' | 'Poor'
          image_url: string | null
          purchase_date: string | null
          purchase_price: number | null
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
          year?: number | null
          status: 'Good' | 'Fair' | 'Poor'
          image_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
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
          year?: number | null
          status?: 'Good' | 'Fair' | 'Poor'
          image_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
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
      repairs: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          title: string
          description: string | null
          repair_date: string
          completed_date: string | null
          cost: number
          parts_cost: number | null
          labor_cost: number | null
          status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'
          service_provider: string | null
          parts_replaced: string[] | null
          diagnosis: string | null
          resolution: string | null
          odometer_reading: number | null
          warranty_claim: boolean
          warranty_details: string | null
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
          repair_date: string
          completed_date?: string | null
          cost: number
          parts_cost?: number | null
          labor_cost?: number | null
          status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'
          service_provider?: string | null
          parts_replaced?: string[] | null
          diagnosis?: string | null
          resolution?: string | null
          odometer_reading?: number | null
          warranty_claim?: boolean
          warranty_details?: string | null
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
          repair_date?: string
          completed_date?: string | null
          cost?: number
          parts_cost?: number | null
          labor_cost?: number | null
          status?: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'
          service_provider?: string | null
          parts_replaced?: string[] | null
          diagnosis?: string | null
          resolution?: string | null
          odometer_reading?: number | null
          warranty_claim?: boolean
          warranty_details?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      upgrades: {
        Row: {
          id: string
          equipment_id: string
          user_id: string
          name: string
          manufacturer: string
          description: string | null
          category: 'Performance' | 'Appearance' | 'Utility' | 'Safety' | 'Other'
          status: 'Installed' | 'Planned' | 'Removed'
          install_date: string | null
          cost: number
          value_increase: number
          image_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          user_id: string
          name: string
          manufacturer: string
          description?: string | null
          category: 'Performance' | 'Appearance' | 'Utility' | 'Safety' | 'Other'
          status: 'Installed' | 'Planned' | 'Removed'
          install_date?: string | null
          cost: number
          value_increase?: number
          image_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          user_id?: string
          name?: string
          manufacturer?: string
          description?: string | null
          category?: 'Performance' | 'Appearance' | 'Utility' | 'Safety' | 'Other'
          status?: 'Installed' | 'Planned' | 'Removed'
          install_date?: string | null
          cost?: number
          value_increase?: number
          image_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
}