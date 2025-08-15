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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      campaign: {
        Row: {
          created_at: string
          description: string | null
          game: number
          gm: number
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          game: number
          gm: number
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          game?: number
          gm?: number
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_game_fkey"
            columns: ["game"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_gm_fkey"
            columns: ["gm"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
        ]
      }
      event: {
        Row: {
          created_at: string
          date: string
          end: string
          id: number
          location: string
          start: string
        }
        Insert: {
          created_at?: string
          date: string
          end: string
          id?: number
          location: string
          start: string
        }
        Update: {
          created_at?: string
          date?: string
          end?: string
          id?: number
          location?: string
          start?: string
        }
        Relationships: []
      }
      game: {
        Row: {
          created_at: string
          description: string | null
          id: number
          illustration: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          illustration: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          illustration?: string
          name?: string
        }
        Relationships: []
      }
      member: {
        Row: {
          authorized: boolean
          avatar: string | null
          created_at: string
          discord_id: string
          handle: string
          id: number
        }
        Insert: {
          authorized?: boolean
          avatar?: string | null
          created_at?: string
          discord_id: string
          handle: string
          id?: number
        }
        Update: {
          authorized?: boolean
          avatar?: string | null
          created_at?: string
          discord_id?: string
          handle?: string
          id?: number
        }
        Relationships: []
      }
      os: {
        Row: {
          created_at: string
          description: string | null
          event: number | null
          game: number
          gm: number
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event?: number | null
          game: number
          gm: number
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event?: number | null
          game?: number
          gm?: number
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_game_fkey"
            columns: ["game"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_gm_fkey"
            columns: ["gm"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
        ]
      }
      registration: {
        Row: {
          campaign: number | null
          confirmation: boolean
          created_at: string
          id: number
          member: number
          os: number | null
        }
        Insert: {
          campaign?: number | null
          confirmation: boolean
          created_at?: string
          id?: number
          member: number
          os?: number | null
        }
        Update: {
          campaign?: number | null
          confirmation?: boolean
          created_at?: string
          id?: number
          member?: number
          os?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_campaign_fkey"
            columns: ["campaign"]
            isOneToOne: false
            referencedRelation: "campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_member_fkey"
            columns: ["member"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_os_fkey"
            columns: ["os"]
            isOneToOne: false
            referencedRelation: "os"
            referencedColumns: ["id"]
          },
        ]
      }
      session: {
        Row: {
          campaign: number
          created_at: string
          event: number
          id: number
        }
        Insert: {
          campaign: number
          created_at?: string
          event: number
          id?: number
        }
        Update: {
          campaign?: number
          created_at?: string
          event?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_campaign_fkey"
            columns: ["campaign"]
            isOneToOne: false
            referencedRelation: "campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
        ]
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
