import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Heart, MoreHorizontal, Link, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SolAmount } from '@/components/ui/SolAmount';
import { Tag } from '@/components/ui/Tag';
import { useLicense } from '@/hooks/useLicense';
import { getMockContentById } from '@/lib/mockData';
import { getContentById } from '@/lib/api/content';
import type { CategoryTagName } from '@/lib/constants';
import type { LicenseType, Content } from '@/lib/types';

// ---------------------------------------------------------------------------
// Tag category mapping
// ---------------------------------------------------------------------------

const TAG_CATEGORY_MAP: Record<string, CategoryTagName> = {
  nature: 'nature',
  travel: 'travel',
  urban: 'urban',
  food: 'food',
  portrait: 'portrait',
  architecture: 'architecture',
};

function getCategoryForTag(tag: string): CategoryTagName {
  return TAG_CATEGORY_MAP[tag] ?? 'nature';
}

// ---------------------------------------------------------------------------
// License row component
// ---------------------------------------------------------------------------

interface LicenseRowProps {
  readonly type: string;
  readonly licenseKey: LicenseType;
  readonly price: number;
  readonly description: string;
  readonly isLast: boolean;
  readonly isPurchasing: boolean;
  readonly isPurchased: boolean;
  readonly onAcquire: () => void;
}

