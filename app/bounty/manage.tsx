import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Shield } from 'lucide-react-native';

import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { SolAmount } from '@/components/ui/SolAmount';
import { Avatar } from '@/components/ui/Avatar';
import { approveSubmission, rejectSubmission } from '@/lib/api/submissions';

import type { Content } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_BOUNTY_INFO = {
  id: '1',
  title: 'River Photography at Citarum',
  rewardSol: 0.5,
} as const;

interface Submission {
  readonly content: Content;
  readonly timeAgo: string;
  readonly gpsVerified: boolean;
}

const MOCK_SUBMISSIONS: readonly Submission[] = [
  {
    content: {
      id: 'c1',
      creator_id: 'u2',
      bounty_id: '1',
      title: 'Citarum at dawn',
      description: null,
      media_url: 'https://picsum.photos/seed/river1/600/400',
      thumbnail_url: null,
      media_type: 'photo',
      location_lat: -6.92,
      location_lng: 107.62,
      location_name: 'Bandung',
      nft_mint_address: null,
      license_price_personal: null,
      license_price_commercial: null,
      license_price_exclusive: null,
      is_exclusive_sold: false,
      source: 'bounty',
      status: 'pending',
      tags: ['nature'],
      likes_count: 0,
      created_at: '2026-03-07T08:00:00Z',
      creator: {
        id: 'u2',
        wallet_address: '4xABc...7dEF',
        username: 'riverwalker',
        avatar_url: 'https://picsum.photos/seed/avatar2/100',
        bio: null,
        created_at: '2026-01-15T00:00:00Z',
      },
    },
    timeAgo: '2h ago',
    gpsVerified: true,
  },
  {
    content: {
      id: 'c2',
      creator_id: 'u3',
      bounty_id: '1',
      title: 'Golden hour reflection',
      description: null,
      media_url: 'https://picsum.photos/seed/river2/600/400',
      thumbnail_url: null,
      media_type: 'photo',
      location_lat: -6.918,
      location_lng: 107.621,
      location_name: 'Bandung',
      nft_mint_address: null,
      license_price_personal: null,
      license_price_commercial: null,
      license_price_exclusive: null,
      is_exclusive_sold: false,
      source: 'bounty',
      status: 'pending',
      tags: ['nature', 'travel'],
      likes_count: 0,
      created_at: '2026-03-07T06:30:00Z',
      creator: {
        id: 'u3',
        wallet_address: '9zHKl...2mNP',
        username: 'lenscraft',
        avatar_url: 'https://picsum.photos/seed/avatar3/100',
        bio: null,
        created_at: '2026-02-10T00:00:00Z',
      },
    },
    timeAgo: '4h ago',
    gpsVerified: true,
  },
  {
    content: {
      id: 'c3',
      creator_id: 'u4',
      bounty_id: '1',
      title: 'Riverbank wildlife',
      description: null,
      media_url: 'https://picsum.photos/seed/river3/600/400',
      thumbnail_url: null,
      media_type: 'photo',
      location_lat: -6.915,
      location_lng: 107.625,
      location_name: 'Bandung',
      nft_mint_address: null,
      license_price_personal: null,
      license_price_commercial: null,
      license_price_exclusive: null,
      is_exclusive_sold: false,
      source: 'bounty',
      status: 'pending',
      tags: ['nature'],
      likes_count: 0,
      created_at: '2026-03-07T05:00:00Z',
      creator: {
        id: 'u4',
        wallet_address: '2pQRs...5tUV',
        username: 'wildshot',
        avatar_url: null,
        bio: null,
        created_at: '2026-02-20T00:00:00Z',
      },
    },
    timeAgo: '5h ago',
    gpsVerified: false,
  },
];

// ---------------------------------------------------------------------------
// Submission Card Component
// ---------------------------------------------------------------------------

interface SubmissionCardProps {
  readonly submission: Submission;
  readonly onApprove: (contentId: string) => void;
  readonly onReject: (contentId: string) => void;
  readonly isProcessing: boolean;
}

