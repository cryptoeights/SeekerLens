import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/lib/constants';

interface StatsRowProps {
  readonly solEarned: number;
  readonly photosCount: number;
  readonly bountiesCount: number;
}

interface StatCardProps {
  readonly value: string;
  readonly label: string;
  readonly valueColor: string;
}

function StatCard({ value, label, valueColor }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function formatSol(amount: number): string {
  if (Number.isNaN(amount) || !Number.isFinite(amount)) {
    return '0';
  }
  return parseFloat(amount.toFixed(2)).toString();
}

export function StatsRow({ solEarned, photosCount, bountiesCount }: StatsRowProps) {
  return (
    <View style={styles.container}>
      <StatCard
        value={formatSol(solEarned)}
        label="SOL Earned"
        valueColor={COLORS.secondary}
      />
      <StatCard
        value={String(photosCount)}
        label="Photos"
        valueColor={COLORS.primary}
      />
      <StatCard
        value={String(bountiesCount)}
        label="Bounties"
        valueColor={COLORS.solPurple}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.elementGap,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    paddingVertical: SPACING.cardPadding,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  value: {
    fontFamily: TYPOGRAPHY.heading2.fontFamily,
    fontSize: TYPOGRAPHY.heading2.fontSize,
    fontWeight: TYPOGRAPHY.heading2.fontWeight,
  },
  label: {
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
