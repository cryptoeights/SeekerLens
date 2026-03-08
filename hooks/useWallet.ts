import { useCallback, useEffect, useMemo } from 'react';
import { Alert, AppState } from 'react-native';
import { PublicKey } from '@solana/web3.js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

import { useAppStore } from '@/store/useAppStore';
import { getConnection, formatSol } from '@/lib/solana';
import { findOrCreateUser } from '@/lib/api/users';

const APP_IDENTITY = {
  name: 'SeekerLens',
  uri: 'https://seekerlens.app',
  icon: 'favicon.ico',
} as const;

export function useWallet() {
  const {
    walletAddress,
    solBalance,
    isConnecting,
    network,
    setWalletAddress,
    setSolBalance,
    setIsConnecting,
    setUser,
    disconnect: storeDisconnect,
  } = useAppStore();

  const publicKey = useMemo(() => {
    if (!walletAddress) return null;
    try {
      return new PublicKey(walletAddress);
    } catch {
      return null;
    }
  }, [walletAddress]);

  const fetchBalance = useCallback(
    async (address: string) => {
      try {
        const connection = getConnection(network);
        const pk = new PublicKey(address);
        const lamports = await connection.getBalance(pk);
        setSolBalance(formatSol(lamports));
      } catch {
        setSolBalance(null);
      }
    },
    [network, setSolBalance],
  );

  const connect = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      const authResult = await transact(
        async (wallet: Web3MobileWallet) => {
          const result = await wallet.authorize({
            identity: APP_IDENTITY,
            cluster: network === 'devnet' ? 'devnet' : 'mainnet-beta',
          });
          return result;
        },
      );

      const address = authResult.accounts[0]?.address;
      if (!address) {
        throw new Error('No account returned from wallet');
      }

      const base58Address =
        typeof address === 'string'
          ? address
          : new PublicKey(address).toBase58();

      setWalletAddress(base58Address);
      await fetchBalance(base58Address);

      // Create or fetch user record in Supabase
      const user = await findOrCreateUser(base58Address);
      if (user) {
        setUser(user);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to connect wallet';
      Alert.alert('Connection Failed', message);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, network, setIsConnecting, setWalletAddress, setUser, fetchBalance]);

  const disconnect = useCallback(() => {
    storeDisconnect();
  }, [storeDisconnect]);

  const refreshBalance = useCallback(async () => {
    if (walletAddress) {
      await fetchBalance(walletAddress);
    }
  }, [walletAddress, fetchBalance]);

  // Auto-refresh balance when network changes or app returns to foreground
  useEffect(() => {
    if (!walletAddress) return;
    fetchBalance(walletAddress);
  }, [walletAddress, network, fetchBalance]);

  useEffect(() => {
    if (!walletAddress) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        fetchBalance(walletAddress);
      }
    });
    return () => subscription.remove();
  }, [walletAddress, fetchBalance]);

  return {
    publicKey,
    walletAddress,
    solBalance,
    connected: walletAddress !== null,
    connecting: isConnecting,
    connect,
    disconnect,
    refreshBalance,
  } as const;
}
