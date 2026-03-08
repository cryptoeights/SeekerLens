import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS, SHADOWS, SPACING } from '@/lib/constants';

interface CardProps {
  readonly children: React.ReactNode;
  readonly style?: ViewStyle;
  readonly onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  const cardStyle = [styles.card, style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.cardPadding,
    ...SHADOWS.card,
  },
});
