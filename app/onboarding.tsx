import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Image, Coins } from 'lucide-react-native';

import { COLORS, TYPOGRAPHY, SPACING } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { useAppStore } from '@/store/useAppStore';

const FEATURES = [
  {
    icon: MapPin,
    label: 'GPS-verified photo bounties',
    color: COLORS.primary,
  },
  {
    icon: Image,
    label: 'Auto-mint as compressed NFTs',
    color: COLORS.secondary,
  },
  {
    icon: Coins,
    label: 'Earn SOL with escrow payments',
    color: COLORS.solPurple,
  },
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { connect, connecting } = useWallet();
  const setHasOnboarded = useAppStore((s) => s.setHasOnboarded);

  const handleConnect = async () => {
    await connect();
    // Small delay to let MWA return focus to the app
    await new Promise((resolve) => setTimeout(resolve, 300));
    const address = useAppStore.getState().walletAddress;
    if (address) {
      setHasOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    setHasOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
      {/* Logo */}
      <View style={styles.logoBox}>
        <Text style={styles.logoLetter}>S</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>SeekerLens</Text>
      <Text style={styles.tagline}>Capture. Mint. Earn.</Text>

      {/* Description */}
      <Text style={styles.description}>
        The decentralized visual content marketplace on Solana Mobile.
        Create bounties, fulfill them, and trade content licenses as NFTs.
      </Text>

      {/* Feature list */}
      <View style={styles.features}>
        {FEATURES.map((feature) => (
          <View key={feature.label} style={styles.featureRow}>
            <feature.icon size={20} color={feature.color} strokeWidth={2} />
            <Text style={styles.featureText}>{feature.label}</Text>
          </View>
        ))}
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={connecting ? 'Connecting...' : 'Connect Wallet'}
          variant="primary"
          onPress={handleConnect}
          loading={connecting}
          fullWidth
        />
        <Text style={styles.skipLink} onPress={handleSkip}>
          Browse without wallet →
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.screenPadding + 20,
    alignItems: 'center',
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sectionGap,
  },
  logoLetter: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.white,
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  tagline: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.primary,
    marginBottom: SPACING.sectionGap,
  },
  description: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.sectionGap,
  },
  features: {
    alignSelf: 'stretch',
    gap: SPACING.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.elementGap,
    paddingHorizontal: SPACING.lg,
  },
  featureText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  spacer: {
    flex: 1,
  },
  actions: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingBottom: 60,
  },
  skipLink: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
