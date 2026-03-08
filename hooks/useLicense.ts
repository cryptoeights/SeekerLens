// Hook for purchasing content licenses via SOL transfer (MWA)

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

import { useAppStore } from '@/store/useAppStore';
import { getConnection } from '@/lib/solana';
import { createLicense } from '@/lib/api/licenses';
import type { LicenseType } from '@/lib/types';

const LAMPORTS_PER_SOL = 1_000_000_000;

const APP_IDENTITY = {
  name: 'SeekerLens',
  uri: 'https://seekerlens.app',
  icon: 'favicon.ico',
} as const;

type PurchaseStatus = 'idle' | 'confirming' | 'signing' | 'recording' | 'done' | 'error';

interface PurchaseParams {
  readonly contentId: string;
  readonly creatorWallet: string;
  readonly licenseType: LicenseType;
  readonly priceSol: number;
}

interface PurchaseResult {
  readonly txSignature: string;
  readonly licenseId: string;
}

export function useLicense() {
  const [status, setStatus] = useState<PurchaseStatus>('idle');
  const [progress, setProgress] = useState('');
  const { walletAddress, network, user } = useAppStore();

  const purchaseLicense = useCallback(
    async (params: PurchaseParams): Promise<PurchaseResult | null> => {
      if (!walletAddress) {
        Alert.alert('Wallet Required', 'Please connect your wallet to purchase a license.');
        return null;
      }

      if (!user?.id) {
        Alert.alert('Profile Required', 'Please set up your profile first.');
        return null;
      }

      if (walletAddress === params.creatorWallet) {
        Alert.alert('Invalid Purchase', 'You cannot purchase a license for your own content.');
        return null;
      }

      try {
        // Step 1: Confirm purchase
        setStatus('confirming');
        setProgress('Preparing transaction...');

        const connection = getConnection(network);
        const lamports = Math.round(params.priceSol * LAMPORTS_PER_SOL);

        const buyerPubkey = new PublicKey(walletAddress);
        const creatorPubkey = new PublicKey(params.creatorWallet);

        // Build the transfer transaction
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash('confirmed');

        const transaction = new Transaction({
          blockhash,
          lastValidBlockHeight,
          feePayer: buyerPubkey,
        }).add(
          SystemProgram.transfer({
            fromPubkey: buyerPubkey,
            toPubkey: creatorPubkey,
            lamports,
          }),
        );

        // Step 2: Sign & send via MWA
        setStatus('signing');
        setProgress('Approve in your wallet...');

        const txSignature = await transact(
          async (wallet: Web3MobileWallet) => {
            // Re-authorize for this session
            await wallet.authorize({
              identity: APP_IDENTITY,
              cluster: network === 'devnet' ? 'devnet' : 'mainnet-beta',
            });

            // Sign and send the transaction
            const signatures = await wallet.signAndSendTransactions({
              transactions: [transaction],
            });

            return signatures[0];
          },
        );

        if (!txSignature) {
          throw new Error('Transaction was not signed');
        }

        // Encode signature to base58 string
        const signatureStr =
          typeof txSignature === 'string'
            ? txSignature
            : Buffer.from(txSignature).toString('base64');

        console.log('[License] TX signature:', signatureStr);

        // Step 3: Record license in Supabase
        setStatus('recording');
        setProgress('Recording license...');

        const license = await createLicense({
          content_id: params.contentId,
          buyer_id: user.id,
          license_type: params.licenseType,
          price_sol: params.priceSol,
          tx_signature: signatureStr,
        });

        if (!license) {
          // TX succeeded but DB record failed — non-fatal
          console.warn('[License] DB record failed, TX was successful:', signatureStr);
          Alert.alert(
            'Partial Success',
            'Payment sent but license record failed. Please contact support with your transaction signature.',
          );
          return { txSignature: signatureStr, licenseId: '' };
        }

        setStatus('done');
        setProgress('License acquired!');

        return {
          txSignature: signatureStr,
          licenseId: license.id,
        };
      } catch (error) {
        setStatus('error');
        const message =
          error instanceof Error ? error.message : 'License purchase failed';
        setProgress(message);
        Alert.alert('Purchase Failed', message);
        return null;
      }
    },
    [walletAddress, network, user],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress('');
  }, []);

  return {
    status,
    progress,
    isPurchasing: status === 'confirming' || status === 'signing' || status === 'recording',
    purchaseLicense,
    reset,
  } as const;
}
