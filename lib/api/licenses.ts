import { supabase } from '../supabase';
import type { License, LicenseType } from '../types';

// ---------------------------------------------------------------------------
// Create payload
// ---------------------------------------------------------------------------

interface CreateLicensePayload {
  readonly content_id: string;
  readonly buyer_id: string;
  readonly license_type: LicenseType;
  readonly price_sol: number;
  readonly tx_signature: string;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch all licenses for a specific content item.
 */
export async function getLicensesByContent(
  contentId: string,
): Promise<readonly License[] | null> {
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('content_id', contentId)
    .order('purchased_at', { ascending: false });

  if (error) {
    console.error('[SeekerLens] Failed to fetch licenses by content:', error.message);
    return null;
  }

  return data as unknown as readonly License[];
}

/**
 * Fetch all licenses purchased by a specific user.
 */
export async function getLicensesByBuyer(
  buyerId: string,
): Promise<readonly License[] | null> {
  const { data, error } = await supabase
    .from('licenses')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('purchased_at', { ascending: false });

  if (error) {
    console.error('[SeekerLens] Failed to fetch licenses by buyer:', error.message);
    return null;
  }

  return data as unknown as readonly License[];
}

/**
 * Insert a new license record.
 */
export async function createLicense(
  payload: CreateLicensePayload,
): Promise<License | null> {
  const { data, error } = await supabase
    .from('licenses')
    .insert({
      content_id: payload.content_id,
      buyer_id: payload.buyer_id,
      license_type: payload.license_type,
      price_sol: payload.price_sol,
      tx_signature: payload.tx_signature,
    })
    .select('*')
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to create license:', error.message);
    return null;
  }

  return data as unknown as License;
}
