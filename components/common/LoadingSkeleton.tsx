import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTENT_WIDTH = SCREEN_WIDTH - SPACING.screenPadding * 2;
const CARD_WIDTH = 200;
const CARD_HEIGHT = 160;
const LIST_ITEM_HEIGHT = 64;
const THUMBNAIL_SIZE = 48;

// ---------------------------------------------------------------------------
// HomeSkeleton - mimics hero + horizontal cards + list items
// ---------------------------------------------------------------------------

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Skeleton width={140} height={28} borderRadius={8} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      {/* Featured hero card */}
      <Skeleton
        width={CONTENT_WIDTH}
        height={200}
        borderRadius={SPACING.cardRadius}
        style={styles.heroSkeleton}
      />

      {/* Section label */}
      <Skeleton width={120} height={12} borderRadius={4} style={styles.sectionLabel} />

      {/* Horizontal card row */}
      <View style={styles.horizontalRow}>
        <Skeleton width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={SPACING.cardRadius} />
        <Skeleton width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={SPACING.cardRadius} />
      </View>

      {/* Section label */}
      <Skeleton width={100} height={12} borderRadius={4} style={styles.sectionLabel} />

      {/* List items */}
      {Array.from({ length: 3 }, (_, i) => (
        <View key={`list-${i}`} style={styles.listItem}>
          <Skeleton width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} borderRadius={8} />
          <View style={styles.listItemText}>
            <Skeleton width={160} height={14} borderRadius={4} />
            <Skeleton width={100} height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// CardSkeleton - single card placeholder
// ---------------------------------------------------------------------------

export function CardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      <Skeleton
        width={CONTENT_WIDTH}
        height={CARD_HEIGHT}
        borderRadius={SPACING.cardRadius}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// ListSkeleton - vertical list of skeleton rows
// ---------------------------------------------------------------------------

interface ListSkeletonProps {
  readonly count?: number;
}

export function ListSkeleton({ count = 4 }: ListSkeletonProps) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }, (_, i) => (
        <View key={`row-${i}`} style={styles.listItem}>
          <Skeleton width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} borderRadius={8} />
          <View style={styles.listItemText}>
            <Skeleton width={180} height={14} borderRadius={4} />
            <Skeleton width={120} height={12} borderRadius={4} />
          </View>
          <Skeleton width={60} height={24} borderRadius={8} />
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroSkeleton: {
    alignSelf: 'center',
  },
  sectionLabel: {
    marginTop: SPACING.lg,
  },
  horizontalRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  cardContainer: {
    paddingHorizontal: SPACING.screenPadding,
  },
  listContainer: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.elementGap,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    height: LIST_ITEM_HEIGHT,
  },
  listItemText: {
    flex: 1,
    gap: SPACING.xs,
  },
});
