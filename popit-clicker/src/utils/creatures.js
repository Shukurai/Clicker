import { UPGRADES } from "../data/upgrades";

const MAX_PER_UPGRADE = 12; 

/**
 * Returns the number of creatures to show for a given upgrade level.
 * Uses sqrt scaling so high levels don't flood the screen.
 */
export function creatureCountFor(level) {
    if (level <= 0) return 0;
    if (level <= 5) return level;                   
    return Math.min(MAX_PER_UPGRADE, 5 + Math.floor(Math.sqrt(level - 5) * 2));
}

/**
 * Returns flat list of creature emojis for all auto-upgrades, given levels.
 * @param {Object} levels - map of upgradeId → level
 * @returns {Array<{id: string, emoji: string}>}
 */
export function getCreatures(levels) {
    const result = [];
    for (const u of UPGRADES) {
        if (u.type !== "auto" || !u.creature) continue;
        const count = creatureCountFor(levels[u.id] ?? 0);
        for (let i = 0; i < count; i++) {
            result.push({ id: `${u.id}-${i}`, emoji: u.creature });
        }
    }
    return result;
}