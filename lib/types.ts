// SeekerLens Domain Types
// All types are readonly to enforce immutability at the type level

export type MediaType = 'photo' | 'video' | 'both';
export type BountyStatus = 'open' | 'fulfilled' | 'expired' | 'cancelled';
export type ContentSource = 'bounty' | 'marketplace';
export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'listed';
export type LicenseType = 'personal' | 'commercial' | 'exclusive';
export type NetworkType = 'devnet' | 'mainnet';
export type CategoryTag =
  | 'nature'
  | 'urban'
  | 'food'
  | 'portrait'
  | 'architecture'
  | 'travel';

export interface User {
  readonly id: string;
  readonly wallet_address: string;
  readonly username: string | null;
  readonly avatar_url: string | null;
  readonly bio: string | null;
  readonly created_at: string;
}

export interface Bounty {
  readonly id: string;
  readonly creator_id: string;
  readonly title: string;
  readonly description: string | null;
  readonly media_type: MediaType;
  readonly location_lat: number | null;
  readonly location_lng: number | null;
  readonly location_radius_km: number | null;
  readonly location_name: string | null;
  readonly reward_sol: number;
  readonly max_submissions: number;
  readonly deadline: string;
  readonly status: BountyStatus;
  readonly escrow_tx: string | null;
  readonly tags: readonly string[];
  readonly created_at: string;
  readonly creator?: User;
  readonly submissions_count?: number;
}

export interface Content {
  readonly id: string;
  readonly creator_id: string;
  readonly bounty_id: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly media_url: string;
  readonly thumbnail_url: string | null;
  readonly media_type: 'photo' | 'video';
  readonly location_lat: number | null;
  readonly location_lng: number | null;
  readonly location_name: string | null;
  readonly nft_mint_address: string | null;
  readonly license_price_personal: number | null;
  readonly license_price_commercial: number | null;
  readonly license_price_exclusive: number | null;
  readonly is_exclusive_sold: boolean;
  readonly source: ContentSource;
  readonly status: ContentStatus;
  readonly tags: readonly string[];
  readonly likes_count: number;
  readonly created_at: string;
  readonly creator?: User;
}

export interface License {
  readonly id: string;
  readonly content_id: string;
  readonly buyer_id: string;
  readonly license_type: LicenseType;
  readonly price_sol: number;
  readonly tx_signature: string;
  readonly purchased_at: string;
}
