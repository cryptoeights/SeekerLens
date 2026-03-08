import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, ClipboardList, Image } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';

interface ActionOption {
  readonly id: string;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
}

const ACTION_OPTIONS: readonly ActionOption[] = [
  {
    id: 'fulfill-bounty',
    icon: <Camera size={24} color={COLORS.primary} strokeWidth={2} />,
    title: 'Fulfill a Bounty',
    description: 'Capture content to complete an active bounty',
  },
  {
    id: 'post-marketplace',
    icon: <Image size={24} color={COLORS.secondary} strokeWidth={2} />,
    title: 'Post to Marketplace',
    description: 'Share your photos and earn from licenses',
  },
  {
    id: 'create-bounty',
    icon: <ClipboardList size={24} color={COLORS.solPurple} strokeWidth={2} />,
    title: 'Create a Bounty',
    description: 'Request specific content with SOL rewards',
  },
] as const;

export default function CreateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const handleOptionPress = useCallback(
    (optionId: string) => {
      switch (optionId) {
        case 'fulfill-bounty':
          router.push({ pathname: '/camera', params: { mode: 'bounty' } });
          break;
        case 'post-marketplace':
          router.push({ pathname: '/camera', params: { mode: 'marketplace' } });
          break;
        case 'create-bounty':
          router.push('/bounty/create');
          break;
      }
    },
    [router],
  );

  return (
    <Pressable style={styles.overlay} onPress={handleDismiss}>
      <View
        style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.xl }]}
        onStartShouldSetResponder={() => true}
      >
        {/* Handle indicator */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <Text style={styles.heading}>What do you want to do?</Text>

        <View style={styles.optionsList}>
          {ACTION_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>{option.icon}</View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.sm,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textTertiary,
  },
  heading: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  optionsList: {
    gap: SPACING.elementGap,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...TYPOGRAPHY.heading3,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  optionDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
});
