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