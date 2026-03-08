import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/lib/constants';

export interface GalleryItem {
  readonly id: string;
  readonly imageUri: string;
  readonly solPrice: number;
  readonly licensesCount: number;
}

interface GalleryGridProps {
  readonly items: readonly GalleryItem[];
}

interface GalleryCardProps {
  readonly item: GalleryItem;
}

function formatPrice(amount: number): string {
  if (Number.isNaN(amount) || !Number.isFinite(amount)) {
    return '0';
  }
  return parseFloat(amount.toFixed(2)).toString();
}

function GalleryCard({ item }: GalleryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        <View style={styles.priceOverlay}>
          <Text style={styles.priceText}>
            {'\u25CE'} {formatPrice(item.solPrice)} SOL
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.licenseText}>
          {item.licensesCount} {item.licensesCount === 1 ? 'license' : 'licenses'}
        </Text>
      </View>
    </View>
  );
}

export function GalleryGrid({ items }: GalleryGridProps) {
  // Split items into two columns for masonry layout
  const leftColumn = items.filter((_, index) => index % 2 === 0);
  const rightColumn = items.filter((_, index) => index % 2 !== 0);

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No items yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      <View style={styles.column}>
        {leftColumn.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </View>
      <View style={styles.column}>
        {rightColumn.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: SPACING.elementGap,
  },
  column: {
    flex: 1,
    gap: SPACING.elementGap,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 0.85,
    resizeMode: 'cover',
  },
  priceOverlay: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  priceText: {
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    color: COLORS.white,
  },
  cardFooter: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  licenseText: {
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textTertiary,
  },
});
