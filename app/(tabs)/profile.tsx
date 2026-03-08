import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, Wallet } from 'lucide-react-native';

import { SolAmount } from '@/components/ui/SolAmount';
import { Button } from '@/components/ui/Button';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsRow } from '@/components/profile/StatsRow';
import { GalleryGrid, type GalleryItem } from '@/components/profile/GalleryGrid';
import { useWallet } from '@/hooks/useWallet';
import { useAppStore } from '@/store/useAppStore';
import { getContent } from '@/lib/api/content';
import type { Content } from '@/lib/types';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '@/lib/constants';

const TAB_OPTIONS = ['My Gallery', 'Bounties', 'Licenses'] as const;
type TabOption = (typeof TAB_OPTIONS)[number];

// ---------------------------------------------------------------------------
// Profile Screen
// ---------------------------------------------------------------------------

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabOption>('My Gallery');
  const { connected, connecting, connect, solBalance, walletAddress, refreshBalance } = useWallet();
  const { user } = useAppStore();
  const [myContent, setMyContent] = useState<readonly Content[]>([]);

  // Fetch balance and user content on mount
  useEffect(() => {
    if (!connected) return;
    refreshBalance();

    // Load user's content from Supabase
    getContent({ source: 'marketplace' }).then((data) => {
      if (!data || !walletAddress) return;
      // Filter to show current user's content (match by user id or creator wallet)
      const userContent = data.filter(
        (c) =>
          c.creator_id === user?.id ||
          c.creator?.wallet_address === walletAddress,
      );
      setMyContent(userContent);
    });
  }, [connected, walletAddress, user?.id]);

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  // Not connected — show connect wallet prompt
  if (!connected) {
    return (
      <View
        style={[
          styles.screen,
          styles.connectContainer,
          { paddingTop: insets.top + SPACING.sm },
        ]}
      >
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Profile</Text>
          <Pressable
            onPress={handleSettingsPress}
            style={styles.settingsButton}
            hitSlop={12}
          >
            <Settings size={24} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.connectContent}>
          <View style={styles.connectIconCircle}>
            <Wallet size={32} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.connectTitle}>Connect Your Wallet</Text>
          <Text style={styles.connectDescription}>
            Connect your Solana wallet to view your profile, gallery, and earnings.
          </Text>
          <Button
            title={connecting ? 'Connecting...' : 'Connect Wallet'}
            onPress={connect}
            loading={connecting}
            fullWidth
          />
        </View>
      </View>
    );
  }

  const displayName = user?.username ?? 'seekerlens';
  const displayBio = user?.bio ?? 'Capturing the world one photo at a time.';
  const displayAvatar = user?.avatar_url ?? 'https://picsum.photos/seed/avatar/200/200';
  const displayBalance = solBalance ?? 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + SPACING.sm, paddingBottom: insets.bottom + SPACING.xxxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header row with settings icon */}
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Profile</Text>
        <Pressable
          onPress={handleSettingsPress}
          style={styles.settingsButton}
          hitSlop={12}
        >
          <Settings size={24} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      {/* Avatar + username + bio */}
      <ProfileHeader
        avatarUri={displayAvatar}
        username={displayName}
        bio={displayBio}
      />

      {/* Wallet balance card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <SolAmount amount={displayBalance} size="lg" />
      </View>

      {/* Stats row */}
      <StatsRow solEarned={0} photosCount={myContent.length} bountiesCount={0} />

      {/* Tab selector */}
      <View style={styles.tabRow}>
        {TAB_OPTIONS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, isActive ? styles.tabActive : undefined]}
            >
              <Text style={[styles.tabText, isActive ? styles.tabTextActive : undefined]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tab content */}
      {activeTab === 'My Gallery' && (
        myContent.length > 0 ? (
          <GalleryGrid
            items={myContent.map((c) => ({
              id: c.id,
              imageUri: c.media_url,
              solPrice: c.license_price_personal ?? 0,
              licensesCount: 0,
            }))}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No photos yet. Start capturing!</Text>
          </View>
        )
      )}
      {activeTab === 'Bounties' && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No bounties yet</Text>
        </View>
      )}
      {activeTab === 'Licenses' && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No licenses yet</Text>
        </View>
      )}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.sectionGap,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontFamily: TYPOGRAPHY.heading1.fontFamily,
    fontSize: TYPOGRAPHY.heading1.fontSize,
    fontWeight: TYPOGRAPHY.heading1.fontWeight,
    color: COLORS.textPrimary,
  },
  settingsButton: {
    padding: SPACING.xs,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.cardPadding,
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  balanceLabel: {
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: SPACING.md,
    padding: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: SPACING.sm,
  },
  tabActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  tabText: {
    fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  placeholderText: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textTertiary,
  },
  connectContainer: {
    paddingHorizontal: SPACING.screenPadding,
  },
  connectContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    gap: SPACING.md,
  },
  connectIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  connectTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  connectDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
});
