import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';

interface ProfileHeaderProps {
  readonly avatarUri?: string | null;
  readonly username: string;
  readonly bio?: string | null;
}

export function ProfileHeader({ avatarUri, username, bio }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={avatarUri} size="lg" showBorder />
      <Text style={styles.username}>@{username}</Text>
      {bio ? <Text style={styles.bio}>{bio}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  username: {
    fontFamily: TYPOGRAPHY.heading3.fontFamily,
    fontSize: TYPOGRAPHY.heading3.fontSize,
    fontWeight: TYPOGRAPHY.heading3.fontWeight,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  bio: {
    fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: TYPOGRAPHY.bodySmall.fontWeight,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
