import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Camera, Clock, Tag as TagIcon } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { SolAmount } from '@/components/ui/SolAmount';
import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';

import type { Bounty } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_BOUNTY: Bounty = {
  id: '1',
  creator_id: 'u1',
  title: 'River Photography at Citarum',
  description:
    'Looking for stunning river photography at the Citarum river area. ' +
    'Capture the natural beauty, wildlife, and surrounding landscape. ' +
    'Photos should be high resolution and taken during golden hour for best results. ' +
    'Both wide-angle and close-up shots are welcome.',
  media_type: 'photo',
  location_lat: -6.9175,
  location_lng: 107.6191,
  location_radius_km: 5,
  location_name: 'Bandung',
  reward_sol: 0.5,
  max_submissions: 5,
  deadline: '2026-03-15T00:00:00Z',
  status: 'open',
  escrow_tx: null,
  tags: ['nature', 'travel'],
  created_at: '2026-03-04T10:00:00Z',
  creator: {
    id: 'u1',
    wallet_address: '7xKXtg...9fGH',
    username: 'requester',
    avatar_url: 'https://picsum.photos/seed/avatar1/100',
    bio: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  submissions_count: 2,
};

const MOCK_SUBMISSIONS = [
  'https://picsum.photos/seed/sub1/200',
  'https://picsum.photos/seed/sub2/200',
];

// ---------------------------------------------------------------------------
// Tag helpers
// ---------------------------------------------------------------------------

const TAG_CATEGORY_MAP: Record<string, 'nature' | 'urban' | 'food' | 'portrait' | 'architecture' | 'travel'> = {
  nature: 'nature',
  urban: 'urban',
  food: 'food',
  portrait: 'portrait',
  architecture: 'architecture',
  travel: 'travel',
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function BountyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // In production this would fetch from Supabase using id
  const bounty = MOCK_BOUNTY;
  const remaining = bounty.max_submissions - (bounty.submissions_count ?? 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bounty Detail</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reference Image */}
        <Image
          source={{ uri: 'https://picsum.photos/seed/citarum/800/400' }}
          style={styles.referenceImage}
        />

        {/* Title */}
        <Text style={styles.title}>{bounty.title}</Text>

        {/* Reward + Slots Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <SolAmount amount={bounty.reward_sol} size="lg" />
            <Text style={styles.statLabel}>reward</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>
              {remaining}/{bounty.max_submissions} slots
            </Text>
            <Text style={styles.statLabel}>remaining</Text>
          </Card>
        </View>

        {/* Posted By */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Posted by</Text>
          <View style={styles.posterRow}>
            <Avatar
              uri={bounty.creator?.avatar_url}
              size="sm"
              initials={bounty.creator?.username?.slice(0, 2)}
            />
            <Text style={styles.posterText}>
              @{bounty.creator?.username ?? 'unknown'} · 2d ago
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{bounty.description}</Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Image
            source={{ uri: 'https://picsum.photos/seed/mapbandung/800/300' }}
            style={styles.mapImage}
          />
          <Text style={styles.locationText}>
            {bounty.location_name} · {bounty.location_radius_km}km radius
          </Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsRow}>
            <View style={styles.requirementChip}>
              <Camera size={14} color={COLORS.textSecondary} />
              <Text style={styles.requirementText}>{bounty.media_type}</Text>
            </View>
            <View style={styles.requirementChip}>
              <Clock size={14} color={COLORS.textSecondary} />
              <Text style={styles.requirementText}>
                {new Date(bounty.deadline).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.tagsRow}>
            {bounty.tags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                category={TAG_CATEGORY_MAP[tag] ?? 'nature'}
              />
            ))}
          </View>
        </View>

        {/* Submissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Submissions ({bounty.submissions_count ?? 0}/{bounty.max_submissions})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.submissionsRow}
          >
            {MOCK_SUBMISSIONS.map((uri, index) => (
              <Image
                key={`submission-${index}`}
                source={{ uri }}
                style={styles.submissionThumb}
              />
            ))}
          </ScrollView>
        </View>

        {/* Spacer so content is not hidden behind sticky button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.bottomBar}>
        <Button
          title="Accept & Fulfill Bounty"
          onPress={() => {
            router.push({
              pathname: '/(tabs)/capture',
              params: {
                bountyId: bounty.id,
                bountyTitle: bounty.title,
              },
            });
          }}
          fullWidth
        />
        {/* Show manage button for bounty creators */}
        {bounty.creator_id === 'u1' && (
          <Button
            title="Manage Submissions"
            variant="secondary"
            onPress={() => {
              router.push(`/bounty/manage?bountyId=${bounty.id}`);
            }}
            fullWidth
            style={styles.manageButton}
          />
        )}
      </View>
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
  referenceImage: {
    width: '100%',
    height: 200,
    borderRadius: SPACING.cardRadius,
    backgroundColor: COLORS.surfaceSecondary,
  },
  title: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.elementGap,
    marginTop: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statValue: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  section: {
    marginTop: SPACING.sectionGap,
  },
  sectionLabel: {
    ...TYPOGRAPHY.overline,
    color: COLORS.textTertiary,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  posterText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  descriptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  mapImage: {
    width: '100%',
    height: 160,
    borderRadius: SPACING.cardRadius,
    backgroundColor: COLORS.surfaceSecondary,
  },
  locationText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  requirementsRow: {
    flexDirection: 'row',
    gap: SPACING.elementGap,
  },
  requirementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  requirementText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  submissionsRow: {
    gap: SPACING.md,
  },
  submissionThumb: {
    width: 80,
    height: 80,
    borderRadius: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
    ...SHADOWS.cardLifted,
  },
  manageButton: {
    marginTop: SPACING.xs,
  },
});
