import { useMemo, useCallback } from "react";
import { UNLOCKS } from "../data/unlocks";
import { usePersistentState } from "./usePersistentState";

const STORAGE_KEY = "popit-clicker:unlocks:v1";

export function useUnlocks(coins, spendCoins) {
    const [owned, setOwned] = usePersistentState(STORAGE_KEY, {});

    // map of { featureName: true } for fast lookup in components
    const features = useMemo(() => {
        const map = {};
        UNLOCKS.forEach(u => {
            if (owned[u.id]) map[u.feature] = true;
        });
        return map;
    }, [owned]);

    const isOwned = useCallback((id) => !!owned[id], [owned]);

    const isAvailable = useCallback((unlock) => {
        if (owned[unlock.id]) return false;
        if (unlock.requires && !owned[unlock.requires]) return false;
        return true;
    }, [owned]);

    const buy = useCallback((id) => {
        const unlock = UNLOCKS.find(u => u.id === id);
        if (!unlock || owned[id]) return false;
        if (unlock.requires && !owned[unlock.requires]) return false;
        if (!spendCoins(unlock.cost)) return false;

        setOwned(o => ({ ...o, [id]: true }));
        return true;
    }, [owned, spendCoins, setOwned]);

    const reset = useCallback(() => setOwned({}), [setOwned]);

    return { owned, features, isOwned, isAvailable, buy, reset };
}