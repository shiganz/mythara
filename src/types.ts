export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface Reward {
  id: string;
  name: string;
  type: "coins" | "xp" | "skin" | "avatar" | "badge" | "nft";
  rarity: Rarity;
  value?: number; // For coins or XP
  image?: string;
  description?: string;
}

export interface InventoryItem extends Reward {
  acquiredAt: number;
}

export interface UserStats {
  coins: number;
  xp: number;
  streak: number;
  lastClaimDate: string | null; // ISO string
  inventory: InventoryItem[];
  equippedAvatar?: string;
  equippedSkin?: string;
}

export interface GameState extends UserStats {
  setStats: (stats: Partial<UserStats>) => void;
  claimDaily: () => Reward | null;
  addReward: (reward: Reward) => void;
}

export type BoxType = "basic" | "silver" | "gold" | "epic" | "legendary";

export interface DropConfig {
  boxType: BoxType;
  rates: Record<Rarity, number>; // Probability (0-1)
}
