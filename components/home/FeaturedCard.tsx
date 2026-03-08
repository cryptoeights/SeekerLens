import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';
import { SolAmount } from '@/components/ui/SolAmount';

interface FeaturedCardProps {
  readonly imageUri: string;
  readonly title: string;
  readonly creator: string;
  readonly solAmount: number;
  readonly licensesCount: number;
  readonly onPress?: () => void;
}

const CARD_HEIGHT = 200;

export function FeaturedCard({
  imageUri,
  title,
  creator,
  solAmount,
  licensesCount,
  onPress,
}: FeaturedCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.image}
        imageStyle={styles.imageInner}
      >
        {/* Dark gradient overlay using layered semi-transparent views */}
        <View style={styles.gradientOverlay}>
          <View style={styles.gradientTop} />
          <View style={styles.gradientMiddle} />
          <View style={styles.gradientBottom} />
        </View>

        <View style={styles.content}>
          <SolAmount amount={solAmount} size="sm" />
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {creator} &middot; {licensesCount} licenses sold
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.screenPadding,
    borderRadius: SPACING.cardRadius,
    overflow: 'hidden',
  },
  image: {
    height: CARD_HEIGHT,
    justifyContent: 'flex-end',
  },
  imageInner: {
    borderRadius: SPACING.cardRadius,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SPACING.cardRadius,
    justifyContent: 'flex-end',
  },
  gradientTop: {
    flex: 1,
  },
  gradientMiddle: {
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  gradientBottom: {
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderBottomLeftRadius: SPACING.cardRadius,
    borderBottomRightRadius: SPACING.cardRadius,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.cardPadding,
    gap: SPACING.xs,
  },
  title: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.white,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.8)',
  },
});
