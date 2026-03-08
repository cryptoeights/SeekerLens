import { supabase } from '../supabase';
import type { Content, ContentSource, ContentStatus } from '../types';

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

interface ContentFilters {
  readonly source?: ContentSource;
  readonly status?: ContentStatus;
}

// ---------------------------------------------------------------------------
// Create payload
// ---------------------------------------------------------------------------

interface CreateContentPayload {
  readonly creator_id: string;
  readonly bounty_id?: string | null;
  readonly title: string;
  readonly description: string | null;
  readonly media_url: string;
  readonly thumbnail_url?: string | null;
  readonly media_type: 'photo' | 'video';
  readonly location_lat: number | null;
  readonly location_lng: number | null;
  readonly location_name: string | null;
  readonly license_price_personal: number | null;
  readonly license_price_commercial: number | null;
  readonly license_price_exclusive: number | null;
  readonly nft_mint_address?: string | null;
  readonly source: ContentSource;
  readonly tags: readonly string[];
}

// ---------------------------------------------------------------------------
// Update payload
// ---------------------------------------------------------------------------

interface UpdateContentPayload {
  readonly title?: string;
  readonly description?: string | null;
  readonly status?: ContentStatus;
  readonly nft_mint_address?: string | null;
  readonly is_exclusive_sold?: boolean;
  readonly license_price_personal?: number | null;
  readonly license_price_commercial?: number | null;
  readonly license_price_exclusive?: number | null;
  readonly tags?: readonly string[];
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch a list of content with optional source/status filters.
 * Includes creator info via a join on the users table.
 */
export async function getContent(
  filters?: ContentFilters,
): Promise<readonly Content[] | null> {
  let query = supabase
    .from('content')
    .select('*, creator:users!creator_id(*)')
    .order('created_at', { ascending: false });

  if (filters?.source) {
    query = query.eq('source', filters.source);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[SeekerLens] Failed to fetch content:', error.message);
    return null;
  }

  return data as unknown as readonly Content[];
}

/**
 * Fetch a single content item by id with creator info.
 */
export async function getContentById(
  id: string,
): Promise<Content | null> {
  const { data, error } = await supabase
    .from('content')
    .select('*, creator:users!creator_id(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to fetch content:', error.message);
    return null;
  }

  return data as unknown as Content;
}

/**
 * Insert a new content row.
 */
export async function createContent(
  payload: CreateContentPayload,
): Promise<Content | null> {
  const { data, error } = await supabase
    .from('content')
    .insert({
      creator_id: payload.creator_id,
      bounty_id: payload.bounty_id ?? null,
      title: payload.title,
      description: payload.description,
      media_url: payload.media_url,
      thumbnail_url: payload.thumbnail_url ?? null,
      media_type: payload.media_type,
      location_lat: payload.location_lat,
      location_lng: payload.location_lng,
      location_name: payload.location_name,
      nft_mint_address: payload.nft_mint_address ?? null,
      license_price_personal: payload.license_price_personal,
      license_price_commercial: payload.license_price_commercial,
      license_price_exclusive: payload.license_price_exclusive,
      source: payload.source,
      tags: [...payload.tags],
    })
    .select('*')
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to create content:', error.message);
    return null;
  }

  return data as unknown as Content;
}

/**
 * Update fields on an existing content row.
 */
export async function updateContent(
  id: string,
  updates: UpdateContentPayload,
): Promise<Content | null> {
  // Build a plain object from the readonly payload
  const updateData: Record<string, unknown> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.nft_mint_address !== undefined) updateData.nft_mint_address = updates.nft_mint_address;
  if (updates.is_exclusive_sold !== undefined) updateData.is_exclusive_sold = updates.is_exclusive_sold;
  if (updates.license_price_personal !== undefined) updateData.license_price_personal = updates.license_price_personal;
  if (updates.license_price_commercial !== undefined) updateData.license_price_commercial = updates.license_price_commercial;
  if (updates.license_price_exclusive !== undefined) updateData.license_price_exclusive = updates.license_price_exclusive;
  if (updates.tags !== undefined) updateData.tags = [...updates.tags];

  const { data, error } = await supabase
    .from('content')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to update content:', error.message);
    return null;
  }

  return data as unknown as Content;
}
