<p align="center">
  <img src="assets/banner.png" alt="SeekerLens Banner" width="100%" />
</p>

# SeekerLens

**Capture. Mint. Earn.**

A decentralized visual content marketplace and bounty platform — built natively for Solana Mobile.

> MONOLITH Solana Mobile Hackathon 2026

## Download APK

- [Google Drive](https://drive.google.com/drive/folders/1_WOr0G9YvorhFW9VPr1X4vbeU5BrQbGC?usp=sharing)
- [GitHub Releases](../../releases)

## What is SeekerLens?

SeekerLens turns every Seeker device into a money-making camera. Photographers earn SOL by fulfilling location-based photo bounties or selling licensed content — all verified on-chain.

### Three Pillars

1. **Bounty Board** — Anyone posts a photo request with a SOL reward. Nearby photographers fulfill it, get paid instantly on approval.
2. **Content Marketplace** — Creators list photos with tiered licenses (personal / commercial / exclusive). Buyers acquire licenses with SOL, recorded on-chain.
3. **Discovery Feed** — Trending content, top creators, and open bounties for organic discovery.

## Key Features

- In-app camera with live GPS tagging and reverse geocoding
- One-tap compressed NFT minting via Metaplex Bubblegum (~$0.001/mint)
- Three-tier license purchasing (Personal 0.05 SOL / Commercial 0.5 SOL / Exclusive 2.0 SOL)
- Bounty lifecycle — create, fund, browse, fulfill, approve, pay
- Mobile Wallet Adapter (MWA) — native one-tap wallet transactions
- Profile gallery with NFT collection and earnings dashboard
- Devnet/mainnet toggle

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (Custom Dev Build) |
| Wallet | Mobile Wallet Adapter (MWA) |
| Blockchain | Solana (cNFTs via Bubblegum, SOL transfers, license records) |
| Storage | IPFS via Pinata, Supabase Storage fallback |
| Backend | Supabase (users, bounties, content, licenses) |
| Camera | expo-camera + expo-location |
| State | Zustand with AsyncStorage persistence |

## Why Solana Mobile?

This app could not exist without Solana Mobile:

- **Mobile Wallet Adapter** — native wallet connect, no browser extensions
- **Compressed NFTs** — mint photos as NFTs for fractions of a cent
- **Sub-second finality** — payments settle instantly
- **Seeker device** — crypto-native camera in millions of pockets
- **dApp Store** — native Android distribution

## Project Structure

```
app/                    # Screens (Expo Router)
  (tabs)/               # Bottom tab screens (Home, Explore, Create, Profile)
  bounty/               # Bounty detail, create, manage
  content/              # Content detail, post
  camera.tsx            # Camera with GPS tagging
  onboarding.tsx        # Wallet connect onboarding
  settings.tsx          # App settings
components/             # Reusable UI components
  ui/                   # Primitives (Button, Card, Tag, Avatar, etc.)
  home/                 # Home screen components
  profile/              # Profile components
  wallet/               # Wallet button
hooks/                  # Custom hooks (useWallet, useNFT, useLicense)
lib/                    # Core libraries
  api/                  # Supabase API helpers
  constants.ts          # Design tokens
  types.ts              # TypeScript types
  solana.ts             # Solana connection helpers
  nft.ts                # Compressed NFT minting
  storage.ts            # IPFS upload (Pinata)
  supabase.ts           # Supabase client
store/                  # Zustand global store
```

## Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in credentials
4. Setup Supabase project and run `docs/supabase-schema.sql`
5. Setup Pinata IPFS account
6. `npx expo prebuild`
7. `eas build --profile development`

## License

MIT
