import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, MapPin, Search, Users } from 'lucide-react-native';

import { useRouter } from 'expo-router';
import { getContent } from '@/lib/api/content';
import type { Content } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { SolAmount } from '@/components/ui/SolAmount';
import { Tag } from '@/components/ui/Tag';
import { Avatar } from '@/components/ui/Avatar';
import { ContentGrid, type ContentGridItem } from '@/components/home/ContentGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';
import type { CategoryTag } from '@/lib/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabId = 'bounties' | 'content' | 'creators';

interface TabOption {
  readonly id: TabId;
  readonly label: string;
}

interface NearbyBounty {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: string;
  readonly distance: string;
  readonly rewardSol: number;
  readonly deadline: string;
  readonly tag: CategoryTag;
  readonly tagLabel: string;
}

interface Creator {
  readonly id: string;
  readonly username: string;
  readonly avatarUri: string;
  readonly photoCount: number;
  readonly earnedSol: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS: readonly TabOption[] = [
  { id: 'bounties', label: 'Bounties' },
  { id: 'content', label: 'Content' },
  { id: 'creators', label: 'Creators' },
] as const;

const NEARBY_BOUNTIES: readonly NearbyBounty[] = [
  {
    id: '1',
    title: 'Sunrise at Tangkuban Perahu',
    thumbnail: 'https://picsum.photos/seed/tangkuban/160/160',
    distance: '2.3 km away',
    rewardSol: 1.5,
    deadline: '2d left',
    tag: 'nature',
    tagLabel: 'Nature',
  },
  {
    id: '2',
    title: 'Braga Street Night Life',
    thumbnail: 'https://picsum.photos/seed/braga/160/160',
    distance: '0.8 km away',
    rewardSol: 0.75,
    deadline: '5d left',
    tag: 'urban',
    tagLabel: 'Urban',
  },
  {
    id: '3',
    title: 'Traditional Sundanese Cuisine',
    thumbnail: 'https://picsum.photos/seed/sundanese/160/160',
    distance: '1.1 km away',
    rewardSol: 0.5,
    deadline: '3d left',
    tag: 'food',
    tagLabel: 'Food',
  },
] as const;

const EXPLORE_CONTENT: readonly ContentGridItem[] = [
  { id: 'ec1', imageUri: 'https://picsum.photos/seed/monas/400/480', solPrice: 0.3 },
  { id: 'ec2', imageUri: 'https://picsum.photos/seed/kota-tua/400/520', solPrice: 0.6 },
  { id: 'ec3', imageUri: 'https://picsum.photos/seed/malioboro/400/460', solPrice: 1.0 },
  { id: 'ec4', imageUri: 'https://picsum.photos/seed/dieng/400/500', solPrice: 0.4 },
  { id: 'ec5', imageUri: 'https://picsum.photos/seed/taman-sari/400/440', solPrice: 0.8 },
  { id: 'ec6', imageUri: 'https://picsum.photos/seed/lawang-sewu/400/510', solPrice: 1.5 },
] as const;

const CREATORS: readonly Creator[] = [
  { id: 'cr1', username: '@andi_photo', avatarUri: 'https://picsum.photos/seed/andi/128/128', photoCount: 48, earnedSol: 12.5 },
  { id: 'cr2', username: '@maya_lens', avatarUri: 'https://picsum.photos/seed/maya/128/128', photoCount: 36, earnedSol: 8.2 },
  { id: 'cr3', username: '@rizki_art', avatarUri: 'https://picsum.photos/seed/rizki/128/128', photoCount: 72, earnedSol: 21.0 },
  { id: 'cr4', username: '@dewi_captures', avatarUri: 'https://picsum.photos/seed/dewi/128/128', photoCount: 24, earnedSol: 5.3 },
  { id: 'cr5', username: '@budi_visual', avatarUri: 'https://picsum.photos/seed/budi/128/128', photoCount: 55, earnedSol: 15.8 },
] as const;

const MAP_IMAGE_URI = 'https://picsum.photos/seed/bandungmap/800/500';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('bounties');
  const [liveContent, setLiveContent] = useState<readonly Content[]>([]);

  useEffect(() => {
    getContent({ source: 'marketplace' }).then((data) => {
      if (data) setLiveContent(data);
    });
  }, []);

  const handleTabPress = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color={COLORS.textTertiary} strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search places, tags, creators..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      {/* Tab pills */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabPill, isActive ? styles.tabPillActive : undefined]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabLabel, isActive ? styles.tabLabelActive : undefined]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'bounties' && <BountiesTab router={router} />}
        {activeTab === 'content' && <ContentTab router={router} liveContent={liveContent} />}
        {activeTab === 'creators' && <CreatorsTab />}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tab: Bounties
// ---------------------------------------------------------------------------

