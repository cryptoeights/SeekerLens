// Compressed NFT minting via Metaplex Bubblegum + Umi
// Mints content as compressed NFTs (cNFTs) on Solana for cheap, scalable ownership proof.

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createTree,
  mintToCollectionV1,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum';
import {
  generateSigner,
  publicKey as umiPublicKey,
  type Umi,
} from '@metaplex-foundation/umi';

import { NETWORKS } from './constants';
import type { NetworkType } from './types';

// Merkle tree config for compressed NFTs
const MAX_DEPTH = 14;
const MAX_BUFFER_SIZE = 64;

/**
 * Create a Umi instance for the given network.
 */
export function createUmiInstance(network: NetworkType): Umi {
  const endpoint = NETWORKS[network].endpoint;
  return createUmi(endpoint).use(mplBubblegum());
}

/**
 * Create a new Merkle tree for storing compressed NFTs.
 * This only needs to be done once per collection.
 * Returns the tree's public key address.
 */
export async function createMerkleTree(
  umi: Umi,
): Promise<string | null> {
  try {
    const merkleTree = generateSigner(umi);

    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: MAX_DEPTH,
      maxBufferSize: MAX_BUFFER_SIZE,
    });

    await builder.sendAndConfirm(umi);

    return merkleTree.publicKey.toString();
  } catch (error) {
    console.error('[NFT] Failed to create Merkle tree:', error);
    return null;
  }
}

interface MintCompressedNFTParams {
  readonly umi: Umi;
  readonly merkleTreeAddress: string;
  readonly metadataUri: string;
  readonly name: string;
  readonly creatorAddress: string;
  readonly collectionMintAddress?: string;
}

/**
 * Mint a compressed NFT to the Merkle tree.
 * Returns the leaf/asset ID of the minted cNFT.
 */
export async function mintCompressedNFT(
  params: MintCompressedNFTParams,
): Promise<string | null> {
  try {
    const {
      umi,
      merkleTreeAddress,
      metadataUri,
      name,
      creatorAddress,
      collectionMintAddress,
    } = params;

    const merkleTree = umiPublicKey(merkleTreeAddress);
    const leafOwner = umiPublicKey(creatorAddress);

    if (collectionMintAddress) {
      // Mint to collection (preferred — groups all SeekerLens NFTs)
      const collectionMint = umiPublicKey(collectionMintAddress);

      const builder = mintToCollectionV1(umi, {
        leafOwner,
        merkleTree,
        collectionMint,
        metadata: {
          name: truncateName(name),
          symbol: 'SLENS',
          uri: metadataUri,
          sellerFeeBasisPoints: 500, // 5% creator royalty
          collection: { key: collectionMint, verified: false },
          creators: [
            { address: leafOwner, verified: false, share: 100 },
          ],
        },
      });

      const result = await builder.sendAndConfirm(umi);
      return result.signature.toString();
    }

    // Standalone mint (no collection)
    // Use mintV1 for standalone compressed NFTs
    // For MVP, we'll track the transaction signature as the NFT identifier
    console.warn('[NFT] Minting without collection — consider creating a collection');
    return null;
  } catch (error) {
    console.error('[NFT] Mint failed:', error);
    return null;
  }
}

/**
 * Truncate NFT name to 32 characters (Metaplex limit).
 */
function truncateName(name: string): string {
  const MAX_NAME_LENGTH = 32;
  if (name.length <= MAX_NAME_LENGTH) return name;
  return name.slice(0, MAX_NAME_LENGTH - 3) + '...';
}
