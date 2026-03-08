// Decentralized storage via IPFS (Pinata) for permanent NFT content
// Fallback to Supabase Storage if IPFS upload fails

import { File } from 'expo-file-system';

import { supabase } from './supabase';

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_JWT = process.env.EXPO_PUBLIC_PINATA_JWT ?? '';
const PINATA_GATEWAY = process.env.EXPO_PUBLIC_PINATA_GATEWAY ?? 'gateway.pinata.cloud';
const SUPABASE_FALLBACK_BUCKET = 'content';

interface UploadResult {
  readonly imageUrl: string;
  readonly thumbnailUrl: string | null;
  readonly storage: 'ipfs' | 'supabase';
}

export interface NFTMetadata {
  readonly name: string;
  readonly symbol: string;
  readonly description: string;
  readonly image: string;
  readonly attributes: ReadonlyArray<{
    readonly trait_type: string;
    readonly value: string;
  }>;
  readonly properties: {
    readonly category: string;
    readonly files: ReadonlyArray<{
      readonly uri: string;
      readonly type: string;
    }>;
  };
}

/**
 * Upload an image to IPFS via Pinata.
 * Falls back to Supabase Storage if Pinata is unavailable.
 */
export async function uploadImage(
  localUri: string,
  fileName: string,
): Promise<UploadResult | null> {
  try {
    console.log('[Storage] Starting upload for:', localUri);
    console.log('[Storage] Pinata JWT present:', !!PINATA_JWT);

    // Attempt 1: Upload via RN FormData with file URI (most reliable on RN)
    const ipfsUrl = await uploadFileURIToIPFS(localUri, `${fileName}.jpg`);
    if (ipfsUrl) {
      return { imageUrl: ipfsUrl, thumbnailUrl: ipfsUrl, storage: 'ipfs' };
    }

    // Attempt 2: Read file as base64, upload via XHR
    console.log('[Storage] File URI approach failed, trying base64 via XHR...');
    try {
      const file = new File(localUri);
      const base64 = await file.base64();
      if (base64) {
        console.log('[Storage] Base64 length:', base64.length);

        const ipfsUrl2 = await uploadBase64ToIPFS(base64, `${fileName}.jpg`, 'image/jpeg');
        if (ipfsUrl2) {
          return { imageUrl: ipfsUrl2, thumbnailUrl: ipfsUrl2, storage: 'ipfs' };
        }

        // Fallback: Supabase Storage
        console.warn('[Storage] Falling back to Supabase Storage');
        const bytes = decodeBase64(base64);
        return uploadToSupabase(bytes, fileName);
      }
    } catch (e) {
      console.warn('[Storage] base64 read failed:', e);
    }

    console.warn('[Storage] All upload methods failed');
    return null;
  } catch (error) {
    console.error('[Storage] Upload error:', error);
    return null;
  }
}

/**
 * Upload using React Native's FormData with file URI.
 * This is the standard RN approach for file uploads.
 */
