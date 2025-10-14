export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string | null
          cost_level: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_signature: boolean | null
          props: Json | null
          tags: string[] | null
          title: string
        }
        Insert: {
          category?: string | null
          cost_level?: string | null
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          is_signature?: boolean | null
          props?: Json | null
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string | null
          cost_level?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_signature?: boolean | null
          props?: Json | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          properties: Json | null
          trip_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          properties?: Json | null
          trip_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          properties?: Json | null
          trip_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          assignee_id: string | null
          assignee_role: string | null
          created_at: string
          description: string | null
          done: boolean | null
          due_date: string | null
          id: string
          item_order: number
          title: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          assignee_role?: string | null
          created_at?: string
          description?: string | null
          done?: boolean | null
          due_date?: string | null
          id?: string
          item_order: number
          title: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          assignee_role?: string | null
          created_at?: string
          description?: string | null
          done?: boolean | null
          due_date?: string | null
          id?: string
          item_order?: number
          title?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string | null
          expense_date: string
          id: string
          payer_id: string | null
          settled: boolean | null
          trip_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          payer_id?: string | null
          settled?: boolean | null
          trip_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          payer_id?: string | null
          settled?: boolean | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_blocks: {
        Row: {
          activity_id: string | null
          block_order: number
          created_at: string
          end_time: string
          id: string
          location: string | null
          notes: string | null
          start_time: string
          title: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          activity_id?: string | null
          block_order: number
          created_at?: string
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          start_time: string
          title: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          activity_id?: string | null
          block_order?: number
          created_at?: string
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          start_time?: string
          title?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_blocks_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_blocks_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget_level: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          end_date: string
          goal_tags: string[] | null
          id: string
          participant_count: number | null
          share_token: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_level?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          end_date: string
          goal_tags?: string[] | null
          id?: string
          participant_count?: number | null
          share_token?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_level?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          end_date?: string
          goal_tags?: string[] | null
          id?: string
          participant_count?: number | null
          share_token?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          anon_uuid: string | null
          created_at: string
          email: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          anon_uuid?: string | null
          created_at?: string
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          anon_uuid?: string | null
          created_at?: string
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
