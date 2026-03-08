import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/lib/constants';

type SolAmountSize = 'sm' | 'md' | 'lg';

interface SolAmountProps {
  readonly amount: number;
  readonly size?: SolAmountSize;
  readonly style?: ViewStyle;
}

const sizeConfig = {
  sm: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  md: {
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lg: {
    fontSize: TYPOGRAPHY.body.fontSize,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
} as const;

function formatAmount(amount: number): string {
  if (Number.isNaN(amount) || !Number.isFinite(amount)) {
    return '0';
  }
  // Remove trailing zeros but keep meaningful decimals
  return parseFloat(amount.toFixed(4)).toString();
}

export function SolAmount({ amount, size = 'md', style }: SolAmountProps) {
  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: config.paddingHorizontal,
          paddingVertical: config.paddingVertical,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: config.fontSize }]}>
        {'\u25CE'} {formatAmount(amount)} SOL
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.solPurpleLight,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontWeight: '600',
    color: COLORS.solPurple,
  },
});
