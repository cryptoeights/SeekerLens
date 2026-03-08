import { supabase } from '../supabase';
import type { Bounty, BountyStatus, MediaType } from '../types';

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

interface BountyFilters {
  readonly status?: BountyStatus;
}

// ---------------------------------------------------------------------------
// Create payload
// ---------------------------------------------------------------------------

interface CreateBountyPayload {
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
  readonly tags: readonly string[];
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch a list of bounties with optional status filter.
 * Includes creator info via a join on the users table.
 */
export async function getBounties(
  filters?: BountyFilters,
): Promise<readonly Bounty[] | null> {
  let query = supabase
    .from('bounties')
    .select('*, creator:users!creator_id(*)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[SeekerLens] Failed to fetch bounties:', error.message);
    return null;
  }

  return data as unknown as readonly Bounty[];
}

/**
 * Fetch a single bounty by id with creator info and submissions count.
 */
export async function getBountyById(
  id: string,
): Promise<Bounty | null> {
  const { data, error } = await supabase
    .from('bounties')
    .select('*, creator:users!creator_id(*), submissions:content(count)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to fetch bounty:', error.message);
    return null;
  }

  // Supabase returns count as [{ count: n }] — flatten it
  const raw = data as Record<string, unknown>;
  const submissionsArr = raw.submissions as ReadonlyArray<{ count: number }> | undefined;
  const submissionsCount = submissionsArr?.[0]?.count ?? 0;

  const bounty: Bounty = {
    ...(raw as unknown as Bounty),
    submissions_count: submissionsCount,
  };

  return bounty;
}

/**
 * Insert a new bounty row.
 */
export async function createBounty(
  payload: CreateBountyPayload,
): Promise<Bounty | null> {
  const { data, error } = await supabase
    .from('bounties')
    .insert({
      creator_id: payload.creator_id,
      title: payload.title,
      description: payload.description,
      media_type: payload.media_type,
      location_lat: payload.location_lat,
      location_lng: payload.location_lng,
      location_radius_km: payload.location_radius_km,
      location_name: payload.location_name,
      reward_sol: payload.reward_sol,
      max_submissions: payload.max_submissions,
      deadline: payload.deadline,
      tags: [...payload.tags],
    })
    .select('*')
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to create bounty:', error.message);
    return null;
  }

  return data as unknown as Bounty;
}

/**
 * Update the status of an existing bounty.
 */
export async function updateBountyStatus(
  id: string,
  status: BountyStatus,
): Promise<Bounty | null> {
  const { data, error } = await supabase
    .from('bounties')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to update bounty status:', error.message);
    return null;
  }

  return data as unknown as Bounty;
}
