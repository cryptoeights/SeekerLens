import { supabase } from '../supabase';
import type { User } from '../types';

/**
 * Find a user by wallet address, or create a new one if not found.
 * Used after wallet connection to ensure we have a user record.
 */
export async function findOrCreateUser(
  walletAddress: string,
): Promise<User | null> {
  // Try to find existing user
  const { data: existing, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (existing && !findError) {
    return existing as User;
  }

  // Create new user if not found
  const { data: created, error: createError } = await supabase
    .from('users')
    .insert({ wallet_address: walletAddress })
    .select('*')
    .single();

  if (createError) {
    console.error('[SeekerLens] Failed to create user:', createError.message);
    return null;
  }

  return created as User;
}

/**
 * Get a user by wallet address.
 */
export async function getUserByWallet(
  walletAddress: string,
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) {
    return null;
  }

  return data as User;
}

/**
 * Update user profile (username, avatar, bio).
 */
export async function updateUserProfile(
  userId: string,
  updates: { username?: string; avatar_url?: string; bio?: string },
): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    console.error('[SeekerLens] Failed to update user:', error.message);
    return null;
  }

  return data as User;
}
