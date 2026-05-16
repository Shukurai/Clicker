import { useClicker } from "./hooks/useClicker";
import { useSound } from "./hooks/useSound";
import { useUnlocks } from "./hooks/useUnlocks";
import { Counter } from "./components/Counter/Counter";
import { Bubble } from "./components/Bubble/Bubble";
import { StatCard } from "./components/StatCard/StatCard";
import { Shop } from "./components/Shop/Shop";
import { fmt } from "./utils/format";
import { useEffect } from "react";
import { Tooltip } from "./components/Tooltip/Tooltip";
import { tierOf } from "./utils/upgrade";
import { CreatureTicker } from "./components/CreatureTicker/CreatureTicker";
import "./App.css";

function App() {
  const clicker = useClicker();
  const unlocks = useUnlocks(clicker.coins, clicker.spendCoins);
  const { features } = unlocks;

  const {
    coins, total, clicks, levels, floats,
    clickPower, autoIncome,
    pop, buy, reset,
  } = clicker;

  useEffect(() => {
    document.documentElement.dataset.theme = features.UI ? "modern" : "retro";
  }, [features.UI]);

  const { playPop, playBuy, playMilestone, enabled: soundOn, setEnabled: setSoundOn } = useSound();

  const handlePop = (x, y) => {
    pop(x, y);
    if (features.clickSound) playPop();
  };

  const handleBuy = (id) => {
    const oldLevel = levels[id];
    if (!buy(id)) return;
    const newLevel = oldLevel + 1;

    if (features.milestoneSound && tierOf(newLevel) > tierOf(oldLevel)) {
      playMilestone();
    } else if (features.buySound) {
      playBuy();
    }
  };

  const handleReset = () => {
    if (confirm("Reset all progress?")) {
      clicker.reset();
      unlocks.reset();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Popit</h1>
        <div className="app-header-actions">
          <Tooltip content={soundOn ? "Mute sounds" : "Unmute sounds"} placement="bottom">
            <button
              className="app-reset"
              onClick={() => setSoundOn(v => !v)}
              aria-label={soundOn ? "Mute" : "Unmute"}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>
          </Tooltip>
          <Tooltip content="Reset all progress" placement="bottom">
            <button className="app-reset" onClick={handleReset}>
              Reset
            </button>
          </Tooltip>
        </div>
      </header>

      <main className="app-main">
        <section className="app-stage">
          <Counter coins={coins} autoIncome={autoIncome} clickPower={clickPower} />
          <Bubble floats={floats} onPop={handlePop} />
          {features.statsPanel && (
            <div className="app-stats">
              <StatCard label="Total" value={fmt(total)} />
              <StatCard label="Clicks" value={clicks.toLocaleString("en-US")} />
            </div>
          )}
          <CreatureTicker levels={levels} />
        </section>

        <Shop
          levels={levels}
          coins={coins}
          total={total}
          onBuy={handleBuy}
          unlocks={unlocks}
          onUnlock={unlocks.buy}
        />
      </main>

      
        
    </div>
  );
}

export default App;