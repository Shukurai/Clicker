import { fmt } from "../../utils/format";
import "./Bubble.css";

export function Bubble({ floats, onPop }) {
    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onPop(x, y);
    };

    return (
        <div className="bubble-wrap">
            <button
                className="bubble"
                onClick={handleClick}
                aria-label="Pop the bubble"
            />
            {floats.map(f => (
                <div
                    key={f.id}
                    className="bubble-float"
                    style={{ left: f.x, top: f.y }}
                >
                    +{fmt(f.value)}
                </div>
            ))}
        </div>
    );
}