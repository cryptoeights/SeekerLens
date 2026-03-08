import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NetworkType, User } from '../lib/types';

interface AppState {
  readonly network: NetworkType;
  readonly walletAddress: string | null;
  readonly solBalance: number | null;
  readonly user: User | null;
  readonly isConnecting: boolean;
  readonly hasOnboarded: boolean;
}

interface AppActions {
  readonly setNetwork: (network: NetworkType) => void;
  readonly setWalletAddress: (address: string | null) => void;
  readonly setSolBalance: (balance: number | null) => void;
  readonly setUser: (user: User | null) => void;
  readonly setIsConnecting: (connecting: boolean) => void;
  readonly setHasOnboarded: (value: boolean) => void;
  readonly disconnect: () => void;
}

type AppStore = AppState & AppActions;

const INITIAL_STATE: AppState = {
  network: 'devnet',
  walletAddress: null,
  solBalance: null,
  user: null,
  isConnecting: false,
  hasOnboarded: false,
} as const;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setNetwork: (network) =>
        set((state) => ({ ...state, network })),

      setWalletAddress: (walletAddress) =>
        set((state) => ({ ...state, walletAddress })),

      setSolBalance: (solBalance) =>
        set((state) => ({ ...state, solBalance })),

      setUser: (user) =>
        set((state) => ({ ...state, user })),

      setIsConnecting: (isConnecting) =>
        set((state) => ({ ...state, isConnecting })),

      setHasOnboarded: (hasOnboarded) =>
        set((state) => ({ ...state, hasOnboarded })),

      disconnect: () =>
        set((state) => ({
          ...state,
          walletAddress: null,
          solBalance: null,
          user: null,
          isConnecting: false,
        })),
    }),
    {
      name: 'seekerlens-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        network: state.network,
        hasOnboarded: state.hasOnboarded,
        walletAddress: state.walletAddress,
        user: state.user,
      }),
    },
  ),
);
