# SeekerLens — Product Requirements Document

## 1. Overview

### Product Name
**SeekerLens**

### Tagline
Capture. Mint. Earn.

### One-Liner
A decentralized visual content marketplace and bounty platform on Solana Mobile where anyone can create photo/video quests, fulfill them for SOL rewards, and trade content licenses as NFTs.

### Target Platform
Android (Solana dApp Store) — built for Seeker community

### Hackathon
MONOLITH Solana Mobile Hackathon (Feb 2 - Mar 9, 2026)

---

## 2. Problem Statement

### For Content Buyers
- Stock photography platforms are expensive, centralized, and generic
- No way to request specific content at specific locations
- Licensing is opaque and controlled by middlemen

### For Content Creators (Photographers/Videographers)
- Hard to monetize casual/mobile photography
- No direct connection to buyers who need specific content
- Platforms take 40-60% commission
- No ownership proof or provenance tracking

### The Gap
There is no mobile-native platform where:
- Anyone can post a bounty saying "I need a photo of X at location Y"
- Photographers nearby can fulfill it and earn crypto instantly
- Content creators can post their work and sell licenses directly
- All content has verifiable ownership via NFTs
- Payments are trustless and instant via Solana

---

## 3. Solution

SeekerLens is a mobile-first content marketplace with three pillars:

### Pillar 1: Bounty System (Demand-Driven)
Requesters create location-based bounties for specific visual content. Photographers fulfill bounties, content is minted as NFT, and payment is released automatically.

### Pillar 2: Content Marketplace (Supply-Driven)
Creators post photos/videos to the marketplace. Other users browse and acquire licenses (personal, commercial, or exclusive). Creators retain NFT ownership.

### Pillar 3: Social Feed (Discovery)
A feed showcasing completed bounties, trending content, and top creators. Users can like, follow creators, and discover content organically.

---

## 4. Target Users

### Primary: Seeker Device Owners
- Early adopters in Solana Mobile ecosystem
- Crypto-native, comfortable with wallets and tokens
- Looking for unique mobile-first dApps

### Secondary: Mobile Photographers & Content Creators
- Casual to semi-pro photographers
- Want to monetize their mobile photography
- Value ownership and direct-to-buyer sales

### Tertiary: Content Buyers
- Brands, marketers, bloggers needing specific visual content
- Tourism boards wanting location-specific imagery
- Anyone who needs custom photos/videos from specific places

---

## 5. User Stories

### As a Content Creator (Photographer)
- I want to browse nearby bounties so I can earn SOL by taking photos
- I want to post my photos to the marketplace so others can buy licenses
- I want my photos minted as NFTs so I have verifiable ownership
- I want to see my earnings and license sales in my profile
- I want GPS verification on my content to prove authenticity

### As a Bounty Creator (Requester)
- I want to create a bounty for specific visual content at a location
- I want to deposit SOL as reward so photographers trust the payment
- I want to review submissions and approve the best ones
- I want to receive a license for the approved content automatically

### As a Content Buyer (License Acquirer)
- I want to browse the marketplace for quality visual content
- I want to purchase licenses (personal/commercial/exclusive) with SOL
- I want proof of my license purchase on-chain
- I want to see content details including location, creator, and authenticity

### As Any User
- I want to connect my wallet easily via Mobile Wallet Adapter
- I want a clean home feed showing trending content and open bounties
- I want to switch between devnet and mainnet for testing
- I want the app to feel native and polished, not like a web wrapper

---

## 6. Features & Prioritization

### P0 — Must Have (MVP)

#### 6.1 Wallet Connection
- Connect via Mobile Wallet Adapter (MWA)
- Display wallet address (truncated) and SOL balance
- Support disconnect/switch wallet
- Devnet/mainnet toggle in settings

#### 6.2 Home Feed (Beranda)
- Featured content section (hero card, horizontal scroll)
- Open bounties section (horizontal card scroll with reward amount, location, deadline, slots remaining)
- Completed bounties section (vertical list with photo, creator, amount earned)
- Trending content section (masonry/grid layout of marketplace content)
- Pull-to-refresh

#### 6.3 Create Bounty
- Form fields: title, description, media type (photo/video/both)
- Location picker (map pin + radius)
- Reward amount (SOL)
- Max submissions, deadline
- Tags (nature, urban, food, architecture, etc.)
- Deposit SOL to escrow on submit

