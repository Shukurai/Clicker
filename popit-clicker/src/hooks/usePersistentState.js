import { useState, useEffect, useRef } from "react";

const DEBOUNCE_MS = 300;
const MAX_WAIT_MS = 1500;

/**
 * Like useState, but persists to localStorage.
 * Writes are debounced (300ms idle) with a max wait (1500ms during burst activity).
 * Also flushes on page hide to catch tab close.
 */
export function usePersistentState(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored !== null ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const timer = useRef(null);
    const lastWrite = useRef(Date.now());
    const valueRef = useRef(value);
    valueRef.current = value;

    useEffect(() => {
        const write = () => {
            try {
                localStorage.setItem(key, JSON.stringify(valueRef.current));
                lastWrite.current = Date.now();
            } catch {
                // quota / disabled — fail silently
            }
        };

        // force write if too much time passed since last write
        if (Date.now() - lastWrite.current >= MAX_WAIT_MS) {
            write();
            return;
        }

        // otherwise debounce
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(write, DEBOUNCE_MS);

        return () => clearTimeout(timer.current);
    }, [key, value]);

    // flush on tab close / hide
    useEffect(() => {
        const flush = () => {
            try {
                localStorage.setItem(key, JSON.stringify(valueRef.current));
            } catch { }
        };
        window.addEventListener("pagehide", flush);
        return () => window.removeEventListener("pagehide", flush);
    }, [key]);

    return [value, setValue];
}