import { fmt, costOf } from "../../utils/format";
import { COST_MULTIPLIER } from "../../data/upgrades";
import { Tooltip } from "../Tooltip/Tooltip";

import {
    tierOf,
    tierMultiplier,
    levelsToNextTier,
    TIER_MULTIPLIER,
} from "../../utils/upgrade";
import "./UpgradeButton.css";

export function UpgradeButton({ upgrade, level, coins, onBuy }) {
    const cost = costOf(upgrade, level, COST_MULTIPLIER);
    const canBuy = coins >= cost;

    const tier = tierOf(level);
    const mult = tierMultiplier(level);
    const toNext = levelsToNextTier(level);
    const nextMult = mult * TIER_MULTIPLIER;

    const tooltipContent = (
        <div>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>{upgrade.name}</div>
            <div style={{ opacity: 0.85, marginBottom: 6 }}>
                Each level: +{upgrade.value} {upgrade.type === "click" ? "per click" : "/ sec"}
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

    return (
        <Tooltip content={tooltipContent} placement="left">
            
                <button
                    className="upgrade-btn"
                    onClick={() => onBuy(upgrade.id)}
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
                        <div className="upgrade-btn-desc">{upgrade.description}</div>
                        {level > 0 && (
                            <div className="upgrade-btn-milestone">
                                ×{nextMult} in {toNext} {toNext === 1 ? "level" : "levels"}
                            </div>
                        )}
                        <div className={`upgrade-btn-cost ${canBuy ? "is-affordable" : ""}`}>
                            {fmt(cost)} ◉
                        </div>
                    </div>
                </button>
        </Tooltip>
    );
}