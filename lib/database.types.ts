// Supabase typed helpers matching the schema in docs/supabase-schema.sql
// These types mirror lib/types.ts but are structured for Supabase query results

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    } & {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          wallet_address?: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
        };
      };
      bounties: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          media_type: 'photo' | 'video' | 'both';
          location_lat: number | null;
          location_lng: number | null;
          location_radius_km: number | null;
          location_name: string | null;
          reward_sol: number;
          max_submissions: number;
          deadline: string;
          status: 'open' | 'fulfilled' | 'expired' | 'cancelled';
          escrow_tx: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          media_type?: 'photo' | 'video' | 'both';
          location_lat?: number | null;
          location_lng?: number | null;
          location_radius_km?: number | null;
          location_name?: string | null;
          reward_sol: number;
          max_submissions?: number;
          deadline: string;
          status?: 'open' | 'fulfilled' | 'expired' | 'cancelled';
          escrow_tx?: string | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: 'open' | 'fulfilled' | 'expired' | 'cancelled';
          escrow_tx?: string | null;
        };
      };
      content: {
        Row: {
          id: string;
          creator_id: string;
          bounty_id: string | null;
          title: string;
          description: string | null;
          media_url: string;
          thumbnail_url: string | null;
          media_type: 'photo' | 'video';
          location_lat: number | null;
          location_lng: number | null;
          location_name: string | null;
          nft_mint_address: string | null;
          license_price_personal: number | null;
          license_price_commercial: number | null;
          license_price_exclusive: number | null;
          is_exclusive_sold: boolean;
          source: 'bounty' | 'marketplace';
          status: 'pending' | 'approved' | 'rejected' | 'listed';
          tags: string[];
          likes_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          bounty_id?: string | null;
          title: string;
          description?: string | null;
          media_url: string;
          thumbnail_url?: string | null;
          media_type?: 'photo' | 'video';
          location_lat?: number | null;
          location_lng?: number | null;
          location_name?: string | null;
          nft_mint_address?: string | null;
          license_price_personal?: number | null;
          license_price_commercial?: number | null;
          license_price_exclusive?: number | null;
          is_exclusive_sold?: boolean;
          source: 'bounty' | 'marketplace';
          status?: 'pending' | 'approved' | 'rejected' | 'listed';
          tags?: string[];
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          nft_mint_address?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'listed';
          is_exclusive_sold?: boolean;
          likes_count?: number;
        };
      };
      licenses: {
        Row: {
          id: string;
          content_id: string;
          buyer_id: string;
          license_type: 'personal' | 'commercial' | 'exclusive';
          price_sol: number;
          tx_signature: string;
          purchased_at: string;
        };
        Insert: {
          id?: string;
          content_id: string;
          buyer_id: string;
          license_type: 'personal' | 'commercial' | 'exclusive';
          price_sol: number;
          tx_signature: string;
          purchased_at?: string;
        };
        Update: never;
      };
    };
  };
}
