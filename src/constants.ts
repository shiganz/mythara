import { Reward, DropConfig, BoxType } from "./types";

export const COIN_REWARDS = [
  { id: "coins_10", name: "10 Coins", type: "coins", rarity: "common", value: 10 },
  { id: "coins_50", name: "50 Coins", type: "coins", rarity: "uncommon", value: 50 },
  { id: "coins_200", name: "200 Coins", type: "coins", rarity: "rare", value: 200 },
  { id: "coins_1000", name: "1000 Coins", type: "coins", rarity: "epic", value: 1000 },
] as const;

export const COSMETIC_REWARDS: Reward[] = [
  { id: "skin_neon", name: "Neon Cyber Skin", type: "skin", rarity: "rare", image: "/image.png", description: "A glowing neon skin for your profile." },
  { id: "avatar_bot", name: "Cyber Bot", type: "avatar", rarity: "uncommon", image: "/image.png", description: "Meet your cyber assistant." },
  { id: "badge_og", name: "OG Player Badge", type: "badge", rarity: "epic", image: "/image.png", description: "A badge for early supporters." },
  { id: "nft_dragon", name: "Legendary Dragon", type: "nft", rarity: "legendary", image: "/image.png", description: "A rare on-chain collectible on Base." },
];

export const DROP_RATES: Record<BoxType, Record<string, number>> = {
  basic: {
    common: 0.6,
    uncommon: 0.25,
    rare: 0.1,
    epic: 0.04,
    legendary: 0.01,
  },
  silver: {
    common: 0.4,
    uncommon: 0.3,
    rare: 0.2,
    epic: 0.08,
    legendary: 0.02,
  },
  gold: {
    common: 0.2,
    uncommon: 0.35,
    rare: 0.25,
    epic: 0.15,
    legendary: 0.05,
  },
  epic: {
    common: 0.1,
    uncommon: 0.2,
    rare: 0.3,
    epic: 0.3,
    legendary: 0.1,
  },
  legendary: {
    common: 0.0,
    uncommon: 0.1,
    rare: 0.2,
    epic: 0.4,
    legendary: 0.3,
  },
};

export const STREAK_MILESTONES: Record<number, BoxType> = {
  1: "basic",
  3: "silver",
  7: "gold",
  14: "epic",
  30: "legendary",
};

export const INITIAL_STATS = {
  coins: 100,
  xp: 0,
  streak: 0,
  lastClaimDate: null,
  inventory: [],
};
