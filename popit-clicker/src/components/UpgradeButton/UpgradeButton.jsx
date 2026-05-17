import { fmt, costOf } from "../../utils/format";
import { COST_MULTIPLIER } from "../../data/upgrades";
import { Tooltip } from "../Tooltip/Tooltip";
import { bulkCost, maxAffordable } from "../../utils/upgrade";
import {
    tierOf,
    tierMultiplier,
    levelsToNextTier,
    TIER_MULTIPLIER,
    effectiveValue,
} from "../../utils/upgrade";

import "./UpgradeButton.css";

export function UpgradeButton({ upgrade, level, coins, onBuy, features = {}, buyMode = "1" }) {
        const cost = costOf(upgrade, level, COST_MULTIPLIER);

    const tier = tierOf(level);
    const mult = tierMultiplier(level);
    const toNext = levelsToNextTier(level);
    const nextMult = mult * TIER_MULTIPLIER;

    const perLevelRaw = effectiveValue(upgrade, level);
    const isClickType = upgrade.type === "click";
    const multiplier = (isClickType && features.doubleClick) || (!isClickType && features.doubleAuto) ? 2 : 1;
    const perLevel = perLevelRaw * multiplier;
    const unit = isClickType ? "per click" : "/ sec";
    const effectDesc = `+${fmt(perLevel)} ${unit}`;

    const tooltipContent = (
        <div>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>{upgrade.name}</div>
            <div style={{ opacity: 0.85, marginBottom: 6 }}>
                Each level: {effectDesc}
            </div>
            {tier > 0 && (
                <div style={{ color: "#9ec5ff" }}>
                    Tier bonus: ×{mult}
                </div>
            )}
            <div style={{ color: "#9ec5ff", marginTop: 2 }}>
                ×{nextMult} bonus at level {(tier + 1) * 50}
            </div>
        </div>
    );

    // calculate cost + count based on buyMode
    let buyCount, displayCost;
    if (buyMode === "1") {
        buyCount = 1;
        displayCost = costOf(upgrade, level, COST_MULTIPLIER);
    } else if (buyMode === "10") {
        buyCount = 10;
        displayCost = bulkCost(upgrade, level, 10);
    } else { // "max"
        const result = maxAffordable(upgrade, level, coins);
        buyCount = Math.max(1, result.count);  // at least 1 for the cost display
        displayCost = result.count > 0 ? result.cost : costOf(upgrade, level, COST_MULTIPLIER);
    }

    const canBuy = coins >= displayCost && buyCount > 0;
    const actualBuyable = buyMode === "max" ? maxAffordable(upgrade, level, coins).count : buyCount;

    return (
        <Tooltip content={tooltipContent} placement="left">
            <button
                className="upgrade-btn"
                onClick={() => onBuy(upgrade.id, buyCount)}
                disabled={!canBuy}
            >
                <div className="upgrade-btn-icon">{upgrade.icon}</div>
                <div className="upgrade-btn-body">
                    <div className="upgrade-btn-header">
                        <span className="upgrade-btn-name">{upgrade.name}</span>
                        <span className="upgrade-btn-level">
                            lv. {level}
                            {tier > 0 && <span className="upgrade-btn-mult">×{mult}</span>}
                        </span>
                    </div>
                    <div className="upgrade-btn-desc">{effectDesc}</div>
                    {level > 0 && (
                        <div className="upgrade-btn-milestone">
                            ×{nextMult} in {toNext} {toNext === 1 ? "level" : "levels"}
                        </div>
                    )}
                    <div className={`upgrade-btn-cost ${canBuy ? "is-affordable" : ""}`}>
                        {buyMode !== "1" && actualBuyable > 0 && (
                            <span className="upgrade-btn-bulk">+{actualBuyable} </span>
                        )}
                        {fmt(displayCost)} ◉
                    </div>
                </div>
            </button>
        </Tooltip>
    );
}