#### 6.4 Browse Bounties
- List view with filter/sort (newest, highest reward, nearest, deadline)
- Map view showing bounty pins by location
- Bounty detail screen with full info, submissions count, creator profile

#### 6.5 Camera & Content Capture
- In-app camera (photo mode)
- Auto GPS tagging (latitude, longitude)
- Timestamp embedding
- Two submission modes:
  - "Fulfill Bounty" — submit to specific bounty
  - "Post to Marketplace" — post freely with license prices

#### 6.6 Content Submission & NFT Minting
- After capture: add title, description, tags
- Set license prices (personal, commercial, exclusive)
- Mint as compressed NFT (Metaplex Bubblegum)
- Upload image to decentralized storage (Arweave/IPFS)
- GPS + timestamp embedded in NFT metadata

#### 6.7 Content Detail Screen
- Full-screen photo view
- Creator info (avatar, username, stats)
- Location info with mini map
- License options with prices
- "Acquire License" button (SOL payment)
- License count (how many sold)

#### 6.8 License Purchase
- Select license type (personal/commercial/exclusive)
- Confirm SOL amount
- Sign transaction via MWA
- On-chain record of license purchase
- Confirmation screen with transaction link

#### 6.9 Profile
- Avatar, username, bio
- Wallet balance display
- Stats: total earned, total spent, content count, bounties completed
- Tabs: My Gallery (my NFTs), My Bounties (created/fulfilled), Licenses Purchased
- Gallery as masonry grid

#### 6.10 Bounty Management
- View submissions for my bounties
- Approve/reject submissions
- On approve: release SOL payment to creator
- On expire: refund remaining SOL to bounty creator

### P1 — Should Have

#### 6.11 Search & Explore
- Search by keyword, tag, location
- Filter by content type, price range, license type
- Discover creators

#### 6.12 Notifications
- New submission on my bounty
- Bounty approved/rejected
- License purchased on my content
- Bounty expiring soon

#### 6.13 Video Support
- Video capture mode
- Video playback in feed and detail screens
- Video NFT minting

### P2 — Nice to Have

#### 6.14 GPS Radius Verification
- Verify photographer was within bounty's specified radius
- Show verification badge on content

#### 6.15 Social Features
- Like/favorite content
- Follow creators
- Comments on content

#### 6.16 Creator Analytics
- Earnings over time chart
- Most popular content
- License breakdown

#### 6.17 SKR Token Integration
- Accept SKR as payment method (bonus track for $10K SKR prize)
- SKR rewards for platform activity

---

## 7. Design System & Branding

### 7.1 Design Philosophy
- **Light, clean, minimal** — inspired by modern fintech apps
- **Content-first** — photos and videos are the heroes
- **Generous whitespace** — breathable layouts
- **Soft depth** — subtle shadows, no harsh borders
- **Warm & approachable** — not cold crypto aesthetic
- **Anti AI-slop** — no gratuitous gradients, glassmorphism, or neon

### 7.2 Color Palette

#### Core Colors
```
Background:       #FAFAFA  (warm off-white)
Surface/Cards:    #FFFFFF  (pure white)
Surface Secondary:#F5F5F5  (light gray, subtle sections)
```

#### Text
```
Text Primary:     #1A1A2E  (near-black with slight warmth)
Text Secondary:   #6B7280  (medium gray)
Text Tertiary:    #9CA3AF  (light gray, captions)
```

#### Accent & Brand
```
Primary Blue:     #3B82F6  (action buttons, links, primary CTA)
Primary Blue Light:#EFF6FF  (blue tint backgrounds, tags)
Secondary Green:  #10B981  (success, earnings, completed)
Secondary Green Light: #ECFDF5
```

#### Functional
```
Warning/Pending:  #F59E0B  (amber, deadlines)
Error/Reject:     #EF4444  (red, errors)
SOL Purple:       #9945FF  (Solana brand, SOL amounts only)
SOL Purple Light: #F3EEFF  (SOL badge background)
```

#### Category Tags (soft tint backgrounds)
```
Nature:     #ECFDF5 text #059669
Urban:      #EFF6FF text #2563EB
Food:       #FFF7ED text #EA580C
Portrait:   #FDF2F8 text #DB2777
Architecture:#F5F3FF text #7C3AED
Travel:     #ECFEFF text #0891B2
```

