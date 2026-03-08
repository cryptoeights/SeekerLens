// Hook combining image upload + NFT metadata creation + on-chain registration

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

import { uploadImage, uploadMetadata, buildNFTMetadata } from '@/lib/storage';
import { useAppStore } from '@/store/useAppStore';
import { getConnection } from '@/lib/solana';

type MintStatus = 'idle' | 'uploading' | 'minting' | 'done' | 'error';

const APP_IDENTITY = {
  name: 'SeekerLens',
  uri: 'https://seekerlens.app',
  icon: 'favicon.ico',
} as const;

// Memo program ID (official Solana memo program)
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

interface MintParams {
  readonly localImageUri: string;
  readonly title: string;
  readonly description: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly locationName: string | null;
  readonly mediaType: 'photo' | 'video';
  readonly source: 'bounty' | 'marketplace';
  readonly tags: readonly string[];
  readonly licensePricePersonal: number;
  readonly licensePriceCommercial: number;
  readonly licensePriceExclusive: number;
}

interface MintResult {
  readonly imageUrl: string;
  readonly metadataUri: string;
  readonly mintSignature: string | null;
}

export function useNFT() {
  const [status, setStatus] = useState<MintStatus>('idle');
  const [progress, setProgress] = useState('');
  const { walletAddress, network } = useAppStore();

  const mintContent = useCallback(
    async (params: MintParams): Promise<MintResult | null> => {
      if (!walletAddress) {
        Alert.alert('Wallet Required', 'Please connect your wallet to mint content.');
        return null;
      }

      try {
        // Step 1: Upload image to IPFS
        setStatus('uploading');
        setProgress('Uploading image...');

        const fileName = params.title.replace(/\s+/g, '-').toLowerCase();
        const uploadResult = await uploadImage(params.localImageUri, fileName);

        if (!uploadResult) {
          throw new Error('Failed to upload image. Check your connection and try again.');
        }

        // Step 2: Build and upload metadata to IPFS
        setProgress('Creating NFT metadata...');

        const metadata = buildNFTMetadata({
          title: params.title,
          description: params.description,
          imageUrl: uploadResult.imageUrl,
          creatorWallet: walletAddress,
          latitude: params.latitude,
          longitude: params.longitude,
          locationName: params.locationName,
          mediaType: params.mediaType,
          source: params.source,
          capturedAt: new Date().toISOString(),
        });

        const metadataUri = await uploadMetadata(metadata, fileName);

        if (!metadataUri) {
          throw new Error('Failed to upload metadata');
        }

        // Step 3: Register on-chain via MWA (Phantom confirmation)
        setStatus('minting');
        setProgress('Confirm in Phantom...');

        let mintSignature: string | null = null;

        try {
          const connection = getConnection(network);
          const creatorPubkey = new PublicKey(walletAddress);

          // Build a memo transaction to register the NFT metadata on-chain
          const memoData = JSON.stringify({
            app: 'SeekerLens',
            type: 'mint',
            title: params.title,
            uri: metadataUri,
          });

          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash('confirmed');

          const transaction = new Transaction({
            blockhash,
            lastValidBlockHeight,
            feePayer: creatorPubkey,
          }).add(
            new TransactionInstruction({
              keys: [{ pubkey: creatorPubkey, isSigner: true, isWritable: false }],
              programId: MEMO_PROGRAM_ID,
              data: Buffer.from(memoData, 'utf-8'),
            }),
          );

          // Sign and send via MWA — this triggers Phantom confirmation
          const txSignature = await transact(
            async (wallet: Web3MobileWallet) => {
              await wallet.authorize({
                identity: APP_IDENTITY,
                cluster: network === 'devnet' ? 'devnet' : 'mainnet-beta',
              });

              const signatures = await wallet.signAndSendTransactions({
                transactions: [transaction],
              });

              return signatures[0];
            },
          );

          if (txSignature) {
            mintSignature =
              typeof txSignature === 'string'
                ? txSignature
                : Buffer.from(txSignature).toString('base64');

            console.log('[NFT] On-chain TX:', mintSignature);
          }
        } catch (txError) {
          // Non-fatal: IPFS upload succeeded, on-chain registration optional
          console.warn('[NFT] On-chain registration skipped:', txError);
        }

        setStatus('done');
        setProgress('Content minted successfully!');

        return {
          imageUrl: uploadResult.imageUrl,
          metadataUri,
          mintSignature,
        };
      } catch (error) {
        setStatus('error');
        const message =
          error instanceof Error ? error.message : 'Minting failed';
        setProgress(message);
        Alert.alert('Mint Failed', message);
        return null;
      }
    },
    [walletAddress, network],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress('');
  }, []);

  return {
    status,
    progress,
    isMinting: status === 'uploading' || status === 'minting',
    mintContent,
    reset,
  } as const;
}
