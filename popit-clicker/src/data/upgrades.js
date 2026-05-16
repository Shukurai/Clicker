export const UPGRADES = [
    { id: "finger", name: "Strong Finger", description: "+1 per click", baseCost: 15, type: "click", value: 1, icon: "👆" },
    { id: "auto", name: "Auto-Finger", description: "+1 pop/sec", baseCost: 80, type: "auto", value: 1, icon: "🤖", creature: "🤖" },
    { id: "hand", name: "Robo-Hand", description: "+5 pops/sec", baseCost: 400, type: "auto", value: 5, icon: "🦾", creature: "✋" },
    { id: "popper", name: "Popping Machine", description: "+25 pops/sec", baseCost: 2_000, type: "auto", value: 25, icon: "⚙️", creature: "⚙️" },
    { id: "factory", name: "Bubble Factory", description: "+100 pops/sec", baseCost: 12_000, type: "auto", value: 100, icon: "🏭", creature: "🏭" },
    { id: "army", name: "Finger Army", description: "+500 pops/sec", baseCost: 75_000, type: "auto", value: 500, icon: "✋", creature: "🚶" },
    { id: "lab", name: "Bubble Lab", description: "+3,000 pops/sec", baseCost: 500_000, type: "auto", value: 3000, icon: "🧪", creature: "👨‍🔬" },
    { id: "cosmic", name: "Cosmic Bubble", description: "+15,000 pops/sec", baseCost: 4_000_000, type: "auto", value: 15000, icon: "🌌", creature: "🛸" },
];

export const COST_MULTIPLIER = 1.15;
export const TICK_MS = 100;

