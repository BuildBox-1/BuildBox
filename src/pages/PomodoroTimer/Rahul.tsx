import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

type Mode = "work" | "short" | "long";

const DURATION: Record<Mode, number> = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
const LABEL: Record<Mode, string> = { work: "Focus", short: "Short Break", long: "Long Break" };

function fmt(s: number) {
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function App() {
    const [mode, setMode] = useState<Mode>("work");
    const [time, setTime] = useState(DURATION.work);
    const [running, setRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const interval = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (running) {
            interval.current = setInterval(() => setTime(t => t - 1), 1000);
        } else {
            if (interval.current) clearInterval(interval.current);
        }
        return () => { if (interval.current) clearInterval(interval.current); };
    }, [running]);

 
    useEffect(() => {
        if (time > 0) return;
        setRunning(false);
        if (mode === "work") {
            const next = sessions + 1;
            setSessions(next);
            const nextMode: Mode = next % 4 === 0 ? "long" : "short";
            setMode(nextMode);
            setTime(DURATION[nextMode]);
        } else {
            setMode("work");
            setTime(DURATION.work);
        }
    }, [time]);

    function toggle() { setRunning(r => !r); }

    function switchMode(m: Mode) {
        setRunning(false);
        setMode(m);
        setTime(DURATION[m]);
    }

    function reset() {
        setRunning(false);
        setTime(DURATION[mode]);
    }

    const progress = (1 - time / DURATION[mode]) * 100;

    return (
        <div className="min-h-screen bg-[#0D1117] flex justify-center p-4">

            <div className="w-full max-w-sm">
                <Link
                    to="/projects/pomodoro-timer"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
                >
                    ← Back
                </Link>
                <div className="bg-[#8748c7] px-6 py-5 mt-12">
                    <h1 className="text-white font-semibold text-lg">Pomodoro Timer</h1>
                    <p className="text-[#d4a8ff] text-sm">{sessions} session{sessions !== 1 ? "s" : ""} completed</p>
                </div>

                <div className="bg-[#120d24] px-6 py-6 space-y-6">

                    <div className="flex gap-2">
                        {(["work", "short", "long"] as Mode[]).map(m => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${mode === m
                                        ? "bg-[#8748c7] text-white"
                                        : "bg-[#09051a] text-[#5a4a7a] hover:text-[#8748c7] border border-[#8748c7]/20"
                                    }`}
                            >
                                {LABEL[m]}
                            </button>
                        ))}
                    </div>

                    <div className="text-center py-2">
                        <p className="text-white font-mono text-7xl font-light tracking-widest">{fmt(time)}</p>
                        <p className="text-[#4a3a7a] text-sm mt-2">{LABEL[mode]}</p>
                    </div>

                    <div className="h-1 bg-[#09051a] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#8748c7] rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={toggle}
                            className="flex-1 py-3.5 rounded-xl bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] text-white font-medium transition-all active:scale-[0.98]"
                        >
                            {running ? "Pause" : "Start"}
                        </button>
                        <button
                            onClick={reset}
                            className="px-5 py-3.5 rounded-xl border border-[#8748c7]/30 text-[#8748c7] hover:bg-[#8748c7]/10 transition-all active:scale-95"
                        >
                            Reset
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}