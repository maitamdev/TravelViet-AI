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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_plan_versions: {
        Row: {
          created_at: string
          id: string
          plan_json: Json
          reason: string | null
          trip_id: string
          version_no: number
        }
        Insert: {
          created_at?: string
          id?: string
          plan_json: Json
          reason?: string | null
          trip_id: string
          version_no: number
        }
        Update: {
          created_at?: string
          id?: string
          plan_json?: Json
          reason?: string | null
          trip_id?: string
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_plan_versions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_bookmarks: {
        Row: {
          created_at: string
          id: string
          public_itinerary_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          public_itinerary_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          public_itinerary_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_bookmarks_public_itinerary_id_fkey"
            columns: ["public_itinerary_id"]
            isOneToOne: false
            referencedRelation: "public_itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          public_itinerary_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          public_itinerary_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          public_itinerary_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_reviews_public_itinerary_id_fkey"
            columns: ["public_itinerary_id"]
            isOneToOne: false
            referencedRelation: "public_itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          budget_max_vnd: number | null
          budget_min_vnd: number | null
          created_at: string
          crowd_tolerance: number | null
          full_name: string | null
          home_city: string | null
          id: string
          travel_styles: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          budget_max_vnd?: number | null
          budget_min_vnd?: number | null
          created_at?: string
          crowd_tolerance?: number | null
          full_name?: string | null
          home_city?: string | null
          id: string
          travel_styles?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          budget_max_vnd?: number | null
          budget_min_vnd?: number | null
          created_at?: string
          crowd_tolerance?: number | null
          full_name?: string | null
          home_city?: string | null
          id?: string
          travel_styles?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      public_itineraries: {
        Row: {
          id: string
          likes_count: number | null
          owner_id: string
          published_at: string
          saves_count: number | null
          summary: string | null
          tags: string[] | null
          title: string
          trip_id: string
        }
        Insert: {
          id?: string
          likes_count?: number | null
          owner_id: string
          published_at?: string
          saves_count?: number | null
          summary?: string | null
          tags?: string[] | null
          title: string
          trip_id: string
        }
        Update: {
          id?: string
          likes_count?: number | null
          owner_id?: string
          published_at?: string
          saves_count?: number | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_itineraries_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_itineraries_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          resolved_at: string | null
          status: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          resolved_at?: string | null
          status?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          resolved_at?: string | null
          status?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_comments: {
        Row: {
          content: string
          created_at: string
          day_id: string | null
          id: string
          item_id: string | null
          trip_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          day_id?: string | null
          id?: string
          item_id?: string | null
          trip_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          day_id?: string | null
          id?: string
          item_id?: string | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_comments_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_comments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "trip_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_comments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_costs: {
        Row: {
          amount_vnd: number
          category: string
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          trip_id: string
        }
        Insert: {
          amount_vnd?: number
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          trip_id: string
        }
        Update: {
          amount_vnd?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_costs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_costs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_days: {
        Row: {
          created_at: string
          date: string | null
          day_index: number
          id: string
          summary: string | null
          trip_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          day_index: number
          id?: string
          summary?: string | null
          trip_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          day_index?: number
          id?: string
          summary?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_items: {
        Row: {
          created_at: string
          crowd_level_pred: number | null
          description: string | null
          end_time: string | null
          estimated_cost_vnd: number | null
          id: string
          is_hidden_gem: boolean | null
          item_type: string | null
          lat: number | null
          lng: number | null
          location_name: string | null
          sort_order: number | null
          source_confidence: string | null
          start_time: string | null
          title: string
          trip_day_id: string
        }
        Insert: {
          created_at?: string
          crowd_level_pred?: number | null
          description?: string | null
          end_time?: string | null
          estimated_cost_vnd?: number | null
          id?: string
          is_hidden_gem?: boolean | null
          item_type?: string | null
          lat?: number | null
          lng?: number | null
          location_name?: string | null
          sort_order?: number | null
          source_confidence?: string | null
          start_time?: string | null
          title: string
          trip_day_id: string
        }
        Update: {
          created_at?: string
          crowd_level_pred?: number | null
          description?: string | null
          end_time?: string | null
          estimated_cost_vnd?: number | null
          id?: string
          is_hidden_gem?: boolean | null
          item_type?: string | null
          lat?: number | null
          lng?: number | null
          location_name?: string | null
          sort_order?: number | null
          source_confidence?: string | null
          start_time?: string | null
          title?: string
          trip_day_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_items_trip_day_id_fkey"
            columns: ["trip_day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_members: {
        Row: {
          id: string
          joined_at: string
          role: string | null
          trip_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string | null
          trip_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          due_at: string | null
          id: string
          status: string | null
          title: string
          trip_id: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          status?: string | null
          title: string
          trip_id: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          status?: string | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_tasks_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_votes: {
        Row: {
          created_at: string
          id: string
          target_id: string
          target_type: string
          trip_id: string
          user_id: string
          vote_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          target_id: string
          target_type: string
          trip_id: string
          user_id: string
          vote_value: number
        }
        Update: {
          created_at?: string
          id?: string
          target_id?: string
          target_type?: string
          trip_id?: string
          user_id?: string
          vote_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "trip_votes_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          destination_provinces: string[] | null
          end_date: string | null
          id: string
          mode: string | null
          owner_id: string
          share_slug: string | null
          start_date: string | null
          status: string | null
          title: string
          total_budget_vnd: number | null
          travelers_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_provinces?: string[] | null
          end_date?: string | null
          id?: string
          mode?: string | null
          owner_id: string
          share_slug?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          total_budget_vnd?: number | null
          travelers_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_provinces?: string[] | null
          end_date?: string | null
          id?: string
          mode?: string | null
          owner_id?: string
          share_slug?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          total_budget_vnd?: number | null
          travelers_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_trip_leader_or_owner: { Args: { p_trip_id: string }; Returns: boolean }
      is_trip_member: { Args: { p_trip_id: string }; Returns: boolean }
      is_trip_owner: { Args: { p_trip_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
