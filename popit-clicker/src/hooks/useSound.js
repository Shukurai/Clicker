import { useRef, useCallback } from "react";
import { usePersistentState } from "./usePersistentState";

export function useSound() {
    const [enabled, setEnabled] = usePersistentState("popit-clicker:sound", true);
    const ctxRef = useRef(null);

    // lazy init — browsers require a user gesture before audio works
    const getCtx = () => {
        if (!ctxRef.current) {
            const Ctor = window.AudioContext || window.webkitAudioContext;
            ctxRef.current = new Ctor();
        }
        if (ctxRef.current.state === "suspended") {
            ctxRef.current.resume();
        }
        return ctxRef.current;
    };

    const playPop = useCallback(() => {
        if (!enabled) return;
        const ctx = getCtx();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // slight random pitch — each pop sounds unique
        const startFreq = 700 + Math.random() * 250;
        osc.type = "sine";
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

        // ADSR-like envelope: fast attack, fast decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }, [enabled]);

    const playBuy = useCallback(() => {
        if (!enabled) return;
        const ctx = getCtx();
        const now = ctx.currentTime;

        // two-note arpeggio C5 → G5
        [523.25, 783.99].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const t = now + i * 0.06;

            osc.type = "triangle";
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.25);
        });
    }, [enabled]);


    const playMilestone = useCallback(() => {
        if (!enabled) return;
        const ctx = getCtx();
        const now = ctx.currentTime;

        // fanfare: C5 → E5 → G5 → C6
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const t = now + i * 0.08;

            osc.type = "triangle";
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.35);
        });
    }, [enabled]);


    return { playPop, playBuy, playMilestone, enabled, setEnabled };
}