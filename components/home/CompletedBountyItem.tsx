import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/lib/constants';

interface CompletedBountyItemProps {
  readonly thumbnailUri: string;
  readonly title: string;
  readonly creator: string;
  readonly earnedSol: number;
  readonly onPress?: () => void;
}

const THUMBNAIL_SIZE = 64;

export function CompletedBountyItem({
  thumbnailUri,
  title,
  creator,
  earnedSol,
  onPress,
}: CompletedBountyItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.creator} numberOfLines={1}>
          {creator}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.doneBadge}>
            <Text style={styles.doneText}>Done</Text>
          </View>
          <Text style={styles.earned}>
            Earned {earnedSol} SOL
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginHorizontal: SPACING.screenPadding,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: SPACING.sm,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    gap: SPACING.xxs,
  },
  title: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  creator: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xxs,
  },
  doneBadge: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  doneText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  earned: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
    fontWeight: '600',
  },
});
