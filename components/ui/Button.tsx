import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  readonly title: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
  readonly style?: ViewStyle;
}

const BUTTON_HEIGHT = 48;
const BUTTON_RADIUS = 12;

const variantStyles = {
  primary: {
    container: {
      backgroundColor: COLORS.primary,
    },
    text: {
      color: COLORS.white,
    },
    disabledContainer: {
      backgroundColor: COLORS.primary,
      opacity: 0.5,
    },
  },
  secondary: {
    container: {
      backgroundColor: COLORS.surfaceSecondary,
    },
    text: {
      color: COLORS.textPrimary,
    },
    disabledContainer: {
      backgroundColor: COLORS.surfaceSecondary,
      opacity: 0.5,
    },
  },
  ghost: {
    container: {
      backgroundColor: COLORS.transparent,
    },
    text: {
      color: COLORS.primary,
    },
    disabledContainer: {
      backgroundColor: COLORS.transparent,
      opacity: 0.5,
    },
  },
} as const;

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];

  const containerStyle = [
    styles.container,
    variantStyle.container,
    isDisabled ? variantStyle.disabledContainer : undefined,
    fullWidth ? styles.fullWidth : undefined,
    style,
  ];

  const loaderColor =
    variant === 'primary' ? COLORS.white : COLORS.primary;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <Text style={[styles.text, variantStyle.text]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  text: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
});
