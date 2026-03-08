import { Connection } from '@solana/web3.js';

import { NETWORKS } from './constants';
import type { NetworkType } from './types';

const LAMPORTS_PER_SOL = 1_000_000_000;
const ADDRESS_PREFIX_LENGTH = 4;
const ADDRESS_SUFFIX_LENGTH = 4;

/**
 * Creates a Solana RPC connection for the given network.
 * Returns a new Connection instance each time to avoid stale state.
 */
export function getConnection(network: NetworkType): Connection {
  const endpoint = NETWORKS[network].endpoint;
  return new Connection(endpoint, 'confirmed');
}

/**
 * Truncates a wallet address for display.
 * Example: "DKx4abcdefghijklmnopqrstuvwxyzf9Qp" -> "DKx4...f9Qp"
 */
export function formatWalletAddress(address: string): string {
  if (address.length <= ADDRESS_PREFIX_LENGTH + ADDRESS_SUFFIX_LENGTH) {
    return address;
  }

  const prefix = address.slice(0, ADDRESS_PREFIX_LENGTH);
  const suffix = address.slice(-ADDRESS_SUFFIX_LENGTH);
  return `${prefix}...${suffix}`;
}

/**
 * Converts lamports (smallest Solana unit) to SOL.
 * Returns a number rounded to 4 decimal places.
 */
export function formatSol(lamports: number): number {
  return Math.round((lamports / LAMPORTS_PER_SOL) * 10_000) / 10_000;
}