function BountiesTab({ router }: { readonly router: ReturnType<typeof useRouter> }) {
  return (
    <>
      {/* Map placeholder */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: MAP_IMAGE_URI }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={[styles.mapPin, { top: '30%', left: '40%' }]}>
          <MapPin size={28} color={COLORS.primary} fill={COLORS.primaryLight} strokeWidth={2} />
        </View>
        <View style={[styles.mapPin, { top: '50%', left: '60%' }]}>
          <MapPin size={28} color={COLORS.error} fill="#FEE2E2" strokeWidth={2} />
        </View>
        <View style={[styles.mapPin, { top: '45%', left: '25%' }]}>
          <MapPin size={28} color={COLORS.secondary} fill={COLORS.secondaryLight} strokeWidth={2} />
        </View>
      </View>

      {/* Nearby section */}
      <Text style={styles.sectionLabel}>NEARBY</Text>

      <View style={styles.bountyList}>
        {NEARBY_BOUNTIES.map((bounty) => (
          <NearbyBountyCard
            key={bounty.id}
            bounty={bounty}
            onPress={() => router.push(`/bounty/${bounty.id}`)}
          />
        ))}
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tab: Content
// ---------------------------------------------------------------------------

function ContentTab({ router, liveContent }: { readonly router: ReturnType<typeof useRouter>; readonly liveContent: readonly Content[] }) {
  // Merge mock + live content from Supabase
  const liveItems: readonly ContentGridItem[] = liveContent.map((c) => ({
    id: c.id,
    imageUri: c.media_url,
    solPrice: c.license_price_personal ?? 0,
  }));
  const allItems = [...liveItems, ...EXPLORE_CONTENT];

  if (allItems.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="No Content Yet"
        subtitle="Be the first to capture and share visual content in this area."
        actionLabel="Start Capturing"
        onAction={() => {}}
      />
    );
  }

  return (
    <>
      <Text style={styles.sectionLabel}>DISCOVER</Text>
      <ContentGrid
        items={allItems}
        onItemPress={(id) => router.push(`/content/${id}`)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Tab: Creators
// ---------------------------------------------------------------------------

function CreatorsTab() {
  if (CREATORS.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Creators Found"
        subtitle="There are no creators in this area yet. Check back later or expand your search."
      />
    );
  }

  return (
    <>
      <Text style={styles.sectionLabel}>TOP CREATORS</Text>
      <View style={styles.creatorList}>
        {CREATORS.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NearbyBountyCard({ bounty, onPress }: { readonly bounty: NearbyBounty; readonly onPress?: () => void }) {
  return (
    <Card style={styles.bountyCard} onPress={onPress}>
      <View style={styles.bountyRow}>
        <Image
          source={{ uri: bounty.thumbnail }}
          style={styles.bountyThumbnail}
          resizeMode="cover"
        />
        <View style={styles.bountyInfo}>
          <Text style={styles.bountyTitle} numberOfLines={2}>
            {bounty.title}
          </Text>
          <View style={styles.bountyMeta}>
            <MapPin size={14} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.bountyDistance}>{bounty.distance}</Text>
          </View>
          <Tag label={bounty.tagLabel} category={bounty.tag} size="sm" />
        </View>
        <View style={styles.bountyRight}>
          <SolAmount amount={bounty.rewardSol} size="sm" />
          <Text style={styles.bountyDeadline}>{bounty.deadline}</Text>
        </View>
      </View>
    </Card>
  );
}

function CreatorCard({ creator }: { readonly creator: Creator }) {
  return (
    <Card style={styles.creatorCard}>
      <View style={styles.creatorRow}>
        <Avatar uri={creator.avatarUri} size="lg" />
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorUsername}>{creator.username}</Text>
          <Text style={styles.creatorStats}>
            {creator.photoCount} photos
          </Text>
        </View>
        <SolAmount amount={creator.earnedSol} size="sm" />
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.screenPadding,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 44,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
    padding: 0,
  },
  // Tabs
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.screenPadding,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSecondary,
  },
  tabPillActive: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.sectionGap + SPACING.bottomNavHeight,
  },
  // Map
  mapContainer: {
    marginHorizontal: SPACING.screenPadding,
    height: 220,
    borderRadius: SPACING.cardRadius,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceSecondary,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
  },
  // Section
  sectionLabel: {
    ...TYPOGRAPHY.overline,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.screenPadding,
    marginTop: SPACING.sectionGap,
    marginBottom: SPACING.md,
  },
  // Bounty list
  bountyList: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.elementGap,
  },
  bountyCard: {
    padding: SPACING.md,
  },
  bountyRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  bountyThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSecondary,
  },
  bountyInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  bountyTitle: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  bountyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bountyDistance: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  bountyRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  bountyDeadline: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  // Creator list
  creatorList: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.elementGap,
  },
  creatorCard: {
    padding: SPACING.md,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  creatorInfo: {
    flex: 1,
    gap: 2,
  },
  creatorUsername: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  creatorStats: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});
