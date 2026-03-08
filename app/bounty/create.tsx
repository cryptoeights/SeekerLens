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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { useWallet } from '@/hooks/useWallet';
import { useAppStore } from '@/store/useAppStore';
import { createBounty } from '@/lib/api/bounties';
import { findOrCreateUser } from '@/lib/api/users';

import type { MediaType, CategoryTag } from '@/lib/types';
import type { CategoryTagName } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

interface FormState {
  readonly title: string;
  readonly description: string;
  readonly mediaType: MediaType;
  readonly rewardSol: string;
  readonly maxSubmissions: string;
  readonly deadline: string;
  readonly selectedTags: readonly CategoryTag[];
  readonly locationLat: number | null;
  readonly locationLng: number | null;
  readonly locationName: string | null;
}

const INITIAL_FORM: FormState = {
  title: '',
  description: '',
  mediaType: 'photo',
  rewardSol: '',
  maxSubmissions: '5',
  deadline: '5 days',
  selectedTags: [],
  locationLat: null,
  locationLng: null,
  locationName: null,
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MEDIA_OPTIONS: readonly MediaType[] = ['photo', 'video', 'both'];

const AVAILABLE_TAGS: readonly { label: string; value: CategoryTag; category: CategoryTagName }[] = [
  { label: 'Nature', value: 'nature', category: 'nature' },
  { label: 'Urban', value: 'urban', category: 'urban' },
  { label: 'Food', value: 'food', category: 'food' },
  { label: 'Portrait', value: 'portrait', category: 'portrait' },
  { label: 'Architecture', value: 'architecture', category: 'architecture' },
  { label: 'Travel', value: 'travel', category: 'travel' },
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function CreateBountyScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isCreating, setIsCreating] = useState(false);
  const { connected, connect, walletAddress } = useWallet();
  const { user } = useAppStore();

  // Immutable updater: creates a new form object for every change
  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleTag = useCallback((tag: CategoryTag) => {
    setForm((prev) => {
      const isSelected = prev.selectedTags.includes(tag);
      const nextTags = isSelected
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag];
      return { ...prev, selectedTags: nextTags };
    });
  }, []);

  const handlePickLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to set a bounty location.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const [place] = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    const name = place
      ? [place.name, place.city, place.region].filter(Boolean).join(', ')
      : 'Current Location';

    setForm((prev) => ({
      ...prev,
      locationLat: loc.coords.latitude,
      locationLng: loc.coords.longitude,
      locationName: name,
    }));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!connected) {
      Alert.alert('Wallet Required', 'Connect your wallet first.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: connect },
      ]);
      return;
    }

    if (!form.title.trim()) {
      Alert.alert('Title Required', 'Please give your bounty a title.');
      return;
    }

    const rewardAmount = parseFloat(form.rewardSol);
    if (!rewardAmount || rewardAmount <= 0) {
      Alert.alert('Reward Required', 'Please enter a valid SOL reward amount.');
      return;
    }

    setIsCreating(true);

    try {
      // Ensure user record exists
      let creatorId = user?.id;
      if (!creatorId && walletAddress) {
        const freshUser = await findOrCreateUser(walletAddress);
        if (freshUser) {
          creatorId = freshUser.id;
          useAppStore.getState().setUser(freshUser);
        }
      }

      if (!creatorId) {
        Alert.alert('Error', 'Could not create user record. Try reconnecting your wallet.');
        return;
      }

      // Calculate deadline date
      const daysMatch = form.deadline.match(/(\d+)/);
      const days = daysMatch ? parseInt(daysMatch[1], 10) : 5;
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + days);

      const result = await createBounty({
        creator_id: creatorId,
        title: form.title,
        description: form.description || null,
        media_type: form.mediaType,
        location_lat: form.locationLat,
        location_lng: form.locationLng,
        location_radius_km: 5,
        location_name: form.locationName,
        reward_sol: rewardAmount,
        max_submissions: parseInt(form.maxSubmissions, 10) || 5,
        deadline: deadlineDate.toISOString(),
        tags: [...form.selectedTags],
      });

      if (!result) {
        Alert.alert('Error', 'Failed to create bounty. Please try again.');
        return;
      }

      Alert.alert('Bounty Created!', 'Your bounty has been posted successfully.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/explore') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create bounty';
      Alert.alert('Error', message);
    } finally {
      setIsCreating(false);
    }
  }, [connected, connect, form, user?.id, walletAddress, router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Bounty</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Input
          label="Title"
          value={form.title}
          onChangeText={(v) => updateField('title', v)}
          placeholder="e.g. River Photography at Citarum"
        />

        {/* Description */}
        <Input
          label="Description"
          value={form.description}
          onChangeText={(v) => updateField('description', v)}
          placeholder="Describe what you are looking for..."
          multiline
          style={styles.fieldGap}
        />

        {/* Media Type Selector */}
        <View style={[styles.fieldGap]}>
          <Text style={styles.label}>Media Type</Text>
          <View style={styles.pillRow}>
            {MEDIA_OPTIONS.map((option) => {
              const isActive = form.mediaType === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.pill, isActive ? styles.pillActive : undefined]}
                  onPress={() => updateField('mediaType', option)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, isActive ? styles.pillTextActive : undefined]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Location Picker */}
        <View style={[styles.fieldGap]}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.locationPicker} onPress={handlePickLocation}>
            {form.locationName ? (
              <View style={styles.locationSelected}>
                <MapPin size={20} color={COLORS.primary} />
                <Text style={styles.locationSelectedText}>{form.locationName}</Text>
              </View>
            ) : (
              <>
                <Image
                  source={{ uri: 'https://picsum.photos/seed/aerial/800/300' }}
                  style={styles.locationImage}
                />
                <View style={styles.locationOverlay}>
                  <MapPin size={24} color={COLORS.white} />
                  <Text style={styles.locationOverlayText}>Tap to Use Current Location</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Reward Amount */}
        <Input
          label="Reward Amount (SOL)"
          value={form.rewardSol}
          onChangeText={(v) => updateField('rewardSol', v)}
          placeholder="0.00"
          keyboardType="decimal-pad"
          style={styles.fieldGap}
        />

        {/* Max Submissions + Deadline Row */}
        <View style={[styles.twoColRow, styles.fieldGap]}>
          <View style={styles.colHalf}>
            <Input
              label="Max Submissions"
              value={form.maxSubmissions}
              onChangeText={(v) => updateField('maxSubmissions', v)}
              placeholder="5"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.colHalf}>
            <Input
              label="Deadline"
              value={form.deadline}
              onChangeText={(v) => updateField('deadline', v)}
              placeholder="5 days"
            />
          </View>
        </View>

        {/* Tags */}
        <View style={[styles.fieldGap]}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagsWrap}>
            {AVAILABLE_TAGS.map((tagItem) => {
              const isSelected = form.selectedTags.includes(tagItem.value);
              return (
                <TouchableOpacity
                  key={tagItem.value}
                  onPress={() => toggleTag(tagItem.value)}
                  activeOpacity={0.7}
                >
                  <Tag
                    label={tagItem.label}
                    category={tagItem.category}
                    style={isSelected ? styles.tagSelected : styles.tagUnselected}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.bottomBar}>
        <Button
          title={isCreating ? 'Creating...' : 'Deposit SOL & Create Bounty'}
          onPress={handleCreate}
          fullWidth
          loading={isCreating}
          disabled={isCreating}
        />
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.sm,
  },
  fieldGap: {
    marginTop: SPACING.sectionGap,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  pillRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pill: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceSecondary,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  pillText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.white,
  },
  locationPicker: {
    borderRadius: SPACING.cardRadius,
    overflow: 'hidden',
    height: 140,
  },
  locationImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surfaceSecondary,
  },
  locationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationOverlayText: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.white,
  },
  locationSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    height: 140,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SPACING.cardRadius,
  },
  locationSelectedText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.primary,
    flex: 1,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: SPACING.elementGap,
  },
  colHalf: {
    flex: 1,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tagSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tagUnselected: {
    opacity: 0.5,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    ...SHADOWS.cardLifted,
  },
});