#### Gradients (used sparingly)
```
Card highlight: linear-gradient(135deg, #DBEAFE, #EDE9FE)
  (soft blue-to-lavender, like the VISA card in reference)
SOL reward badge: linear-gradient(135deg, #9945FF, #14F195)
  (Solana brand gradient, used only on SOL indicators)
```

### 7.3 Typography

#### Font Family
**Inter** (primary) — clean, modern, excellent readability on mobile
- Fallback: SF Pro Display (iOS), Roboto (Android)

#### Scale
```
Display:    32px / Bold    (hero sections, large numbers)
Heading 1:  28px / Bold    (screen titles like "Overview")
Heading 2:  22px / Semibold(section headers)
Heading 3:  18px / Semibold(card titles)
Body:       16px / Regular (main content)
Body Small: 14px / Regular (descriptions, secondary info)
Caption:    12px / Medium  (timestamps, tags, metadata)
Overline:   11px / Semibold / Uppercase / Tracking wide (section labels)
```

### 7.4 Spacing & Layout
```
Screen padding:     20px horizontal
Card padding:       16px
Card border-radius: 16px
Card shadow:        0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)
Section gap:        24px
Element gap:        12px
Bottom nav height:  64px + safe area
```

### 7.5 Component Patterns

#### Cards
- White background on #FAFAFA surface
- 16px border-radius, soft shadow
- No visible borders (depth via shadow only)
- Content cards: full-bleed image top, info bottom

#### Buttons
- Primary: #3B82F6 background, white text, 12px radius, 48px height
- Secondary: #F5F5F5 background, dark text, 12px radius
- Ghost: transparent, #3B82F6 text

#### Tags/Chips
- Soft colored background with matching text (see category colors)
- 8px radius, 8px horizontal padding, 4px vertical
- Caption size text

#### Avatar
- Circular, 40px default, 32px small, 64px large
- 2px white border when on colored backgrounds

#### Bottom Navigation
- White background, top border: 1px #F0F0F0
- 4 items: Home, Explore, Camera (+), Profile
- Active: #3B82F6 icon + label
- Inactive: #9CA3AF icon + label
- Camera button: larger, #3B82F6 filled circle

#### SOL Amount Display
- Small badge: #F3EEFF background, #9945FF text
- Format: "0.5 SOL" with Solana icon
- Used consistently across bounty cards, detail screens, profile

### 7.6 Iconography
- Style: Outlined, 24px, 1.5px stroke weight
- Library: Lucide Icons (consistent, clean, open source)
- Special: Solana logo icon for SOL amounts

### 7.7 Motion & Animation
- Screen transitions: slide horizontal (native feel)
- Cards: subtle scale on press (0.98)
- Pull to refresh: smooth spring
- Content load: skeleton shimmer (light gray pulse)
- No bouncy/flashy animations — smooth and purposeful

---

## 8. Screen Specifications

### 8.1 Home / Beranda

```
[StatusBar]
┌──────────────────────────────────┐
│  SeekerLens              [Avatar]│  ← header: logo left, profile right
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │   [Featured Photo]         │  │  ← hero card, full width
│  │                            │  │     soft blue-lavender gradient overlay
│  │              ◎ 2.4 SOL     │  │     at bottom
│  │   "Sunrise at Bromo"       │  │
│  │   by @andi · 12 licenses   │  │
│  └────────────────────────────┘  │
│                                  │
│  OPEN BOUNTIES  4        See all>│  ← overline label + count
│                                  │
│  ┌────────┐ ┌────────┐ ┌─────── │  ← horizontal scroll cards
│  │[img]   │ │[img]   │ │[img]   │
│  │        │ │        │ │        │
│  │Bromo   │ │Pantai  │ │River   │
│  │Sunset  │ │Kuta    │ │Citarum │
│  │◎ 0.5   │ │◎ 0.3   │ │◎ 0.2   │
│  │3/5 left│ │1/3 left│ │0/10    │
│  │2d left │ │5d left │ │7d left │
│  └────────┘ └────────┘ └─────── │
│                                  │
│  COMPLETED  12           See all>│
│                                  │
│  ┌────────────────────────────┐  │
│  │ [thumb] │ Sunset at Semeru │  │  ← list card
│  │  img    │ @dian · ✓ Done   │  │
│  │         │ Earned 0.5 SOL   │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ [thumb] │ Street Food Mlg  │  │
│  │  img    │ @budi · ✓ Done   │  │
│  │         │ Earned 0.3 SOL   │  │
│  └────────────────────────────┘  │
│                                  │
│  TRENDING CONTENT        See all>│
│                                  │
│  ┌──────┐ ┌──────┐              │  ← masonry grid 2 columns
│  │      │ │      │              │
│  │ img  │ │ img  │              │
│  │      │ │      │              │
│  │◎ 0.1 │ └──────┘              │
│  └──────┘ ┌──────┐              │
│  ┌──────┐ │      │              │
│  │ img  │ │ img  │              │
│  │      │ │      │              │
│  └──────┘ └──────┘              │
│                                  │
├──────────────────────────────────┤
│  [Home]  [Explore]  [+]  [Profile]│ ← bottom nav
└──────────────────────────────────┘
```

