// Crypto polyfill MUST load before any @solana/web3.js import
import '@/lib/polyfills';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAppStore } from '@/store/useAppStore';
import { COLORS } from '@/lib/constants';

function useOnboardingRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);

  useEffect(() => {
    const inOnboarding = segments[0] === 'onboarding';

    if (!hasOnboarded && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [hasOnboarded, segments, router]);
}

export default function RootLayout() {
  useOnboardingRedirect();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaProvider>
  );
}
