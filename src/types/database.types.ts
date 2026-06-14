export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          username: string | null;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          wallet_address: string | null;
          cover_url: string | null;
          is_verified: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          wallet_address?: string | null;
          cover_url?: string | null;
          is_verified?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          username?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          wallet_address?: string | null;
          cover_url?: string | null;
          is_verified?: boolean;
        };
      };
      posts: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          content: string;
          image_url: string | null;
          likes_count: number;
          comments_count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          content: string;
          image_url?: string | null;
          likes_count?: number;
          comments_count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          content?: string;
          image_url?: string | null;
          likes_count?: number;
          comments_count?: number;
          updated_at?: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          created_at: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          post_id?: string;
          user_id?: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          created_at: string;
          post_id: string;
          user_id: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          post_id: string;
          user_id: string;
          content: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          updated_at?: string;
        };
      };
      followers: {
        Row: {
          id: string;
          created_at: string;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          follower_id: string;
          following_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          type: "like" | "comment" | "follow" | "mention";
          actor_id: string;
          post_id: string | null;
          content: string | null;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          type: "like" | "comment" | "follow" | "mention";
          actor_id: string;
          post_id?: string | null;
          content?: string | null;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          type?: "like" | "comment" | "follow" | "mention";
          actor_id?: string;
          post_id?: string | null;
          content?: string | null;
          is_read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
