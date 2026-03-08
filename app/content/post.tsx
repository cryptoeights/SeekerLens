import React, { useState, useCallback } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Plus, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SolAmount } from '@/components/ui/SolAmount';
import { Tag } from '@/components/ui/Tag';
import { useNFT } from '@/hooks/useNFT';
import { useWallet } from '@/hooks/useWallet';
import { createContent } from '@/lib/api/content';
import { useAppStore } from '@/store/useAppStore';
import type { CategoryTagName } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

interface PostFormState {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly pricePersonal: string;
  readonly priceCommercial: string;
  readonly priceExclusive: string;
}

const INITIAL_FORM: PostFormState = {
  title: '',
  description: '',
  tags: ['nature', 'travel'],
  pricePersonal: '0.05',
  priceCommercial: '0.50',
  priceExclusive: '2.00',
};

// ---------------------------------------------------------------------------
// Available tags
// ---------------------------------------------------------------------------

const AVAILABLE_TAGS: readonly string[] = [
  'nature',
  'urban',
  'food',
  'portrait',
  'architecture',
  'travel',
];

const TAG_CATEGORY_MAP: Record<string, CategoryTagName> = {
  nature: 'nature',
  urban: 'urban',
  food: 'food',
  portrait: 'portrait',
  architecture: 'architecture',
  travel: 'travel',
};

function getCategoryForTag(tag: string): CategoryTagName {
  return TAG_CATEGORY_MAP[tag] ?? 'nature';
}

// ---------------------------------------------------------------------------
// License pricing row
// ---------------------------------------------------------------------------

interface PriceRowProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
}

