import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/lib/constants';

interface InputProps {
  readonly label?: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly placeholder?: string;
  readonly multiline?: boolean;
  readonly keyboardType?: KeyboardTypeOptions;
  readonly error?: string;
  readonly style?: ViewStyle;
}

const INPUT_HEIGHT = 48;
const INPUT_MULTILINE_HEIGHT = 120;
const INPUT_RADIUS = 12;

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  error,
  style,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = typeof error === 'string' && error.length > 0;

  const borderColor = hasError
    ? COLORS.error
    : isFocused
      ? COLORS.primary
      : COLORS.surfaceSecondary;

  const inputStyle = [
    styles.input,
    {
      borderColor,
      height: multiline ? INPUT_MULTILINE_HEIGHT : INPUT_HEIGHT,
      textAlignVertical: multiline ? ('top' as const) : ('center' as const),
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        multiline={multiline}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {hasError ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  label: {
    fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
    fontSize: TYPOGRAPHY.bodySmall.fontSize,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRadius: INPUT_RADIUS,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textPrimary,
  },
  error: {
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.error,
  },
});