### 8.2 Explore

```
┌──────────────────────────────────┐
│  🔍 Search places, tags, creators│  ← search bar
├──────────────────────────────────┤
│  [Bounties] [Content] [Creators] │  ← tab pills
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │        MAP VIEW            │  │  ← half-screen map
│  │     📍    📍     📍       │  │     bounty pins
│  │          📍          📍   │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  NEARBY                          │  ← bottom sheet / scrollable list
│                                  │
│  ┌────────────────────────────┐  │
│  │ [img] │ River Photography  │  │
│  │       │ 📍 2.3 km away    │  │
│  │       │ ◎ 0.3 · 2d left   │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ [img] │ Temple at Dawn     │  │
│  │       │ 📍 5.1 km away    │  │
│  │       │ ◎ 0.5 · 4d left   │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### 8.3 Camera / Create (+)

```
Tapping (+) opens action sheet:

┌──────────────────────────────────┐
│                                  │
│  What do you want to do?         │
│                                  │
│  ┌────────────────────────────┐  │
│  │  📷  Fulfill a Bounty      │  │  → select bounty → camera
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  🖼️  Post to Marketplace   │  │  → camera → set prices
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  📋  Create a Bounty       │  │  → bounty creation form
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘

Camera Screen:
┌──────────────────────────────────┐
│  ✕                    GPS ✓ Live │
│                                  │
│                                  │
│         [Camera Preview]         │
│                                  │
│                                  │
│                                  │
│   📍 Bandung, West Java          │
│   -6.914, 107.609                │
│                                  │
│          [ ◉ Capture ]           │
│                                  │
└──────────────────────────────────┘

