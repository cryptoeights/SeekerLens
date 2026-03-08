import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wallet } from 'lucide-react-native';

import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '@/lib/constants';
import { formatWalletAddress } from '@/lib/solana';
import { SolAmount } from '@/components/ui/SolAmount';
import { useWallet } from '@/hooks/useWallet';

export function WalletButton() {
  const { connected, connecting, walletAddress, solBalance, connect } =
    useWallet();

  if (connected && walletAddress) {
    return (
      <View style={styles.connectedContainer}>
        {solBalance !== null ? (
          <SolAmount amount={solBalance} size="sm" />
        ) : null}
        <View style={styles.addressBadge}>
          <Text style={styles.addressText}>
            {formatWalletAddress(walletAddress)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.connectButton}
      onPress={connect}
      disabled={connecting}
      activeOpacity={0.7}
    >
      <Wallet size={16} color={COLORS.primary} strokeWidth={2} />
      <Text style={styles.connectText}>
        {connecting ? 'Connecting...' : 'Connect'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  addressBadge: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  addressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.elementGap,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
  },
  connectText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
