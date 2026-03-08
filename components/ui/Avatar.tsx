import React from 'react';
import { Image, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/lib/constants';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  readonly uri?: string | null;
  readonly size?: AvatarSize;
  readonly initials?: string;
  readonly showBorder?: boolean;
  readonly style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 64,
} as const;

const INITIALS_FONT_SIZE: Record<AvatarSize, number> = {
  sm: 12,
  md: 14,
  lg: 24,
} as const;

export function Avatar({
  uri,
  size = 'md',
  initials,
  showBorder = false,
  style,
}: AvatarProps) {
  const dimension = SIZE_MAP[size];
  const borderRadius = dimension / 2;

  const containerStyle = [
    styles.container,
    {
      width: dimension,
      height: dimension,
      borderRadius,
    },
    showBorder ? styles.border : undefined,
    style,
  ];

  if (uri) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri }}
          style={[styles.image, { width: dimension, height: dimension, borderRadius }]}
        />
      </View>
    );
  }

  const displayInitials = initials
    ? initials.slice(0, 2).toUpperCase()
    : '?';

  return (
    <View style={[containerStyle, styles.placeholder]}>
      <Text
        style={[
          styles.initialsText,
          { fontSize: INITIALS_FONT_SIZE[size] },
        ]}
      >
        {displayInitials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: COLORS.primaryLight,
  },
  initialsText: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