function LicenseRow({
  type,
  price,
  description,
  isLast,
  isPurchasing,
  isPurchased,
  onAcquire,
}: LicenseRowProps) {
  return (
    <View style={isLast ? undefined : styles.licenseRowBorder}>
      <View style={styles.licenseRow}>
        <View style={styles.licenseInfo}>
          <Text style={styles.licenseType}>{type}</Text>
          <Text style={styles.licenseDescription}>{description}</Text>
        </View>
        <View style={styles.licenseAction}>
          <SolAmount amount={price} size="sm" />
          {isPurchased ? (
            <View style={styles.purchasedBadge}>
              <Check size={14} color={COLORS.secondary} strokeWidth={2.5} />
              <Text style={styles.purchasedText}>Owned</Text>
            </View>
          ) : (
            <Button
              title={isPurchasing ? 'Processing...' : 'Acquire'}
              variant="ghost"
              onPress={onAcquire}
              disabled={isPurchasing}
              style={styles.acquireButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

const LICENSE_TYPE_MAP: Record<string, LicenseType> = {
  'Personal Use': 'personal',
  'Commercial Use': 'commercial',
  'Exclusive': 'exclusive',
};

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isPurchasing, purchaseLicense, status } = useLicense();
  const [purchasedTypes, setPurchasedTypes] = useState<ReadonlySet<string>>(new Set());
  const [activeLicenseType, setActiveLicenseType] = useState<string | null>(null);
  const [liveContent, setLiveContent] = useState<Content | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const mockData = getMockContentById(id ?? '');

  // Load from Supabase if not a mock ID
  useEffect(() => {
    if (mockData || !id) return;
    let mounted = true;
    setIsLoadingContent(true);
    getContentById(id).then((data) => {
      if (mounted) {
        setLiveContent(data);
        setIsLoadingContent(false);
      }
    });
    return () => { mounted = false; };
  }, [id, mockData]);

  const content = mockData
    ? {
        id: mockData.id,
        title: mockData.title,
        imageUri: mockData.imageUri,
        creator: mockData.creator,
        creatorWallet: '',
        location: {
          name: mockData.location.name,
          mapUri: `https://picsum.photos/seed/${mockData.id}-map/600/200`,
        },
        tags: mockData.tags as readonly string[],
        licenses: [
          { type: 'Personal Use' as const, price: mockData.licensePricePersonal, description: 'For personal, non-commercial' },
          { type: 'Commercial Use' as const, price: mockData.licensePriceCommercial, description: 'For business & commercial' },
          { type: 'Exclusive' as const, price: mockData.licensePriceExclusive, description: 'Full rights transfer' },
        ],
        licensesSold: mockData.licensesSold,
        nftAddress: mockData.nftAddress,
      }
    : liveContent
    ? {
        id: liveContent.id,
        title: liveContent.title,
        imageUri: liveContent.media_url,
        creator: {
          username: liveContent.creator?.username ?? 'anonymous',
          avatarUri: liveContent.creator?.avatar_url ?? 'https://picsum.photos/100/100',
          photoCount: 0,
          totalEarned: 0,
        },
        creatorWallet: liveContent.creator?.wallet_address ?? '',
        location: {
          name: liveContent.location_name ?? 'Unknown',
          mapUri: `https://picsum.photos/seed/${liveContent.id}-map/600/200`,
        },
        tags: liveContent.tags,
        licenses: [
          { type: 'Personal Use' as const, price: liveContent.license_price_personal ?? 0.05, description: 'For personal, non-commercial' },
          { type: 'Commercial Use' as const, price: liveContent.license_price_commercial ?? 0.5, description: 'For business & commercial' },
          { type: 'Exclusive' as const, price: liveContent.license_price_exclusive ?? 2.0, description: 'Full rights transfer' },
        ],
        licensesSold: 0,
        nftAddress: liveContent.nft_mint_address ?? 'Pending',
      }
    : null;

  if (isLoadingContent || (!mockData && !liveContent && id)) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ ...TYPOGRAPHY.body, color: COLORS.textSecondary }}>Content not found</Text>
        <Button title="Go Back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleAcquireLicense = (licenseType: string, priceSol: number) => {
    const mappedType = LICENSE_TYPE_MAP[licenseType];
    if (!mappedType) return;

    Alert.alert(
      'Confirm Purchase',
      `Acquire "${licenseType}" for ${priceSol} SOL?\n\nThis will transfer SOL from your wallet to the creator.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setActiveLicenseType(licenseType);
            const result = await purchaseLicense({
              contentId: content.id,
              creatorWallet: content.creatorWallet ?? '',
              licenseType: mappedType,
              priceSol,
            });

            if (result) {
              setPurchasedTypes((prev) => new Set([...prev, licenseType]));
              Alert.alert('Success', `You now own the "${licenseType}" license!`);
            }
            setActiveLicenseType(null);
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={8}>
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity hitSlop={8}>
            <Heart size={24} color={COLORS.textPrimary} strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} style={styles.headerIconGap}>
            <MoreHorizontal size={24} color={COLORS.textPrimary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + SPACING.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Full photo */}
        <Image source={{ uri: content.imageUri }} style={styles.heroImage} />

        {/* Title */}
        <Text style={styles.title}>{content.title}</Text>

        {/* Creator row */}
        <View style={styles.creatorRow}>
          <Avatar uri={content.creator.avatarUri} size="md" />
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorName}>@{content.creator.username}</Text>
            <Text style={styles.creatorStats}>
              {content.creator.photoCount} photos · {content.creator.totalEarned} SOL earned
            </Text>
          </View>
          <Button title="Follow" variant="ghost" onPress={() => {}} />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.locationText}>
            {'\uD83D\uDCCD'} {content.location.name}
          </Text>
          <Image
            source={{ uri: content.location.mapUri }}
            style={styles.mapImage}
          />
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {content.tags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              category={getCategoryForTag(tag)}
              size="md"
              style={styles.tagChip}
            />
          ))}
        </View>

        {/* Licenses section */}
        <Card style={styles.licensesCard}>
          <Text style={styles.licensesTitle}>Licenses</Text>
          {content.licenses.map((license, index) => (
            <LicenseRow
              key={license.type}
              type={license.type}
              licenseKey={LICENSE_TYPE_MAP[license.type] ?? 'personal'}
              price={license.price}
              description={license.description}
              isLast={index === content.licenses.length - 1}
              isPurchasing={isPurchasing && activeLicenseType === license.type}
              isPurchased={purchasedTypes.has(license.type)}
              onAcquire={() => handleAcquireLicense(license.type, license.price)}
            />
          ))}
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Link size={14} color={COLORS.textTertiary} strokeWidth={1.5} />
          <Text style={styles.footerText}>
            {content.licensesSold} licenses sold · NFT: {content.nftAddress}
          </Text>
        </View>
      </ScrollView>
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconGap: {
    marginLeft: SPACING.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
  },
  heroImage: {
    width: '100%',
    height: 280,
    borderRadius: SPACING.cardRadius,
    backgroundColor: COLORS.surfaceSecondary,
  },
  title: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  creatorStats: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  section: {
    marginTop: SPACING.sectionGap,
  },
  locationText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  mapImage: {
    width: '100%',
    height: 120,
    borderRadius: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  tagChip: {
    marginRight: 0,
  },
  licensesCard: {
    marginTop: SPACING.sectionGap,
  },
  licensesTitle: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  licenseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  licenseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceSecondary,
  },
  licenseInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  licenseType: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  licenseDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xxs,
  },
  licenseAction: {
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  acquireButton: {
    height: 36,
    paddingHorizontal: SPACING.sm,
  },
  purchasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: SPACING.sm,
  },
  purchasedText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sectionGap,
    gap: SPACING.xs,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
});
