import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/lib/constants';
import { SolAmount } from '@/components/ui/SolAmount';

interface BountyCardSmallProps {
  readonly imageUri: string;
  readonly title: string;
  readonly rewardSol: number;
  readonly slotsRemaining: number;
  readonly maxSlots: number;
  readonly daysLeft: number;
  readonly onPress?: () => void;
}

const CARD_WIDTH = 160;
const IMAGE_HEIGHT = 100;

export function BountyCardSmall({
  imageUri,
  title,
  rewardSol,
  slotsRemaining,
  maxSlots,
  daysLeft,
  onPress,
}: BountyCardSmallProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <SolAmount amount={rewardSol} size="sm" />
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {slotsRemaining}/{maxSlots} slots
          </Text>
          <Text style={styles.metaDot}>&middot;</Text>
          <Text style={styles.metaText}>
            {daysLeft}d left
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  info: {
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    fontSize: 11,
  },
  metaDot: {
    color: COLORS.textTertiary,
    fontSize: 11,
  },
});
