import { supabase } from '../supabase';
import type { Content, ContentStatus } from '../types';

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Fetch all content submissions for a specific bounty.
 * Includes creator info via a join on the users table.
 */
export async function getSubmissionsByBounty(
  bountyId: string,
): Promise<readonly Content[] | null> {
  const { data, error } = await supabase
    .from('content')
    .select('*, creator:users!creator_id(*)')
    .eq('bounty_id', bountyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      '[SeekerLens] Failed to fetch submissions:',
      error.message,
    );
    return null;
  }

  return data as unknown as readonly Content[];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Update a content submission's status.
 * Returns the updated content or null on failure.
 */
async function updateSubmissionStatus(
  contentId: string,
  status: ContentStatus,
): Promise<Content | null> {
  const { data, error } = await supabase
    .from('content')
    .update({ status })
    .eq('id', contentId)
    .select('*, creator:users!creator_id(*)')
    .single();

  if (error) {
    console.error(
      `[SeekerLens] Failed to update submission to '${status}':`,
      error.message,
    );
    return null;
  }

  return data as unknown as Content;
}

/**
 * Approve a submission and mark it ready for payment.
 */
export async function approveSubmission(
  contentId: string,
): Promise<Content | null> {
  return updateSubmissionStatus(contentId, 'approved');
}

/**
 * Reject a submission.
 */
export async function rejectSubmission(
  contentId: string,
): Promise<Content | null> {
  return updateSubmissionStatus(contentId, 'rejected');
}
