export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bug_reports: {
        Row: {
          assignee: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          reporter: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          priority: string
          reporter: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          reporter?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_support_tickets: {
        Row: {
          area: string
          assignee: string | null
          created_at: string
          customer_name: string
          description: string
          eta: string | null
          id: string
          priority: string
          status: string
          updated_at: string
        }
        Insert: {
          area: string
          assignee?: string | null
          created_at?: string
          customer_name: string
          description: string
          eta?: string | null
          id?: string
          priority: string
          status: string
          updated_at?: string
        }
        Update: {
          area?: string
          assignee?: string | null
          created_at?: string
          customer_name?: string
          description?: string
          eta?: string | null
          id?: string
          priority?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          active_customer_support: number
          blocker_bugs: number
          created_at: string
          critical_bugs: number
          development_progress: number
          high_priority_bugs: number
          id: string
          total_bugs_fixed: number
          total_tickets_resolved: number
          updated_at: string
        }
        Insert: {
          active_customer_support?: number
          blocker_bugs?: number
          created_at?: string
          critical_bugs?: number
          development_progress?: number
          high_priority_bugs?: number
          id?: string
          total_bugs_fixed?: number
          total_tickets_resolved?: number
          updated_at?: string
        }
        Update: {
          active_customer_support?: number
          blocker_bugs?: number
          created_at?: string
          critical_bugs?: number
          development_progress?: number
          high_priority_bugs?: number
          id?: string
          total_bugs_fixed?: number
          total_tickets_resolved?: number
          updated_at?: string
        }
        Relationships: []
      }
      development_tickets: {
        Row: {
          actual_hours: number | null
          assignee: string | null
          created_at: string
          estimated_hours: number | null
          id: string
          priority: string
          requested_by: string
          status: string
          ticket_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assignee?: string | null
          created_at?: string
          estimated_hours?: number | null
          id?: string
          priority: string
          requested_by: string
          status: string
          ticket_id: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assignee?: string | null
          created_at?: string
          estimated_hours?: number | null
          id?: string
          priority?: string
          requested_by?: string
          status?: string
          ticket_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_fixes: {
        Row: {
          affected_systems: string[]
          created_at: string
          estimated_completion: string | null
          fix_description: string
          id: string
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_systems: string[]
          created_at?: string
          estimated_completion?: string | null
          fix_description: string
          id?: string
          severity: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_systems?: string[]
          created_at?: string
          estimated_completion?: string | null
          fix_description?: string
          id?: string
          severity?: string
          status?: string
          title?: string
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
