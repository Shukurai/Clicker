import { UPGRADES } from "../../data/upgrades";
import { UpgradeButton } from "../UpgradeButton/UpgradeButton";
import { UNLOCKS } from "../../data/unlocks";
import { UnlockButton } from "../UnlockButton/UnlockButton";
import { useState } from "react";
import "./Shop.css";

export function Shop({
    levels, coins, total, onBuy,
    unlocks, onUnlock, features
}) 
{
    const [buyMode, setBuyMode] = useState("1");
    const visibleUpgrades = UPGRADES.filter(u => total >= u.baseCost * 0.5);
    const visibleUnlocks = UNLOCKS
        .filter(u => !unlocks.isOwned(u.id) && (!u.requires || unlocks.isOwned(u.requires)))
        .sort((a, b) => a.cost - b.cost)
        .slice(0, 3);

    return (
        <aside className="shop">
            {visibleUnlocks.length > 0 && (
                <>
                    <h2 className="shop-title">Features</h2>
                    <div className="shop-list">
                        {visibleUnlocks.map(u => (
                            <UnlockButton
                                key={u.id}
                                unlock={u}
                                coins={coins}
                                onBuy={onUnlock}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="Upgrade-contaier">
                <h2 className="shop-title shop-title-secondary">Upgrades</h2>
                <div className="shop-buy-mode">
                    <span className="shop-buy-mode-label">Buy:</span>
                    {["1", "10", "max"].map(mode => (
                        <button
                            key={mode}
                            className={`shop-buy-mode-btn ${buyMode === mode ? "is-active" : ""}`}
                            onClick={() => setBuyMode(mode)}
                        >
                            ×{mode}
                        </button>
                    ))}
                </div>
            </div>
            
            
            <div className="shop-list">
                {visibleUpgrades.map(upgrade => (
                    <UpgradeButton
                        key={upgrade.id}
                        upgrade={upgrade}
                        level={levels[upgrade.id]}
                        coins={coins}
                        onBuy={onBuy}
                        features={features}
                        buyMode={buyMode}
                    />
                ))}
            </div>
        </aside>
    );
}