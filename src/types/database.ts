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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'inventory_catalog_item_id_fkey'
            columns: ['catalog_item_id']
            isOneToOne: true
            referencedRelation: 'catalog_items'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: 'transactions_catalog_item_id_fkey'
            columns: ['catalog_item_id']
            isOneToOne: false
            referencedRelation: 'catalog_items'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: []
      }
    }
    Functions: {
      increment_stock: {
        Args: { catalog_item_id: string; delta: number }
        Returns: undefined
      }
      decrement_stock: {
        Args: { catalog_item_id: string; delta: number }
        Returns: undefined
      }
    }
  }
}

export type CatalogItem = Database['public']['Tables']['catalog_items']['Row']
export type Inventory = Database['public']['Tables']['inventory']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type PublicInventoryItem = Database['public']['Views']['public_inventory']['Row']
