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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      opportunities: {
        Row: {
          departamento: string | null
          entidad: string | null
          external_id: string
          fecha_cierre: string | null
          fecha_publicacion: string | null
          first_seen_at: string
          id: string
          modalidad: string | null
          moneda: string | null
          municipio: string | null
          objeto: string | null
          pliego_tipo: string | null
          pliego_tipo_confidence: number | null
          presupuesto: number | null
          raw: Json | null
          source: Database["public"]["Enums"]["opportunity_source"]
          updated_at: string
          url: string | null
        }
        Insert: {
          departamento?: string | null
          entidad?: string | null
          external_id: string
          fecha_cierre?: string | null
          fecha_publicacion?: string | null
          first_seen_at?: string
          id?: string
          modalidad?: string | null
          moneda?: string | null
          municipio?: string | null
          objeto?: string | null
          pliego_tipo?: string | null
          pliego_tipo_confidence?: number | null
          presupuesto?: number | null
          raw?: Json | null
          source: Database["public"]["Enums"]["opportunity_source"]
          updated_at?: string
          url?: string | null
        }
        Update: {
          departamento?: string | null
          entidad?: string | null
          external_id?: string
          fecha_cierre?: string | null
          fecha_publicacion?: string | null
          first_seen_at?: string
          id?: string
          modalidad?: string | null
          moneda?: string | null
          municipio?: string | null
          objeto?: string | null
          pliego_tipo?: string | null
          pliego_tipo_confidence?: number | null
          presupuesto?: number | null
          raw?: Json | null
          source?: Database["public"]["Enums"]["opportunity_source"]
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      opportunity_matches: {
        Row: {
          created_at: string
          dismissed_at: string | null
          id: string
          opportunity_id: string
          reasons: Json
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dismissed_at?: string | null
          id?: string
          opportunity_id: string
          reasons?: Json
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dismissed_at?: string | null
          id?: string
          opportunity_id?: string
          reasons?: Json
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_matches_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenders: {
        Row: {
          amount: string | null
          average: number | null
          created_at: string
          deadline: string | null
          entity: string | null
          file_name: string | null
          id: string
          item_notes: Json
          name: string
          notes: string | null
          opportunity_id: string | null
          recommendation: string | null
          risk_level: string | null
          scores: Json
          total: number | null
          updated_at: string
          user_id: string
          weighted: number | null
          weights: Json
        }
        Insert: {
          amount?: string | null
          average?: number | null
          created_at?: string
          deadline?: string | null
          entity?: string | null
          file_name?: string | null
          id?: string
          item_notes?: Json
          name: string
          notes?: string | null
          opportunity_id?: string | null
          recommendation?: string | null
          risk_level?: string | null
          scores?: Json
          total?: number | null
          updated_at?: string
          user_id: string
          weighted?: number | null
          weights?: Json
        }
        Update: {
          amount?: string | null
          average?: number | null
          created_at?: string
          deadline?: string | null
          entity?: string | null
          file_name?: string | null
          id?: string
          item_notes?: Json
          name?: string
          notes?: string | null
          opportunity_id?: string | null
          recommendation?: string | null
          risk_level?: string | null
          scores?: Json
          total?: number | null
          updated_at?: string
          user_id?: string
          weighted?: number | null
          weights?: Json
        }
        Relationships: [
          {
            foreignKeyName: "tenders_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile_criteria: {
        Row: {
          ciiu: string[]
          departamentos: string[]
          keywords: string[]
          monto_max: number | null
          monto_min: number | null
          pliegos_tipo: string[]
          sectors: string[]
          sheet_id: string | null
          sheet_range: string | null
          sources: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          ciiu?: string[]
          departamentos?: string[]
          keywords?: string[]
          monto_max?: number | null
          monto_min?: number | null
          pliegos_tipo?: string[]
          sectors?: string[]
          sheet_id?: string | null
          sheet_range?: string | null
          sources?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          ciiu?: string[]
          departamentos?: string[]
          keywords?: string[]
          monto_max?: number | null
          monto_min?: number | null
          pliegos_tipo?: string[]
          sectors?: string[]
          sheet_id?: string | null
          sheet_range?: string | null
          sources?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      opportunity_source: "secop_i" | "secop_ii" | "sheets_privados"
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
    Enums: {
      app_role: ["admin", "user"],
      opportunity_source: ["secop_i", "secop_ii", "sheets_privados"],
    },
  },
} as const