async function uploadFileURIToIPFS(
  fileUri: string,
  fileName: string,
): Promise<string | null> {
  if (!PINATA_JWT) {
    console.warn('[Storage] Pinata JWT not configured — skipping IPFS');
    return null;
  }

  try {
    console.log('[Storage] Uploading via file URI to Pinata...');

    const formData = new FormData();

    // React Native FormData accepts { uri, name, type } for file uploads
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'image/jpeg',
    } as unknown as Blob);

    formData.append('pinataMetadata', JSON.stringify({ name: fileName }));
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        // Do NOT set Content-Type — RN sets it with boundary automatically
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Storage] Pinata file URI upload failed:', response.status, errorText);
      return null;
    }

    const result = await response.json();
    console.log('[Storage] IPFS uploaded via file URI:', result.IpfsHash);
    return `https://${PINATA_GATEWAY}/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.warn('[Storage] File URI upload error:', error);
    return null;
  }
}

/**
 * Upload NFT metadata JSON to IPFS via Pinata.
 * Falls back to Supabase Storage if Pinata is unavailable.
 */
export async function uploadMetadata(
  metadata: NFTMetadata,
  fileName: string,
): Promise<string | null> {
  try {
    // Try IPFS via Pinata first
    const ipfsUrl = await uploadJSONToIPFS(metadata, `${fileName}-metadata`);
    if (ipfsUrl) return ipfsUrl;

    // Fallback: Supabase Storage
    console.warn('[Storage] Metadata fallback to Supabase');
    const jsonString = JSON.stringify(metadata);
    const filePath = `metadata/${Date.now()}_${fileName}.json`;
    const { error } = await supabase.storage
      .from(SUPABASE_FALLBACK_BUCKET)
      .upload(filePath, jsonString, {
        contentType: 'application/json',
        upsert: false,
      });

    if (error) {
      console.error('[Storage] Supabase metadata upload failed:', error.message);
      return null;
    }

    const { data } = supabase.storage
      .from(SUPABASE_FALLBACK_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('[Storage] Metadata upload error:', error);
    return null;
  }
}

/**
 * Build NFT metadata following the Metaplex standard.
 */
export function buildNFTMetadata(params: {
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly creatorWallet: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly locationName: string | null;
  readonly mediaType: 'photo' | 'video';
  readonly source: 'bounty' | 'marketplace';
  readonly capturedAt: string;
}): NFTMetadata {
  const attributes = [
    { trait_type: 'Creator', value: params.creatorWallet },
    { trait_type: 'Media Type', value: params.mediaType },
    { trait_type: 'Source', value: params.source },
    { trait_type: 'Captured At', value: params.capturedAt },
    { trait_type: 'App', value: 'SeekerLens' },
  ];

  if (params.latitude !== null && params.longitude !== null) {
    attributes.push(
      { trait_type: 'Latitude', value: String(params.latitude) },
      { trait_type: 'Longitude', value: String(params.longitude) },
    );
  }

  if (params.locationName) {
    attributes.push({ trait_type: 'Location', value: params.locationName });
  }

  return {
    name: `SeekerLens: ${params.title}`,
    symbol: 'SLENS',
    description: `Captured via SeekerLens${params.locationName ? ` at ${params.locationName}` : ''}`,
    image: params.imageUrl,
    attributes,
    properties: {
      category: 'image',
      files: [{ uri: params.imageUrl, type: 'image/jpeg' }],
    },
  };
}

// ---------------------------------------------------------------------------
// Pinata IPFS helpers (REST API — no SDK needed)
// ---------------------------------------------------------------------------

/**
 * Upload a base64-encoded file to IPFS via Pinata using XHR.
 * XHR + FormData with Blob is more reliable than fetch on some RN versions.
 */
async function uploadBase64ToIPFS(
  base64Data: string,
  fileName: string,
  _contentType: string,
): Promise<string | null> {
  if (!PINATA_JWT) {
    console.warn('[Storage] Pinata JWT not configured — skipping IPFS');
    return null;
  }

  try {
    console.log('[Storage] Uploading to Pinata via XHR + Blob...');

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Promise<string | null>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${PINATA_API_URL}/pinning/pinFileToIPFS`);
      xhr.setRequestHeader('Authorization', `Bearer ${PINATA_JWT}`);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            console.log('[Storage] IPFS uploaded via XHR:', result.IpfsHash);
            resolve(`https://${PINATA_GATEWAY}/ipfs/${result.IpfsHash}`);
          } catch {
            console.error('[Storage] Failed to parse Pinata response');
            resolve(null);
          }
        } else {
          console.error('[Storage] Pinata XHR failed:', xhr.status, xhr.responseText);
          resolve(null);
        }
      };

      xhr.onerror = () => {
        console.error('[Storage] Pinata XHR network error');
        resolve(null);
      };

      const formData = new FormData();
      const blob = new Blob([bytes], { type: 'image/jpeg' });
      formData.append('file', blob, fileName);
      formData.append('pinataMetadata', JSON.stringify({ name: fileName }));
      formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

      xhr.send(formData);
    });
  } catch (error) {
    console.warn('[Storage] XHR upload error:', error);
    return null;
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata's pinJSONToIPFS endpoint.
 * Returns the gateway URL or null if failed.
 */
async function uploadJSONToIPFS(
  json: object,
  name: string,
): Promise<string | null> {
  if (!PINATA_JWT) {
    console.warn('[Storage] Pinata JWT not configured — skipping IPFS');
    return null;
  }

  try {
    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pinataContent: json,
        pinataMetadata: { name },
        pinataOptions: { cidVersion: 1 },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Storage] Pinata JSON upload failed:', response.status, errorText);
      return null;
    }

    const result = await response.json();
    const cid = result.IpfsHash;

    console.log('[Storage] IPFS JSON uploaded:', cid);
    return `https://${PINATA_GATEWAY}/ipfs/${cid}`;
  } catch (error) {
    console.warn('[Storage] IPFS JSON upload error:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Supabase fallback
// ---------------------------------------------------------------------------

/**
 * Fallback: Upload image to Supabase Storage.
 */
async function uploadToSupabase(
  bytes: Uint8Array,
  fileName: string,
): Promise<UploadResult | null> {
  const filePath = `photos/${Date.now()}_${fileName}`;
  const { error } = await supabase.storage
    .from(SUPABASE_FALLBACK_BUCKET)
    .upload(filePath, bytes, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) {
    console.error('[Storage] Supabase upload failed:', error.message);
    return null;
  }

  const { data } = supabase.storage
    .from(SUPABASE_FALLBACK_BUCKET)
    .getPublicUrl(filePath);

  return {
    imageUrl: data.publicUrl,
    thumbnailUrl: data.publicUrl,
    storage: 'supabase',
  };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/**
 * Decode base64 string to Uint8Array.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
