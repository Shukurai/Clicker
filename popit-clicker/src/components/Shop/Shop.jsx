import { UPGRADES } from "../../data/upgrades";
import { UpgradeButton } from "../UpgradeButton/UpgradeButton";
import { UNLOCKS } from "../../data/unlocks";
import { UnlockButton } from "../UnlockButton/UnlockButton";
import "./Shop.css";

export function Shop({
    levels, coins, total, onBuy,
    unlocks, onUnlock,
}) {
    const visibleUpgrades = UPGRADES.filter(u => total >= u.baseCost * 0.5);
    const visibleUnlocks = UNLOCKS.filter(
        u => !unlocks.isOwned(u.id) && (!u.requires || unlocks.isOwned(u.requires))
    );

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

            <h2 className="shop-title shop-title-secondary">Upgrades</h2>
            <div className="shop-list">
                {visibleUpgrades.map(upgrade => (
                    <UpgradeButton
                        key={upgrade.id}
                        upgrade={upgrade}
                        level={levels[upgrade.id]}
                        coins={coins}
                        onBuy={onBuy}
                    />
                ))}
            </div>
        </aside>
    );
}