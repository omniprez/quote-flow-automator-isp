
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
      services: {
        Row: {
          id: string
          name: string
          type: 'DIA' | 'EBI' | 'Private WAN'
          description: string | null
          setup_fee: number
          min_contract_months: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'DIA' | 'EBI' | 'Private WAN'
          description?: string | null
          setup_fee?: number
          min_contract_months?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'DIA' | 'EBI' | 'Private WAN'
          description?: string | null
          setup_fee?: number
          min_contract_months?: number
          created_at?: string
          updated_at?: string
        }
      }
      bandwidth_options: {
        Row: {
          id: string
          service_id: string
          bandwidth: number
          unit: 'Mbps' | 'Gbps' | 'Tbps'
          monthly_price: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_id: string
          bandwidth: number
          unit?: 'Mbps' | 'Gbps' | 'Tbps'
          monthly_price: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          bandwidth?: number
          unit?: 'Mbps' | 'Gbps' | 'Tbps'
          monthly_price?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      additional_features: {
        Row: {
          id: string
          name: string
          description: string | null
          monthly_price: number
          one_time_fee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          monthly_price: number
          one_time_fee?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          monthly_price?: number
          one_time_fee?: number
          created_at?: string
          updated_at?: string
        }
      }
      service_features: {
        Row: {
          service_id: string
          feature_id: string
        }
        Insert: {
          service_id: string
          feature_id: string
        }
        Update: {
          service_id?: string
          feature_id?: string
        }
      }
      customers: {
        Row: {
          id: string
          company_name: string
          contact_name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          country: string
          industry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string
          industry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          contact_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string
          industry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          quote_number: string
          customer_id: string
          sales_rep_id: string
          quote_date: string
          expiration_date: string | null
          status: string
          total_one_time_cost: number
          total_monthly_cost: number
          contract_term_months: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number?: string
          customer_id: string
          sales_rep_id: string
          quote_date?: string
          expiration_date?: string | null
          status?: string
          total_one_time_cost?: number
          total_monthly_cost?: number
          contract_term_months?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_number?: string
          customer_id?: string
          sales_rep_id?: string
          quote_date?: string
          expiration_date?: string | null
          status?: string
          total_one_time_cost?: number
          total_monthly_cost?: number
          contract_term_months?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          content: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          content: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          content?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