Post-Capture Screen:
┌──────────────────────────────────┐
│  ← Back              Post →      │
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │     [Captured Photo]       │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  Title                           │
│  ┌────────────────────────────┐  │
│  │ Sunset at Citarum River    │  │
│  └────────────────────────────┘  │
│                                  │
│  Description                     │
│  ┌────────────────────────────┐  │
│  │ Golden hour capture...     │  │
│  └────────────────────────────┘  │
│                                  │
│  Tags                            │
│  [nature] [river] [sunset] [+]   │
│                                  │
│  License Pricing                 │
│  ┌────────────────────────────┐  │
│  │ Personal     ◎ 0.05 SOL   │  │
│  │ Commercial   ◎ 0.5  SOL   │  │
│  │ Exclusive    ◎ 2.0  SOL   │  │
│  └────────────────────────────┘  │
│                                  │
│  📍 Bandung · Mar 6, 2026        │
│                                  │
│  [ Mint & Post ]                 │  ← primary CTA
└──────────────────────────────────┘
```

### 8.4 Content Detail

```
┌──────────────────────────────────┐
│  ←                      ♡   ⋮   │
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │                            │  │
│  │     [Full Photo]           │  │  ← large, takes ~40% screen
│  │                            │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  Sunset at Citarum River         │  ← heading 2
│                                  │
│  ┌──────────────────────────┐    │
│  │ [avatar] @andi            │   │  ← creator row
│  │ 24 photos · 4.2 SOL earned│   │
│  │                  [Follow] │   │
│  └──────────────────────────┘    │
│                                  │
│  📍 Bandung, West Java           │  ← location with mini map
│  ┌────────────────────────────┐  │
│  │    [Mini Map]              │  │
│  └────────────────────────────┘  │
│                                  │
│  [nature] [river] [sunset]       │  ← tags
│                                  │
│  Licenses                        │
│  ┌────────────────────────────┐  │
│  │ Personal Use    ◎ 0.05    │  │
│  │ For personal, non-commercial│ │
│  │              [Acquire →]   │  │
│  ├────────────────────────────┤  │
│  │ Commercial Use  ◎ 0.50    │  │
│  │ For business & commercial  │  │
│  │              [Acquire →]   │  │
│  ├────────────────────────────┤  │
│  │ Exclusive       ◎ 2.00    │  │
│  │ Full rights transfer       │  │
│  │              [Acquire →]   │  │
│  └────────────────────────────┘  │
│                                  │
│  12 licenses sold                │
│  NFT: DKx4...f9Qp [↗]           │  ← link to explorer
│                                  │
└──────────────────────────────────┘
```

### 8.5 Bounty Detail

```
┌──────────────────────────────────┐
│  ←  Bounty Detail                │
│                                  │
│  ┌────────────────────────────┐  │
│  │ [Reference image if any]   │  │
│  └────────────────────────────┘  │
│                                  │
│  River Photography at Citarum    │  ← title
│                                  │
│  ┌────────────────────────────┐  │
│  │ ◎ 0.5 SOL    │ 3/5 slots  │  │  ← reward + status
│  │ reward        │ remaining  │  │
│  └────────────────────────────┘  │
│                                  │
│  Posted by                       │
│  [avatar] @requester · 2d ago    │
│                                  │
│  Description                     │
│  Looking for golden hour photos  │
│  of Citarum River, minimum...    │
│                                  │
│  📍 Location                     │
│  ┌────────────────────────────┐  │
│  │    [Map with radius circle]│  │
│  └────────────────────────────┘  │
│  Bandung · 5km radius            │
│                                  │
│  ⏰ Deadline: Mar 8, 2026        │
│  📷 Type: Photo                  │
│  [nature] [river]                │
│                                  │
│  Submissions (2/5)               │
│  ┌──────┐ ┌──────┐              │
│  │[img] │ │[img] │              │  ← thumbnail grid
│  │@user1│ │@user2│              │
│  └──────┘ └──────┘              │
│                                  │
│  [ 📷 Fulfill This Bounty ]     │  ← primary CTA
│                                  │
└──────────────────────────────────┘
```

### 8.6 Profile

```
┌──────────────────────────────────┐
│  ⚙️                              │
│                                  │
│         [Large Avatar]           │
│          @seekerlens              │
│                                  │
│  ┌──────────────────────────┐    │
│  │ Your balance    ◎ 12.5   │    │  ← like SBANK's balance card
│  │                   SOL    │    │
│  │                     [↗]  │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌────────┐┌────────┐┌────────┐  │
│  │  34    ││  15    ││  8     │  │  ← stat cards
│  │ Photos ││Bounties││Licenses│  │
│  └────────┘└────────┘└────────┘  │
│                                  │
│  [My Gallery] [My Bounties]      │  ← tab selector
│  [Licenses]                      │
│                                  │
│  ┌──────┐ ┌──────┐              │  ← masonry grid
│  │      │ │      │              │
│  │ img  │ │ img  │              │
│  │      │ │      │              │
│  │◎ 0.8 │ └──────┘              │
│  │12 lic│ ┌──────┐              │
│  └──────┘ │ img  │              │
│  ┌──────┐ │      │              │
│  │ img  │ └──────┘              │
│  └──────┘                        │
│                                  │
├──────────────────────────────────┤
│  [Home] [Explore] [+] [Profile]  │
└──────────────────────────────────┘
```

### 8.7 Settings

```
┌──────────────────────────────────┐
│  ← Settings                      │
│                                  │
│  Network                         │
│  ┌────────────────────────────┐  │
│  │ Solana Network             │  │
│  │ [Devnet ○]  [Mainnet ●]   │  │  ← toggle
│  └────────────────────────────┘  │
│                                  │
│  Account                         │
│  ┌────────────────────────────┐  │
│  │ Edit Profile            →  │  │
│  │ Connected Wallet        →  │  │
│  │ Notification Settings   →  │  │
│  └────────────────────────────┘  │
│                                  │
│  About                           │
│  ┌────────────────────────────┐  │
│  │ About SeekerLens        →  │  │
│  │ Terms of Service        →  │  │
│  │ Privacy Policy          →  │  │
│  └────────────────────────────┘  │
│                                  │
│  [ Disconnect Wallet ]           │  ← destructive style
│                                  │
└──────────────────────────────────┘
```

---

## 9. Technical Architecture

### 9.1 System Overview

```
┌──────────────────────┐      ┌──────────────────────┐
│   React Native App   │      │    Solana Network     │
│   (Expo + Custom     │─────▶│                      │
│    Dev Build)        │      │  - Compressed NFTs   │
│                      │      │    (Metaplex          │
│  - expo-camera       │      │     Bubblegum)       │
│  - expo-location     │      │  - SOL transfers     │
│  - MWA SDK           │      │  - License records   │
│  - React Navigation  │      │  - Escrow (future)   │
│                      │      │                      │
└──────────┬───────────┘      └──────────────────────┘
           │
           ▼
