export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      choices: {
        Row: {
          created_at: string;
          dish_id: string;
          user_id: string;
          room_id: string;
        };
        Insert: {
          created_at?: string;
          dish_id: string;
          user_id: string;
          room_id: string;
        };
        Update: {
          created_at?: string;
          dish_id?: string;
          user_id?: string;
          room_id?: string;
        };
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          display_name: string | null;
          email: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          image_url?: string | null;
          display_name?: string | null;
          email: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          display_name?: string | null;
          email?: string;
        };
      };
      passwords: {
        Row: {
          room_id: string;
          password: string;
        };
        Insert: {
          room_id: string;
          password: string;
        };
        Update: {
          room_id?: string;
          password?: string;
        };
      };
      rooms: {
        Row: {
          id: string;
          created_at: string;
          owner_id: string;
          name: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          owner_id: string;
          name: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          owner_id?: string;
          name?: string;
        };
      };
      guests: {
        Row: {
          created_at: string | null;
          user_id: string;
          room_id: string;
        };
        Insert: {
          created_at?: string | null;
          user_id: string;
          room_id: string;
        };
        Update: {
          created_at?: string | null;
          user_id?: string;
          room_id?: string;
        };
      };
      dishes: {
        Row: {
          id: string;
          created_at: string;
          description: string | null;
          room_id: string;
          name: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          description?: string | null;
          room_id: string;
          name: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          description?: string | null;
          room_id?: string;
          name?: string;
        };
      };
    };
    Functions: {};
  };
}
