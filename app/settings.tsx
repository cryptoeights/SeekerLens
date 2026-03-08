import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import Constants from 'expo-constants';

import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, NETWORKS } from '@/lib/constants';
import { formatWalletAddress } from '@/lib/solana';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function SectionLabel({ label }: { readonly label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function SettingRow({
  label,
  value,
  right,
}: {
  readonly label: string;
  readonly value?: string;
  readonly right?: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <Text style={styles.settingLabel}>{label}</Text>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { network, setNetwork, walletAddress, disconnect } = useAppStore();

  const isDevnet = network === 'devnet';
  const networkInfo = NETWORKS[network];

  const handleNetworkToggle = (value: boolean) => {
    setNetwork(value ? 'devnet' : 'mainnet');
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            disconnect();
            router.back();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <ChevronLeft
          size={24}
          color={COLORS.textPrimary}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Network Section */}
      <SectionLabel label="NETWORK" />
      <Card>
        <SettingRow
          label="Network"
          value={networkInfo.name}
          right={
            <Switch
              value={isDevnet}
              onValueChange={handleNetworkToggle}
              trackColor={{
                false: COLORS.surfaceSecondary,
                true: COLORS.primary,
              }}
              thumbColor={COLORS.white}
            />
          }
        />
        <Text style={styles.networkHint}>
          {isDevnet ? 'Using devnet for testing' : 'Using mainnet-beta for real transactions'}
        </Text>
      </Card>

      {/* Wallet Section */}
      <SectionLabel label="WALLET" />
      <Card>
        {walletAddress ? (
          <>
            <SettingRow
              label="Wallet Address"
              value={formatWalletAddress(walletAddress)}
            />
            <View style={styles.disconnectRow}>
              <Button
                title="Disconnect Wallet"
                variant="ghost"
                onPress={handleDisconnect}
              />
            </View>
          </>
        ) : (
          <SettingRow label="No wallet connected" />
        )}
      </Card>

      {/* General Section */}
      <SectionLabel label="GENERAL" />
      <Card>
        <SettingRow label="Notifications" />
        <View style={styles.divider} />
        <SettingRow label="Storage Preferences" />
      </Card>

      {/* About Section */}
      <SectionLabel label="ABOUT" />
      <Card>
        <SettingRow
          label="About SeekerLens"
          value={`v${Constants.expoConfig?.version ?? '1.0.0'}`}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    marginBottom: SPACING.elementGap,
  },
  headerTitle: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: SPACING.elementGap,
  },
  headerSpacer: {
    width: 24,
  },
  sectionLabel: {
    ...TYPOGRAPHY.overline,
    color: COLORS.textTertiary,
    marginTop: SPACING.sectionGap,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.elementGap,
  },
  settingRowLeft: {
    flex: 1,
  },
  settingLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  settingValue: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  networkHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginTop: -4,
    marginBottom: 4,
  },
  disconnectRow: {
    marginTop: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceSecondary,
  },
});
