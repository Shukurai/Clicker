import { useMemo } from "react";
import { getCreatures } from "../../utils/creatures";
import "./CreatureTicker.css";

export function CreatureTicker({ levels }) {
    const creatures = useMemo(() => getCreatures(levels), [levels]);

   
    const enriched = useMemo(() => {
        return creatures.map(c => ({
            ...c,
            lane: Math.floor(Math.random() * 3),       
            duration: 8 + Math.random() * 10,          
            delay: -Math.random() * 18,                
            flipped: Math.random() > 0.5,              
        }));
        
    }, [creatures.length]);
    

    return (
        <div className="creature-ticker" aria-hidden="true">
            {enriched.length === 0 ? (
                <div className="creature-ticker-empty">No workers yet</div>
            ) : (
                enriched.map(c => (
                    <div
                        key={c.id}
                        className="creature"
                        style={{
                            "--lane": c.lane,
                            "--duration": `${c.duration}s`,
                            "--delay": `${c.delay}s`,
                            "--flip": c.flipped ? "scaleX(-1)" : "scaleX(1)",
                        }}
                    >
                        {c.emoji}
                    </div>
                ))
            )}
        </div>
    );
}