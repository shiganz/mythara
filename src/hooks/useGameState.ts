import { useState, useEffect, useCallback } from "react";
import { UserStats, Reward, Rarity, BoxType, InventoryItem } from "../types";
import { INITIAL_STATS, DROP_RATES, COIN_REWARDS, COSMETIC_REWARDS, STREAK_MILESTONES } from "../constants";

const STORAGE_KEY = "mythara_game_state";

export function useGameState() {
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load game state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats, isLoaded]);

  const addReward = useCallback((reward: Reward) => {
    setStats((prev) => {
      const inventory: InventoryItem[] = [...prev.inventory, { ...reward, acquiredAt: Date.now() }];
      const newStats = { ...prev, inventory };
      if (reward.type === "coins") {
        newStats.coins += reward.value || 0;
      }
      if (reward.type === "xp") {
        newStats.xp += reward.value || 0;
      }
      return newStats;
    });
  }, []);

  const getBoxTypeForStreak = useCallback((streak: number): BoxType => {
    const milestones = Object.keys(STREAK_MILESTONES)
      .map(Number)
      .sort((a, b) => b - a);
    const milestone = milestones.find((m) => streak >= m) || 1;
    return STREAK_MILESTONES[milestone];
  }, []);

  const getRandomReward = useCallback((boxType: BoxType): Reward => {
    const rates = DROP_RATES[boxType];
    const rand = Math.random();
    let cumulative = 0;
    let rarity: Rarity = "common";

    for (const [r, rate] of Object.entries(rates)) {
      cumulative += rate;
      if (rand <= cumulative) {
        rarity = r as Rarity;
        break;
      }
    }

    // Filter rewards by rarity
    const possibleCoins = COIN_REWARDS.filter((r) => r.rarity === rarity);
    const possibleCosmetics = COSMETIC_REWARDS.filter((r) => r.rarity === rarity);
    const allPossible = [...possibleCoins, ...possibleCosmetics];

    if (allPossible.length === 0) return COIN_REWARDS[0]; // Fallback

    return allPossible[Math.floor(Math.random() * allPossible.length)];
  }, []);

  const claimDaily = useCallback(() => {
    const now = new Date();
    const lastClaim = stats.lastClaimDate ? new Date(stats.lastClaimDate) : null;

    if (lastClaim) {
      const diffMs = now.getTime() - lastClaim.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);

      if (diffHrs < 24) {
        return null; // Already claimed
      }

      // Check if streak is broken (e.g., > 48 hours)
      if (diffHrs > 48) {
        setStats((prev) => ({ ...prev, streak: 1 }));
      } else {
        setStats((prev) => ({ ...prev, streak: prev.streak + 1 }));
      }
    } else {
      setStats((prev) => ({ ...prev, streak: 1 }));
    }

    const boxType = getBoxTypeForStreak(stats.streak + 1);
    const reward = getRandomReward(boxType);
    
    setStats((prev) => ({
      ...prev,
      lastClaimDate: now.toISOString(),
    }));

    addReward(reward);
    return reward;
  }, [stats.lastClaimDate, stats.streak, getBoxTypeForStreak, getRandomReward, addReward]);

  return {
    ...stats,
    isLoaded,
    claimDaily,
    setStats,
    addReward,
    getBoxTypeForStreak,
  };
}