┌──────────────────────┐      ┌──────────────────────┐
│      Supabase        │      │   Arweave / IPFS     │
│                      │      │                      │
│  - bounties table    │      │  - Photo/video files │
│  - content table     │      │  - NFT metadata JSON │
│  - licenses table    │      │                      │
│  - users table       │      │                      │
│  - Storage (thumbs)  │      │                      │
│  - Realtime subs     │      │                      │
│  - Edge Functions    │      │                      │
└──────────────────────┘      └──────────────────────┘
```

### 9.2 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React Native + Expo | Official Solana Mobile recommendation |
| Build | Custom Expo Dev Build | Required for MWA native modules |
| Navigation | React Navigation (Bottom Tabs + Stack) | Industry standard for RN |
| Wallet | @wallet-ui/react-native-web3js | Official MWA React Native SDK |
| Solana | @solana/web3.js | Core Solana interactions |
| NFT | @metaplex-foundation/mpl-bubblegum | Compressed NFTs (cheap minting) |
| Crypto Polyfill | react-native-quick-crypto | Required for web3.js in RN |
| Camera | expo-camera | Photo/video capture |
| Location | expo-location | GPS coordinates |
| Maps | react-native-maps | Map view for bounties |
| Storage (files) | Arweave via Irys SDK | Permanent decentralized storage |
| Backend | Supabase | Auth, DB, storage, realtime, edge functions |
| Styling | StyleSheet + custom design tokens | Native performance, no CSS-in-JS overhead |
| Icons | lucide-react-native | Clean, consistent icon set |
| State | Zustand | Lightweight state management |
| Fonts | expo-font (Inter) | Design system typography |

### 9.3 Data Model

#### Supabase Tables

```sql
-- Users (extends wallet identity)
users (
  id uuid PRIMARY KEY,
  wallet_address text UNIQUE NOT NULL,
  username text UNIQUE,
  avatar_url text,
  bio text,
  created_at timestamptz
)

-- Bounties
bounties (
  id uuid PRIMARY KEY,
  creator_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  media_type text CHECK (media_type IN ('photo', 'video', 'both')),
  location_lat double precision,
  location_lng double precision,
  location_radius_km double precision,
  location_name text,
  reward_sol double precision NOT NULL,
  max_submissions int DEFAULT 5,
  deadline timestamptz NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'fulfilled', 'expired', 'cancelled')),
  escrow_tx text,
  tags text[],
  created_at timestamptz DEFAULT now()
)

-- Content (photos/videos — both bounty submissions and marketplace posts)
content (
  id uuid PRIMARY KEY,
  creator_id uuid REFERENCES users(id),
  bounty_id uuid REFERENCES bounties(id),  -- null if marketplace post
  title text NOT NULL,
  description text,
  media_url text NOT NULL,           -- arweave/ipfs URL
  thumbnail_url text,                -- supabase storage
  media_type text CHECK (media_type IN ('photo', 'video')),
  location_lat double precision,
  location_lng double precision,
  location_name text,
  nft_mint_address text,
  license_price_personal double precision,
  license_price_commercial double precision,
  license_price_exclusive double precision,
  is_exclusive_sold boolean DEFAULT false,
  source text CHECK (source IN ('bounty', 'marketplace')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'listed')),
  tags text[],
  likes_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
)

