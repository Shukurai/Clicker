import { fmt } from "../../utils/format";
import "./UnlockButton.css";

export function UnlockButton({ unlock, coins, onBuy }) {
    const canBuy = coins >= unlock.cost;

    return (
        <button
            className="unlock-btn"
            onClick={() => { if (canBuy) onBuy(unlock.id); }}
            aria-disabled={!canBuy}
        >
            <div className="unlock-btn-icon">{unlock.icon}</div>
            <div className="unlock-btn-body">
                <div className="unlock-btn-name">{unlock.name}</div>
                <div className="unlock-btn-desc">{unlock.description}</div>
                <div className={`unlock-btn-cost ${canBuy ? "is-affordable" : ""}`}>
                    {fmt(unlock.cost)} ◉
                </div>
            </div>
            <div className="unlock-btn-badge">NEW</div>
        </button>
    );
}