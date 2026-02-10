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
      agent_profiles: {
        Row: {
          agency_name: string | null
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          countries_operating: string[] | null
          created_at: string | null
          id: string
          license_number: string | null
          specializations: string[] | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          agency_name?: string | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          countries_operating?: string[] | null
          created_at?: string | null
          id?: string
          license_number?: string | null
          specializations?: string[] | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          agency_name?: string | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          countries_operating?: string[] | null
          created_at?: string | null
          id?: string
          license_number?: string | null
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_id: string
          created_at: string | null
          id: string
          message: string | null
          opportunity_id: string
          status: string | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          id?: string
          message?: string | null
          opportunity_id: string
          status?: string | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          id?: string
          message?: string | null
          opportunity_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_profiles: {
        Row: {
          city: string | null
          club_name: string
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string
          league: string | null
          logo_url: string | null
          state: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          city?: string | null
          club_name: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          league?: string | null
          logo_url?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          city?: string | null
          club_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          league?: string | null
          logo_url?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profiles: {
        Row: {
          achievements: Json | null
          availability_status: string | null
          bio: string | null
          created_at: string | null
          current_club: string | null
          experience_years: number | null
          id: string
          license_level: string | null
          nationality: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          current_club?: string | null
          experience_years?: number | null
          id?: string
          license_level?: string | null
          nationality?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          current_club?: string | null
          experience_years?: number | null
          id?: string
          license_level?: string | null
          nationality?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          contract_type: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string
          position: string
          posted_by: string
          requirements: string | null
          salary_range: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          contract_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          position: string
          posted_by: string
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          contract_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          position?: string
          posted_by?: string
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_requests: {
        Row: {
          company_name: string
          contact_name: string
          created_at: string | null
          email: string
          id: string
          message: string
          partnership_type: string
          phone: string
          status: string | null
        }
        Insert: {
          company_name: string
          contact_name: string
          created_at?: string | null
          email: string
          id?: string
          message: string
          partnership_type: string
          phone: string
          status?: string | null
        }
        Update: {
          company_name?: string
          contact_name?: string
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          partnership_type?: string
          phone?: string
          status?: string | null
        }
        Relationships: []
      }
      player_profiles: {
        Row: {
          achievements: Json | null
          availability_status: string | null
          bio: string | null
          created_at: string | null
          current_club: string | null
          experience_years: number | null
          height: number | null
          id: string
          nationality: string | null
          photos: Json | null
          position: string | null
          preferred_hand: string | null
          updated_at: string | null
          user_id: string
          videos: Json | null
          weight: number | null
        }
        Insert: {
          achievements?: Json | null
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          current_club?: string | null
          experience_years?: number | null
          height?: number | null
          id?: string
          nationality?: string | null
          photos?: Json | null
          position?: string | null
          preferred_hand?: string | null
          updated_at?: string | null
          user_id: string
          videos?: Json | null
          weight?: number | null
        }
        Update: {
          achievements?: Json | null
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          current_club?: string | null
          experience_years?: number | null
          height?: number | null
          id?: string
          nationality?: string | null
          photos?: Json | null
          position?: string | null
          preferred_hand?: string | null
          updated_at?: string | null
          user_id?: string
          videos?: Json | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          data_sharing_consent: boolean | null
          email: string | null
          full_name: string
          id: string
          is_premium: boolean | null
          phone: string | null
          premium_expires_at: string | null
          privacy_accepted: boolean | null
          stripe_customer_id: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          data_sharing_consent?: boolean | null
          email?: string | null
          full_name: string
          id: string
          is_premium?: boolean | null
          phone?: string | null
          premium_expires_at?: string | null
          privacy_accepted?: boolean | null
          stripe_customer_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          data_sharing_consent?: boolean | null
          email?: string | null
          full_name?: string
          id?: string
          is_premium?: boolean | null
          phone?: string | null
          premium_expires_at?: string | null
          privacy_accepted?: boolean | null
          stripe_customer_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "moderator" | "user"
      user_type: "player" | "club" | "agent" | "coach"
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
      app_role: ["admin", "moderator", "user"],
      user_type: ["player", "club", "agent", "coach"],
    },
  },
} as const
