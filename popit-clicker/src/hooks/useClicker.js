import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { UPGRADES, COST_MULTIPLIER, TICK_MS } from "../data/upgrades";
import { usePersistentState } from "./usePersistentState";
import { effectiveValue } from "../utils/upgrade";
const initialLevels = () =>
    UPGRADES.reduce((acc, u) => ({ ...acc, [u.id]: 0 }), {});

const STORAGE_KEY = "popit-clicker:v1";

export function useClicker() {
    const [save, setSave] = usePersistentState(STORAGE_KEY, {
        coins: 0,
        total: 0,
        clicks: 0,
        levels: initialLevels(),
    });

    const { coins, total, clicks, levels } = save;

    const setCoins = useCallback((updater) => {
        setSave(s => ({
            ...s,
            coins: typeof updater === "function" ? updater(s.coins) : updater,
        }));
    }, [setSave]);

    const setTotal = useCallback((updater) => {
        setSave(s => ({
            ...s,
            total: typeof updater === "function" ? updater(s.total) : updater,
        }));
    }, [setSave]);

    const setClicks = useCallback((updater) => {
        setSave(s => ({
            ...s,
            clicks: typeof updater === "function" ? updater(s.clicks) : updater,
        }));
    }, [setSave]);

    const setLevels = useCallback((updater) => {
        setSave(s => ({
            ...s,
            levels: typeof updater === "function" ? updater(s.levels) : updater,
        }));
    }, [setSave]);

   
    const [floats, setFloats] = useState([]);
    const floatId = useRef(0);

    const clickPower = useMemo(
        () => 1 + UPGRADES
            .filter(u => u.type === "click")
            .reduce((s, u) => s + effectiveValue(u, levels[u.id]) * levels[u.id], 0),
        [levels]
    );

    const autoIncome = useMemo(
        () => UPGRADES
            .filter(u => u.type === "auto")
            .reduce((s, u) => s + effectiveValue(u, levels[u.id]) * levels[u.id], 0),
        [levels]
    );
    useEffect(() => {
        if (autoIncome <= 0) return;
        const id = setInterval(() => {
            const gain = autoIncome / (1000 / TICK_MS);
            setCoins(c => c + gain);
            setTotal(t => t + gain);
        }, TICK_MS);
        return () => clearInterval(id);
        
    }, [autoIncome]);

    const pop = useCallback((x, y) => {
        setCoins(c => c + clickPower);
        setTotal(t => t + clickPower);
        setClicks(n => n + 1);

        const id = floatId.current++;
        setFloats(f => [...f, { id, x, y, value: clickPower }]);
        setTimeout(() => {
            setFloats(f => f.filter(fl => fl.id !== id));
        }, 900);
       
    }, [clickPower]);

    const buy = useCallback((upgradeId) => {
        const upgrade = UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade) return false;

        const level = levels[upgradeId];
        const cost = Math.ceil(upgrade.baseCost * Math.pow(COST_MULTIPLIER, level));
        if (coins < cost) return false;

        setSave(s => ({
            ...s,
            coins: s.coins - cost,
            levels: { ...s.levels, [upgradeId]: s.levels[upgradeId] + 1 },
        }));
        return true;
    }, [coins, levels, setSave]);

    const reset = useCallback(() => {
        setSave({
            coins: 0,
            total: 0,
            clicks: 0,
            levels: initialLevels(),
        });
    }, [setSave]);

    const spendCoins = useCallback((amount) => {
        if (coins < amount) return false;
        setCoins(c => c - amount);
        return true;
    }, [coins]);

    return {
        coins, total, clicks, levels, floats,
        clickPower, autoIncome,
        pop, buy, reset,
        spendCoins,  // ← новое
    };
}