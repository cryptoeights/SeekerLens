// Centralized mock data for SeekerLens demo
// Used across home, explore, and detail screens

import type { CategoryTagName } from './constants';

export interface MockContent {
  readonly id: string;
  readonly title: string;
  readonly imageUri: string;
  readonly solPrice: number;
  readonly creator: {
    readonly username: string;
    readonly avatarUri: string;
    readonly photoCount: number;
    readonly totalEarned: number;
  };
  readonly location: {
    readonly name: string;
    readonly latitude: number;
    readonly longitude: number;
  };
  readonly tags: readonly CategoryTagName[];
  readonly licensePricePersonal: number;
  readonly licensePriceCommercial: number;
  readonly licensePriceExclusive: number;
  readonly licensesSold: number;
  readonly nftAddress: string;
}

export const MOCK_CONTENTS: readonly MockContent[] = [
  {
    id: 'featured-1',
    title: 'Sunrise at Bromo',
    imageUri: 'https://picsum.photos/seed/bromo/800/400',
    solPrice: 2.5,
    creator: { username: 'andi', avatarUri: 'https://picsum.photos/seed/andi/128/128', photoCount: 48, totalEarned: 12.5 },
    location: { name: 'Mt. Bromo, East Java', latitude: -7.9425, longitude: 112.953 },
    tags: ['nature', 'travel'],
    licensePricePersonal: 0.1,
    licensePriceCommercial: 1.0,
    licensePriceExclusive: 2.5,
    licensesSold: 12,
    nftAddress: 'BRm4...x8Qp',
  },
  {
    id: 't1',
    title: 'Nusa Penida Cliffs',
    imageUri: 'https://picsum.photos/seed/nusapenida/400/480',
    solPrice: 0.5,
    creator: { username: 'maya_lens', avatarUri: 'https://picsum.photos/seed/maya/128/128', photoCount: 36, totalEarned: 8.2 },
    location: { name: 'Nusa Penida, Bali', latitude: -8.7275, longitude: 115.5444 },
    tags: ['nature', 'travel'],
    licensePricePersonal: 0.05,
    licensePriceCommercial: 0.25,
    licensePriceExclusive: 0.5,
    licensesSold: 8,
    nftAddress: 'NsP1...k3Rp',
  },
  {
    id: 't2',
    title: 'Kawah Ijen Blue Fire',
    imageUri: 'https://picsum.photos/seed/kawahijen/400/520',
    solPrice: 1.2,
    creator: { username: 'rizki_art', avatarUri: 'https://picsum.photos/seed/rizki/128/128', photoCount: 72, totalEarned: 21.0 },
    location: { name: 'Kawah Ijen, East Java', latitude: -8.058, longitude: 114.242 },
    tags: ['nature'],
    licensePricePersonal: 0.08,
    licensePriceCommercial: 0.6,
    licensePriceExclusive: 1.2,
    licensesSold: 15,
    nftAddress: 'KwI2...j7Tp',
  },
  {
    id: 't3',
    title: 'Labuan Bajo Sunset',
    imageUri: 'https://picsum.photos/seed/labuan-bajo/400/460',
    solPrice: 0.8,
    creator: { username: 'dewi_captures', avatarUri: 'https://picsum.photos/seed/dewi/128/128', photoCount: 24, totalEarned: 5.3 },
    location: { name: 'Labuan Bajo, NTT', latitude: -8.4967, longitude: 119.8892 },
    tags: ['nature', 'travel'],
    licensePricePersonal: 0.05,
    licensePriceCommercial: 0.4,
    licensePriceExclusive: 0.8,
    licensesSold: 6,
    nftAddress: 'LbB3...m2Sp',
  },
  {
    id: 't4',
    title: 'Toraja Funeral Ceremony',
    imageUri: 'https://picsum.photos/seed/toraja/400/500',
    solPrice: 2.0,
    creator: { username: 'budi_visual', avatarUri: 'https://picsum.photos/seed/budi/128/128', photoCount: 55, totalEarned: 15.8 },
    location: { name: 'Tana Toraja, Sulawesi', latitude: -3.0713, longitude: 119.8247 },
    tags: ['travel', 'portrait'],
    licensePricePersonal: 0.1,
    licensePriceCommercial: 1.0,
    licensePriceExclusive: 2.0,
    licensesSold: 3,
    nftAddress: 'Trj4...n9Wp',
  },
  // Explore tab content
  {
    id: 'ec1',
    title: 'Monas at Dusk',
    imageUri: 'https://picsum.photos/seed/monas/400/480',
    solPrice: 0.3,
    creator: { username: 'andi', avatarUri: 'https://picsum.photos/seed/andi/128/128', photoCount: 48, totalEarned: 12.5 },
    location: { name: 'Jakarta, DKI Jakarta', latitude: -6.1754, longitude: 106.8272 },
    tags: ['urban', 'architecture'],
    licensePricePersonal: 0.03,
    licensePriceCommercial: 0.15,
    licensePriceExclusive: 0.3,
    licensesSold: 20,
    nftAddress: 'Mns1...p4Qr',
  },
  {
    id: 'ec2',
    title: 'Kota Tua Heritage',
    imageUri: 'https://picsum.photos/seed/kota-tua/400/520',
    solPrice: 0.6,
    creator: { username: 'maya_lens', avatarUri: 'https://picsum.photos/seed/maya/128/128', photoCount: 36, totalEarned: 8.2 },
    location: { name: 'Kota Tua, Jakarta', latitude: -6.1352, longitude: 106.8133 },
    tags: ['urban', 'architecture'],
    licensePricePersonal: 0.05,
    licensePriceCommercial: 0.3,
    licensePriceExclusive: 0.6,
    licensesSold: 9,
    nftAddress: 'KtT2...q5Rs',
  },
  {
    id: 'ec3',
    title: 'Malioboro Street Life',
    imageUri: 'https://picsum.photos/seed/malioboro/400/460',
    solPrice: 1.0,
    creator: { username: 'rizki_art', avatarUri: 'https://picsum.photos/seed/rizki/128/128', photoCount: 72, totalEarned: 21.0 },
    location: { name: 'Yogyakarta', latitude: -7.7928, longitude: 110.3608 },
    tags: ['urban', 'travel'],
    licensePricePersonal: 0.08,
    licensePriceCommercial: 0.5,
    licensePriceExclusive: 1.0,
    licensesSold: 11,
    nftAddress: 'Mlb3...r6St',
  },
  {
    id: 'ec4',
    title: 'Dieng Plateau Mist',
    imageUri: 'https://picsum.photos/seed/dieng/400/500',
    solPrice: 0.4,
    creator: { username: 'dewi_captures', avatarUri: 'https://picsum.photos/seed/dewi/128/128', photoCount: 24, totalEarned: 5.3 },
    location: { name: 'Dieng, Central Java', latitude: -7.2117, longitude: 109.9147 },
    tags: ['nature'],
    licensePricePersonal: 0.03,
    licensePriceCommercial: 0.2,
    licensePriceExclusive: 0.4,
    licensesSold: 4,
    nftAddress: 'Dng4...s7Tu',
  },
  {
    id: 'ec5',
    title: 'Taman Sari Water Castle',
    imageUri: 'https://picsum.photos/seed/taman-sari/400/440',
    solPrice: 0.8,
    creator: { username: 'budi_visual', avatarUri: 'https://picsum.photos/seed/budi/128/128', photoCount: 55, totalEarned: 15.8 },
    location: { name: 'Yogyakarta', latitude: -7.81, longitude: 110.359 },
    tags: ['architecture', 'travel'],
    licensePricePersonal: 0.05,
    licensePriceCommercial: 0.4,
    licensePriceExclusive: 0.8,
    licensesSold: 7,
    nftAddress: 'TmS5...t8Uv',
  },
  {
    id: 'ec6',
    title: 'Lawang Sewu Corridors',
    imageUri: 'https://picsum.photos/seed/lawang-sewu/400/510',
    solPrice: 1.5,
    creator: { username: 'andi', avatarUri: 'https://picsum.photos/seed/andi/128/128', photoCount: 48, totalEarned: 12.5 },
    location: { name: 'Semarang, Central Java', latitude: -6.9839, longitude: 110.4103 },
    tags: ['architecture', 'urban'],
    licensePricePersonal: 0.1,
    licensePriceCommercial: 0.75,
    licensePriceExclusive: 1.5,
    licensesSold: 5,
    nftAddress: 'LwS6...u9Vw',
  },
] as const;

export function getMockContentById(id: string): MockContent | undefined {
  return MOCK_CONTENTS.find((c) => c.id === id);
}