function PriceRow({ label, value, onChangeText }: PriceRowProps) {
  const numericValue = parseFloat(value) || 0;

  return (
    <View style={styles.priceRow}>
      <View style={styles.priceLabel}>
        <Text style={styles.priceLabelText}>{label}</Text>
        <SolAmount amount={numericValue} size="sm" />
      </View>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="0.00"
        keyboardType="decimal-pad"
        style={styles.priceInput}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function PostContentScreen() {
  const params = useLocalSearchParams<{
    imageUri: string;
    latitude: string;
    longitude: string;
    locationName: string;
  }>();

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<PostFormState>(INITIAL_FORM);
  const { isMinting, progress, mintContent } = useNFT();
  const { connected, connect, walletAddress } = useWallet();
  const { user } = useAppStore();

  // Immutable form updaters
  const updateField = useCallback(
    <K extends keyof PostFormState>(field: K, value: PostFormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleToggleTag = useCallback((tag: string) => {
    setForm((prev) => {
      const hasTag = prev.tags.includes(tag);
      const updatedTags = hasTag
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: updatedTags };
    });
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePost = async () => {
    if (!connected) {
      Alert.alert('Wallet Required', 'Connect your wallet first to mint content.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: connect },
      ]);
      return;
    }

    if (!form.title.trim()) {
      Alert.alert('Title Required', 'Please give your photo a title.');
      return;
    }

    const imageUri = params.imageUri || '';
    const latitude = params.latitude ? parseFloat(params.latitude) : null;
    const longitude = params.longitude ? parseFloat(params.longitude) : null;

    // Step 1: Mint NFT (upload image + metadata to IPFS + mint cNFT)
    const result = await mintContent({
      localImageUri: imageUri,
      title: form.title,
      description: form.description,
      latitude,
      longitude,
      locationName: params.locationName || null,
      mediaType: 'photo',
      source: 'marketplace',
      tags: form.tags,
      licensePricePersonal: parseFloat(form.pricePersonal) || 0.05,
      licensePriceCommercial: parseFloat(form.priceCommercial) || 0.5,
      licensePriceExclusive: parseFloat(form.priceExclusive) || 2.0,
    });

    if (!result) return; // Error already shown by useNFT

    // Step 2: Save to Supabase for discoverability
    // If user record exists use it; otherwise try to create one from wallet
    let creatorId = user?.id;
    if (!creatorId && walletAddress) {
      const { findOrCreateUser } = await import('@/lib/api/users');
      const freshUser = await findOrCreateUser(walletAddress);
      if (freshUser) {
        creatorId = freshUser.id;
        useAppStore.getState().setUser(freshUser);
      }
    }

    if (creatorId) {
      await createContent({
        creator_id: creatorId,
        title: form.title,
        description: form.description,
        media_url: result.imageUrl,
        thumbnail_url: result.imageUrl,
        media_type: 'photo',
        location_lat: latitude,
        location_lng: longitude,
        location_name: params.locationName || null,
        nft_mint_address: result.mintSignature,
        license_price_personal: parseFloat(form.pricePersonal) || 0.05,
        license_price_commercial: parseFloat(form.priceCommercial) || 0.5,
        license_price_exclusive: parseFloat(form.priceExclusive) || 2.0,
        source: 'marketplace',
        tags: [...form.tags],
      });
    }

    Alert.alert('Success!', 'Your content has been minted and posted.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  const imageUri = params.imageUri || 'https://picsum.photos/800/400?random=55';
  const locationName = params.locationName || 'Bandung';
  const currentDate = 'Mar 6, 2026';

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton} hitSlop={8}>
          <ChevronLeft size={20} color={COLORS.textPrimary} />
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePost} hitSlop={8}>
          <Text style={styles.headerPostText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + SPACING.xxxl + 64 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo preview */}
        <Image source={{ uri: imageUri }} style={styles.previewImage} />

        {/* Title input */}
        <Input
          label="Title"
          value={form.title}
          onChangeText={(text) => updateField('title', text)}
          placeholder="Give your photo a title"
          style={styles.inputSection}
        />

        {/* Description input */}
        <Input
          label="Description"
          value={form.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="Describe what makes this photo special"
          multiline
          style={styles.inputSection}
        />

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScroll}
          >
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = form.tags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => handleToggleTag(tag)}
                  activeOpacity={0.7}
                >
                  <Tag
                    label={tag}
                    category={getCategoryForTag(tag)}
                    size="md"
                    style={isSelected ? styles.tagSelected : styles.tagUnselected}
                  />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.addTagButton} activeOpacity={0.7}>
              <Plus size={16} color={COLORS.primary} />
              <Text style={styles.addTagText}>Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* License Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>License Pricing</Text>
          <PriceRow
            label="Personal"
            value={form.pricePersonal}
            onChangeText={(text) => updateField('pricePersonal', text)}
          />
          <PriceRow
            label="Commercial"
            value={form.priceCommercial}
            onChangeText={(text) => updateField('priceCommercial', text)}
          />
          <PriceRow
            label="Exclusive"
            value={form.priceExclusive}
            onChangeText={(text) => updateField('priceExclusive', text)}
          />
        </View>

        {/* Location + Date footer */}
        <View style={styles.locationFooter}>
          <MapPin size={14} color={COLORS.textTertiary} strokeWidth={1.5} />
          <Text style={styles.locationFooterText}>
            {locationName} · {currentDate}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.md }]}>
        <Button
          title={isMinting ? progress : 'Mint & Post'}
          onPress={handlePost}
          fullWidth
          loading={isMinting}
          disabled={isMinting}
        />
      </View>
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
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerBackText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  headerPostText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: SPACING.cardRadius,
    backgroundColor: COLORS.surfaceSecondary,
  },
  inputSection: {
    marginTop: SPACING.lg,
  },
  section: {
    marginTop: SPACING.sectionGap,
  },
  sectionLabel: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  tagsScroll: {
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  tagSelected: {
    opacity: 1,
  },
  tagUnselected: {
    opacity: 0.4,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addTagText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceSecondary,
  },
  priceLabel: {
    flex: 1,
    gap: SPACING.xs,
  },
  priceLabelText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  priceInput: {
    width: 100,
    marginTop: 0,
  },
  locationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sectionGap,
  },
  locationFooterText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  bottomBar: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSecondary,
  },
});
