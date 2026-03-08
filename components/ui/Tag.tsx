import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { CATEGORY_TAGS, TYPOGRAPHY, type CategoryTagName } from '@/lib/constants';

type TagSize = 'sm' | 'md';

interface TagProps {
  readonly label: string;
  readonly category: CategoryTagName;
  readonly size?: TagSize;
  readonly style?: ViewStyle;
}

const sizeStyles = {
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
} as const;

export function Tag({ label, category, size = 'md', style }: TagProps) {
  const categoryColors = CATEGORY_TAGS[category];
  const sizeConfig = sizeStyles[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: categoryColors.background,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: categoryColors.text,
            fontSize: sizeConfig.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
  },
});