-- Licenses
licenses (
  id uuid PRIMARY KEY,
  content_id uuid REFERENCES content(id),
  buyer_id uuid REFERENCES users(id),
  license_type text CHECK (license_type IN ('personal', 'commercial', 'exclusive')),
  price_sol double precision NOT NULL,
  tx_signature text NOT NULL,
  purchased_at timestamptz DEFAULT now()
)
```

### 9.4 On-Chain Data

**What lives on Solana:**
- Compressed NFTs (content ownership proof) via Metaplex Bubblegum
- SOL transfers (bounty payments, license purchases)
- NFT metadata (title, creator, location, timestamp, license info)

**What lives off-chain (Supabase):**
- Bounty listings and management
- Content discovery and search
- User profiles
- License tracking (mirrored from on-chain tx)
- Thumbnails and previews

### 9.5 Network Configuration

```typescript
const NETWORKS = {
  devnet: {
    rpcUrl: 'https://api.devnet.solana.com',
    label: 'Devnet',
  },
  mainnet: {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    label: 'Mainnet',
  },
};
```

User can toggle in Settings. Default to devnet for development.

---

## 10. NFT & Licensing Model

### 10.1 NFT Structure (Compressed NFT)

```json
{
  "name": "SeekerLens: Sunset at Citarum River",
  "symbol": "SLENS",
  "description": "Captured via SeekerLens at Bandung, West Java",
  "image": "https://arweave.net/xxx",
  "attributes": [
    { "trait_type": "Creator", "value": "wallet_address" },
    { "trait_type": "Latitude", "value": "-6.914" },
    { "trait_type": "Longitude", "value": "107.609" },
    { "trait_type": "Location", "value": "Bandung, West Java" },
    { "trait_type": "Captured At", "value": "2026-03-06T17:30:00Z" },
    { "trait_type": "Media Type", "value": "photo" },
    { "trait_type": "Source", "value": "marketplace" },
    { "trait_type": "App", "value": "SeekerLens" }
  ],
  "properties": {
    "category": "image",
    "files": [{ "uri": "https://arweave.net/xxx", "type": "image/jpeg" }]
  }
}
```

### 10.2 License Types

| Type | Rights | Transferable | Multi-sell |
|------|--------|-------------|------------|
| Personal | View, personal use, no commercial | No | Yes (unlimited buyers) |
| Commercial | Business use, marketing, publications | No | Yes (unlimited buyers) |
| Exclusive | Full rights, commercial, resale | Yes | No (one buyer, then locked) |

### 10.3 Payment Flow

**Bounty Payment:**
1. Creator deposits SOL when creating bounty (held in creator's wallet, tracked off-chain)
2. Photographer submits content
3. Creator approves → sends SOL directly to photographer
4. MVP: direct wallet-to-wallet transfer signed by creator
5. Future: on-chain escrow program

**License Payment:**
1. Buyer selects license type on content detail
2. Signs SOL transfer to content creator via MWA
3. Transaction recorded on-chain
4. License record created in Supabase (linked to tx signature)

---

## 11. Project Structure

```
SeekerApp/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── index.tsx             # Home / Beranda
│   │   ├── explore.tsx           # Explore / Map
│   │   ├── create.tsx            # Camera / Create hub
│   │   └── profile.tsx           # Profile
│   ├── bounty/
│   │   ├── [id].tsx              # Bounty detail
│   │   └── create.tsx            # Create bounty form
│   ├── content/
│   │   ├── [id].tsx              # Content detail
│   │   └── post.tsx              # Post to marketplace (after capture)
│   ├── camera.tsx                # Camera screen
│   ├── settings.tsx              # Settings
│   ├── _layout.tsx               # Root layout
│   └── onboarding.tsx            # First-time wallet connect
│
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Tag.tsx
│   │   ├── Avatar.tsx
│   │   ├── SolAmount.tsx
│   │   ├── Input.tsx
│   │   └── Skeleton.tsx
│   ├── home/
│   │   ├── FeaturedCard.tsx
│   │   ├── BountyCardSmall.tsx
│   │   ├── CompletedBountyItem.tsx
│   │   └── ContentGrid.tsx
│   ├── bounty/
│   │   ├── BountyCard.tsx
│   │   ├── BountyForm.tsx
│   │   └── SubmissionThumbnail.tsx
│   ├── content/
│   │   ├── ContentCard.tsx
│   │   ├── LicenseOptions.tsx
│   │   └── MasonryGrid.tsx
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── StatsRow.tsx
│   │   └── GalleryGrid.tsx
│   └── common/
│       ├── WalletButton.tsx
│       ├── NetworkBadge.tsx
│       └── LocationBadge.tsx
│
├── hooks/
│   ├── useWallet.ts              # MWA wallet connection
│   ├── useSolanaConnection.ts    # RPC connection with network toggle
│   ├── useBounties.ts            # Bounty CRUD operations
│   ├── useContent.ts             # Content CRUD operations
│   ├── useLicenses.ts            # License purchase operations
│   ├── useLocation.ts            # GPS wrapper
│   ├── useCamera.ts              # Camera wrapper
│   └── useNFT.ts                 # NFT minting logic
│
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── solana.ts                 # Solana connection + helpers
│   ├── nft.ts                    # Metaplex minting functions
│   ├── storage.ts                # Arweave/IPFS upload
│   ├── constants.ts              # Colors, spacing, networks
│   └── types.ts                  # TypeScript types
│
├── store/
│   └── useAppStore.ts            # Zustand global state
│
├── assets/
│   ├── fonts/
│   │   └── Inter/
│   └── images/
│       └── solana-logo.png
│
├── polyfill.js                   # Crypto polyfill (MUST load first)
├── index.js                      # Entry point (loads polyfill)
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── docs/
    └── PRD.md
