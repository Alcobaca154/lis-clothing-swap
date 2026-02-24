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
      catalog_items: {
        Row: {
          id: string
          category: string
          item_name: string
          gender: string
          size: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          item_name: string
          gender: string
          size: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          item_name?: string
          gender?: string
          size?: string
          is_active?: boolean
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          catalog_item_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          id?: string
          catalog_item_id: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          id?: string
          catalog_item_id?: string
          quantity?: number
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          catalog_item_id: string
          staff_email: string
          quantity_delta: number
          transaction_type: 'donation' | 'taken'
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          catalog_item_id: string
          staff_email: string
          quantity_delta: number
          transaction_type: 'donation' | 'taken'
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          catalog_item_id?: string
          staff_email?: string
          quantity_delta?: number
          transaction_type?: 'donation' | 'taken'
          note?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      public_inventory: {
        Row: {
          id: string
          catalog_item_id: string
          category: string
          item_name: string
          gender: string
          size: string
          is_active: boolean
          quantity: number
        }
      }
    }
    Functions: {
      increment_stock: {
        Args: { catalog_item_id: string; delta: number }
        Returns: void
      }
      decrement_stock: {
        Args: { catalog_item_id: string; delta: number }
        Returns: void
      }
    }
  }
}

export type CatalogItem = Database['public']['Tables']['catalog_items']['Row']
export type Inventory = Database['public']['Tables']['inventory']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type PublicInventoryItem = Database['public']['Views']['public_inventory']['Row']
