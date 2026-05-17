import { useClicker } from "./hooks/useClicker";
import { useSound } from "./hooks/useSound";
import { useUnlocks } from "./hooks/useUnlocks";
import { Counter } from "./components/Counter/Counter";
import { Bubble } from "./components/Bubble/Bubble";
import { StatCard } from "./components/StatCard/StatCard";
import { Shop } from "./components/Shop/Shop";
import { fmt } from "./utils/format";
import { useState, useEffect, useRef } from "react";
import { Tooltip } from "./components/Tooltip/Tooltip";
import { tierOf } from "./utils/upgrade";
import { CreatureTicker } from "./components/CreatureTicker/CreatureTicker";
import "./App.css";

function App() {
  const [features, setFeatures] = useState({});

  const clicker = useClicker(features);
  const unlocks = useUnlocks(clicker.coins, clicker.spendCoins);

  const cheatRef = useRef({ clicker, unlocks });
  cheatRef.current = { clicker, unlocks };

  const {
    coins, total, clicks, levels, floats,
    clickPower, autoIncome,
    pop, buy, reset,
  } = clicker;


  //Buy UIFIAT
  useEffect(() => {
    let theme = "retro";
    if (unlocks.features.UI) theme = "modern";
    else if (unlocks.features.uiFlat) theme = "transition";
    document.documentElement.dataset.theme = theme;
  }, [unlocks.features.uiFlat, unlocks.features.uiNeo, features.UI]);

  // Sync features into local state for useClicker
  useEffect(() => {
    setFeatures(unlocks.features);
  }, [unlocks.features]);

  const { playPop, playBuy, playMilestone, enabled: soundOn, setEnabled: setSoundOn } = useSound();

  const handlePop = (x, y) => {
    pop(x, y);
    if (features.clickSound) playPop();
  };

  const handleBuy = (id, count = 1) => {
    const oldLevel = levels[id];
    if (!buy(id, count)) return;
    const newLevel = oldLevel + count;

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
  useEffect(() => {
    //if (!import.meta.env.DEV) return;

    window.cheat = {
      coins: (n) => {
        cheatRef.current.clicker.spendCoins(-n);
        console.log(`💰 Added ${n} coins`);
      },
      level: (upgradeId, n = 1) => {
        for (let i = 0; i < n; i++) {
          cheatRef.current.clicker.buy(upgradeId);
        }
        console.log(`📈 +${n} level(s) for ${upgradeId}`);
      },
      unlock: (id) => {
        cheatRef.current.unlocks.buy(id);
        console.log(`🔓 Unlocked ${id}`);
      },
      reset: () => {
        cheatRef.current.clicker.reset();
        cheatRef.current.unlocks.reset();
        console.log("🔄 Full reset");
      },
      help: () => {
        console.log(`Available cheats:
        cheat.coins(n)           — add n coins
        cheat.level(id, n=1)     — add n levels to upgrade id
        cheat.unlock(id)         — buy unlock by id
        cheat.reset()            — reset everything
        cheat.help()             — this message`);
      },
    };
    console.log("🎮 Cheats loaded. Type cheat.help() in console.");
  }, []);

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
        {features.final && "I GUESS U WIN)"}
        <section className="app-stage">
          <Counter coins={coins} autoIncome={autoIncome} clickPower={clickPower} />
          <Bubble floats={floats} onPop={handlePop} />
          {features.statsPanel && (
            <div className="app-stats">
              <StatCard label="Total" value={fmt(total)} />
              <StatCard label="Clicks" value={clicks.toLocaleString("en-US")} />
            </div>
          )}
          {features.UIFarm &&
            <CreatureTicker levels={levels} />}
        </section>

        <Shop
          levels={levels}
          coins={coins}
          total={total}
          onBuy={handleBuy}
          unlocks={unlocks}
          onUnlock={unlocks.buy}
          features={unlocks.features}
        />
      </main>

      
        
    </div>
  );
}

export default App;