```

---

## 12. MVP Scope & Milestones

### Day 1 — Foundation
- [ ] Project scaffold (npm create solana-dapp)
- [ ] Design system: colors, typography, spacing constants
- [ ] UI primitives: Button, Card, Tag, Avatar, SolAmount, Input
- [ ] Bottom tab navigation (Home, Explore, Create, Profile)
- [ ] Wallet connection via MWA
- [ ] Supabase setup (tables, client)
- [ ] Home screen layout (static data first)
- [ ] Network toggle (devnet/mainnet)

### Day 2 — Core Features
- [ ] Create Bounty flow (form + Supabase insert + SOL tracking)
- [ ] Browse bounties (list view from Supabase)
- [ ] Camera capture with GPS tagging
- [ ] Post to marketplace flow (capture → form → save)
- [ ] Content detail screen with license options
- [ ] NFT minting (compressed NFT)
- [ ] Image upload to Arweave/IPFS
- [ ] License purchase (SOL transfer)

### Day 3 — Polish & Ship
- [ ] Profile screen (gallery, stats, bounties)
- [ ] Bounty detail + submissions view
- [ ] Approve/reject submissions
- [ ] Map view on Explore (if time permits)
- [ ] Loading states (skeleton shimmer)
- [ ] Error handling
- [ ] End-to-end testing on emulator
- [ ] Build APK
- [ ] Record demo video
- [ ] Create pitch deck
- [ ] Submit

---

## 13. Success Metrics (Post-Launch)

- Number of bounties created
- Number of content pieces minted
- Number of licenses purchased
- Total SOL transacted
- Daily active users
- Bounty completion rate
- Average time to fulfill bounty

---

## 14. Future Roadmap (Post-Hackathon)

- On-chain escrow smart contract (Anchor)
- Video support with streaming playback
- GPS radius verification (proof of location)
- Creator reputation system
- Social features (follow, like, comments)
- SKR token integration
- Push notifications
- AI-powered content tagging
- Bulk license purchasing
- Creator analytics dashboard
- iOS support (post dApp Store launch)

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Compressed NFT minting complexity | High | Use Metaplex SDK examples, fallback to regular NFTs |
| Arweave upload failures | Medium | Fallback to IPFS/Pinata, or Supabase Storage for MVP |
| MWA wallet compatibility | High | Test with mock wallet + Solflare early |
| Expo custom build issues | Medium | Follow official Solana Mobile template exactly |
| Time constraint (3 days) | High | Strict P0 scope, cut P1/P2 ruthlessly |
| Solo developer | Medium | Leverage agent team for parallel work |

---

*Document Version: 1.0*
*Last Updated: March 6, 2026*
*Author: SeekerLens Team*
