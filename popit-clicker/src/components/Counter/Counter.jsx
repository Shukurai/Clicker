import { fmt } from "../../utils/format";
import "./Counter.css";

export function Counter({ coins, autoIncome, clickPower }) {
    return (
        <div className="counter">
            <div className="counter-label">Popped</div>
            <div className="counter-value">{fmt(coins)}</div>
            <div className="counter-meta">
                {autoIncome > 0 ? `+${fmt(autoIncome)} / sec` : "by hand only"}
                {" · "}
                {clickPower} per click
            </div>
        </div>
    );
}