function SubmissionCard({
  submission,
  onApprove,
  onReject,
  isProcessing,
}: SubmissionCardProps) {
  const { content, timeAgo, gpsVerified } = submission;
  const username = content.creator?.username ?? 'unknown';
  const avatarUri = content.creator?.avatar_url ?? null;

  return (
    <Card style={styles.submissionCard}>
      <Image
        source={{ uri: content.media_url }}
        style={styles.submissionImage}
      />

      <View style={styles.infoRow}>
        <View style={styles.creatorInfo}>
          <Avatar uri={avatarUri} size="sm" initials={username.slice(0, 2)} />
          <Text style={styles.creatorText}>
            @{username} · {timeAgo}
          </Text>
        </View>

        {gpsVerified && (
          <View style={styles.gpsBadge}>
            <Shield size={12} color={COLORS.secondary} />
            <Text style={styles.gpsBadgeText}>GPS Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => onApprove(content.id)}
          disabled={isProcessing}
          activeOpacity={0.7}
        >
          <Text style={styles.approveButtonText}>Approve & Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => onReject(content.id)}
          disabled={isProcessing}
          activeOpacity={0.7}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function ManageSubmissionsScreen() {
  const { bountyId } = useLocalSearchParams<{ bountyId: string }>();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // In production, fetch from Supabase using bountyId
  const bountyInfo = MOCK_BOUNTY_INFO;
  const submissions = MOCK_SUBMISSIONS;

  const handleApprove = useCallback(
    (contentId: string) => {
      Alert.alert(
        'Approve & Pay',
        `Approve this submission and release ${bountyInfo.rewardSol} SOL to the creator?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Approve',
            onPress: async () => {
              setProcessingId(contentId);
              try {
                const result = await approveSubmission(contentId);
                if (result) {
                  Alert.alert('Approved!', 'Submission approved successfully.');
                } else {
                  Alert.alert('Error', 'Failed to approve submission.');
                }
              } catch {
                Alert.alert('Error', 'Something went wrong.');
              } finally {
                setProcessingId(null);
              }
            },
          },
        ],
      );
    },
    [bountyInfo.rewardSol],
  );

  const handleReject = useCallback((contentId: string) => {
    Alert.alert(
      'Reject Submission',
      'Are you sure you want to reject this submission? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setProcessingId(contentId);
            try {
              const result = await rejectSubmission(contentId);
              if (result) {
                Alert.alert('Rejected', 'Submission has been rejected.');
              } else {
                Alert.alert('Error', 'Failed to reject submission.');
              }
            } catch {
              Alert.alert('Error', 'Something went wrong.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bounties</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bounty Info Card */}
        <Card style={styles.bountyInfoCard}>
          <Text style={styles.bountyTitle}>{bountyInfo.title}</Text>
          <SolAmount amount={bountyInfo.rewardSol} size="md" />
        </Card>

        {/* Submissions Header */}
        <Text style={styles.submissionsLabel}>
          SUBMISSIONS ({submissions.length})
        </Text>

        {/* Submission Cards */}
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.content.id}
            submission={submission}
            onApprove={handleApprove}
            onReject={handleReject}
            isProcessing={processingId === submission.content.id}
          />
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
  },
  bountyInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bountyTitle: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.md,
  },
  submissionsLabel: {
    ...TYPOGRAPHY.overline,
    color: COLORS.textTertiary,
    marginTop: SPACING.sectionGap,
    marginBottom: SPACING.md,
  },
  submissionCard: {
    padding: 0,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  submissionImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.surfaceSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.cardPadding,
    paddingTop: SPACING.md,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  creatorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  gpsBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.elementGap,
    paddingHorizontal: SPACING.cardPadding,
    paddingVertical: SPACING.md,
  },
  approveButton: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButtonText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.white,
  },
  rejectButton: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.error,
  },
  bottomSpacer: {
    height: 40,
  },
});
