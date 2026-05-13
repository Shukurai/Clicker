/**
 * Format large numbers with K/M/B/T suffixes.
 * @example fmt(1500) → "1.5K"
 */

export function fmt(n) {
    if (n < 1000) return Math.floor(n).toString();
    if (n < 1e6) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    if (n < 1e9) return (n / 1e6).toFixed(2) + "M";
    if (n < 1e12) return (n / 1e9).toFixed(2) + "B";
    return (n / 1e12).toFixed(2) + "T";
}

/**
 * Calculate the cost of the next level of an upgrade.
 * Cost grows exponentially: baseCost × multiplier^level.
 */
export function costOf(upgrade, level, multiplier) {
    return Math.ceil(upgrade.baseCost * Math.pow(multiplier, level));
}