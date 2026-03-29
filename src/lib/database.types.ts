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
          credits: number
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          credits?: number
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          credits?: number
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      legal_personas: {
        Row: {
          id: string
          name_ar: string
          name_en: string
          description_ar: string
          description_en: string
          specialty: string
          icon: string
          system_prompt: string
          created_at: string
        }
        Insert: {
          id?: string
          name_ar: string
          name_en: string
          description_ar: string
          description_en: string
          specialty: string
          icon: string
          system_prompt: string
          created_at?: string
        }
        Update: {
          id?: string
          name_ar?: string
          name_en?: string
          description_ar?: string
          description_en?: string
          specialty?: string
          icon?: string
          system_prompt?: string
          created_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          user_id: string
          persona_id: string
          title: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          persona_id: string
          title: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          persona_id?: string
          title?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          consultation_id: string
          role: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          consultation_id: string
          role: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          consultation_id?: string
          role?: string
          content?: string
          created_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string
          created_at?: string
        }
      }
    }
  }
}
