import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';
import { FeaturedCard } from '@/components/home/FeaturedCard';
import { BountyCardSmall } from '@/components/home/BountyCardSmall';
import { CompletedBountyItem } from '@/components/home/CompletedBountyItem';
import { ContentGrid, type ContentGridItem } from '@/components/home/ContentGrid';
import { SectionHeader } from '@/components/home/SectionHeader';
import { HomeSkeleton } from '@/components/common/LoadingSkeleton';
import { getContent } from '@/lib/api/content';
import type { Content } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock Data (Indonesian locations)
// ---------------------------------------------------------------------------

const FEATURED = {
  id: 'featured-1',
  imageUri: 'https://picsum.photos/seed/bromo/800/400',
  title: 'Sunrise at Bromo',
  creator: '@andi',
  solAmount: 2.5,
  licensesCount: 12,
} as const;

const OPEN_BOUNTIES = [
  {
    id: 'b1',
    imageUri: 'https://picsum.photos/seed/bali-temple/320/200',
    title: 'Uluwatu Temple at Sunset',
    rewardSol: 1.5,
    slotsRemaining: 3,
    maxSlots: 5,
    daysLeft: 4,
  },
  {
    id: 'b2',
    imageUri: 'https://picsum.photos/seed/bandung/320/200',
    title: 'Bandung Tea Plantation',
    rewardSol: 0.8,
    slotsRemaining: 2,
    maxSlots: 3,
    daysLeft: 7,
  },
  {
    id: 'b3',
    imageUri: 'https://picsum.photos/seed/jogja/320/200',
    title: 'Prambanan Night Shot',
    rewardSol: 3.0,
    slotsRemaining: 1,
    maxSlots: 2,
    daysLeft: 2,
  },
  {
    id: 'b4',
    imageUri: 'https://picsum.photos/seed/komodo/320/200',
    title: 'Komodo Dragon Close-up',
    rewardSol: 5.0,
    slotsRemaining: 4,
    maxSlots: 5,
    daysLeft: 10,
  },
] as const;

const COMPLETED_BOUNTIES = [
  {
    id: 'c1',
    thumbnailUri: 'https://picsum.photos/seed/raja-ampat/128/128',
    title: 'Raja Ampat Aerial',
    creator: '@maya',
    earnedSol: 2.0,
  },
  {
    id: 'c2',
    thumbnailUri: 'https://picsum.photos/seed/borobudur/128/128',
    title: 'Borobudur Sunrise',
    creator: '@rizki',
    earnedSol: 1.5,
  },
  {
    id: 'c3',
    thumbnailUri: 'https://picsum.photos/seed/tanahlot/128/128',
    title: 'Tanah Lot Tide',
    creator: '@dewi',
    earnedSol: 0.75,
  },
] as const;

const TRENDING_CONTENT: readonly ContentGridItem[] = [
  { id: 't1', imageUri: 'https://picsum.photos/seed/nusapenida/400/480', solPrice: 0.5 },
  { id: 't2', imageUri: 'https://picsum.photos/seed/kawahijen/400/520', solPrice: 1.2 },
  { id: 't3', imageUri: 'https://picsum.photos/seed/labuan-bajo/400/460', solPrice: 0.8 },
  { id: 't4', imageUri: 'https://picsum.photos/seed/toraja/400/500', solPrice: 2.0 },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LOADING_DELAY_MS = 1000;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liveContent, setLiveContent] = useState<readonly Content[]>([]);

  const fetchLiveContent = useCallback(async () => {
    const data = await getContent({ source: 'marketplace' });
    if (data) setLiveContent(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchLiveContent();
      setIsLoading(false);
    };
    init();
  }, [fetchLiveContent]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLiveContent();
    setRefreshing(false);
  }, [fetchLiveContent]);

  const handleContentPress = useCallback((id: string) => {
    router.push(`/content/${id}`);
  }, [router]);

  const handleBountyPress = useCallback((id: string) => {
    router.push(`/bounty/${id}`);
  }, [router]);

  const renderBountyItem = useCallback(
    ({ item }: { item: typeof OPEN_BOUNTIES[number] }) => (
      <BountyCardSmall
        imageUri={item.imageUri}
        title={item.title}
        rewardSol={item.rewardSol}
        slotsRemaining={item.slotsRemaining}
        maxSlots={item.maxSlots}
        daysLeft={item.daysLeft}
        onPress={() => handleBountyPress(item.id)}
      />
    ),
    [handleBountyPress],
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top + SPACING.md },
        ]}
      >
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + SPACING.md },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SeekerLens</Text>
        <Avatar initials="P" size="md" />
      </View>

      {/* Featured Hero */}
      <FeaturedCard
        imageUri={FEATURED.imageUri}
        title={FEATURED.title}
        creator={FEATURED.creator}
        solAmount={FEATURED.solAmount}
        licensesCount={FEATURED.licensesCount}
        onPress={() => handleContentPress(FEATURED.id)}
      />

      {/* Open Bounties */}
      <View style={styles.section}>
        <SectionHeader
          label="OPEN BOUNTIES"
          count={OPEN_BOUNTIES.length}
          onSeeAll={() => {}}
        />
        <FlatList
          data={OPEN_BOUNTIES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={HorizontalSpacer}
          renderItem={renderBountyItem}
        />
      </View>

      {/* Completed Bounties */}
      <View style={styles.section}>
        <SectionHeader
          label="COMPLETED"
          count={12}
          onSeeAll={() => {}}
        />
        <View style={styles.completedList}>
          {COMPLETED_BOUNTIES.map((item) => (
            <CompletedBountyItem
              key={item.id}
              thumbnailUri={item.thumbnailUri}
              title={item.title}
              creator={item.creator}
              earnedSol={item.earnedSol}
              onPress={() => handleBountyPress(item.id)}
            />
          ))}
        </View>
      </View>

      {/* Live Marketplace Content (from Supabase) */}
      {liveContent.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            label="MARKETPLACE"
            count={liveContent.length}
            onSeeAll={() => {}}
          />
          <ContentGrid
            items={liveContent.map((c) => ({
              id: c.id,
              imageUri: c.media_url,
              solPrice: c.license_price_personal ?? 0,
            }))}
            onItemPress={handleContentPress}
          />
        </View>
      )}

      {/* Trending Content */}
      <View style={styles.section}>
        <SectionHeader
          label="TRENDING CONTENT"
          count={TRENDING_CONTENT.length}
          onSeeAll={() => {}}
        />
        <ContentGrid items={TRENDING_CONTENT} onItemPress={handleContentPress} />
      </View>

      {/* Bottom spacer for tab bar */}
      <View style={{ height: SPACING.bottomNavHeight + SPACING.xxl }} />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function HorizontalSpacer() {
  return <View style={styles.horizontalSpacer} />;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sectionGap,
  },
  headerTitle: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.textPrimary,
  },
  section: {
    marginTop: SPACING.sectionGap,
  },
  horizontalList: {
    paddingHorizontal: SPACING.screenPadding,
  },
  horizontalSpacer: {
    width: SPACING.md,
  },
  completedList: {
    gap: SPACING.sm,
  },
});
