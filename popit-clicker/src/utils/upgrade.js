import { COST_MULTIPLIER } from "../data/upgrades";


export const TIER_SIZE = 50;
export const TIER_MULTIPLIER = 2;
/** How many tier bonuses are active at this level. 0 for lv 0-49, 1 for 50-99... */
export function tierOf(level) {
    return Math.floor(level / TIER_SIZE);
}

/** Production multiplier from all active tier bonuses. */
export function tierMultiplier(level) {
    return Math.pow(TIER_MULTIPLIER, tierOf(level));
}

/** Effective per-level production after tier bonuses. */
export function effectiveValue(upgrade, level) {
    return upgrade.value * tierMultiplier(level);
}

/** How many levels until the next tier kicks in. */
export function levelsToNextTier(level) {
    return TIER_SIZE - (level % TIER_SIZE);
}

/**
 * Total cost to buy `count` levels starting from `currentLevel`.
 */
export function bulkCost(upgrade, currentLevel, count) {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.ceil(upgrade.baseCost * Math.pow(COST_MULTIPLIER, currentLevel + i));
    }
    return total;
}

/**
 * Maximum number of levels affordable with `coins` starting from `currentLevel`.
 */
export function maxAffordable(upgrade, currentLevel, coins) {
    let total = 0;
    let count = 0;
    while (true) {
        const next = Math.ceil(upgrade.baseCost * Math.pow(COST_MULTIPLIER, currentLevel + count));
        if (total + next > coins) break;
        total += next;
        count += 1;
        if (count > 10000) break;  // safety cap
    }
    return { count, cost: total };
}