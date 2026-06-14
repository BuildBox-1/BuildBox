import { useState, useCallback } from "react";
import { Link } from "react-router";

type BtnKind = "digit" | "op" | "action" | "equals";

interface CalcState {
    display: string;
    prev: number | null;
    op: string | null;
    waitNext: boolean;
}

const INIT: CalcState = { display: "0", prev: null, op: null, waitNext: false };

function applyOp(a: number, b: number, op: string): number {
    switch (op) {
        case "+": return a + b;
        case "−": return a - b;
        case "×": return a * b;
        case "÷": return b !== 0 ? a / b : NaN;
        default: return b;
    }
}

function fmt(n: number): string {
    if (isNaN(n)) return "Error";
    const s = parseFloat(n.toPrecision(10)).toString();
    return s.length > 12 ? n.toExponential(5) : s;
}

const BUTTONS: { label: string; kind: BtnKind; wide?: boolean }[] = [
    { label: "AC", kind: "action" },
    { label: "+/−", kind: "action" },
    { label: "%", kind: "action" },
    { label: "÷", kind: "op" },
    { label: "7", kind: "digit" },
    { label: "8", kind: "digit" },
    { label: "9", kind: "digit" },
    { label: "×", kind: "op" },
    { label: "4", kind: "digit" },
    { label: "5", kind: "digit" },
    { label: "6", kind: "digit" },
    { label: "−", kind: "op" },
    { label: "1", kind: "digit" },
    { label: "2", kind: "digit" },
    { label: "3", kind: "digit" },
    { label: "+", kind: "op" },
    { label: "0", kind: "digit", wide: true },
    { label: ".", kind: "digit" },
    { label: "=", kind: "equals" },
];

const KIND_STYLE: Record<BtnKind, string> = {
    digit: "bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] text-white",
    op: "bg-[#6030a0] hover:bg-[#7040b8] active:bg-[#502890] text-white",
    action: "bg-[#a060dc] hover:bg-[#b070ec] active:bg-[#9050cc] text-white",
    equals: "bg-[#f5a623] hover:bg-[#f7b540] active:bg-[#e09010] text-white",
};

export default function App() {
    const [state, setState] = useState<CalcState>(INIT);

    const dispatch = useCallback((label: string) => {
        setState((s) => {
        
            if (/^[0-9.]$/.test(label)) {
                if (label === "." && s.display.includes(".") && !s.waitNext) return s;
                const next =
                    s.waitNext || s.display === "0"
                        ? label === "." ? "0." : label
                        : s.display.length < 12
                            ? s.display + label
                            : s.display;
                return { ...s, display: next, waitNext: false };
            }

            if (label === "AC") return INIT;

            if (label === "+/−") {
                return { ...s, display: fmt(parseFloat(s.display) * -1) };
            }

            if (label === "%") {
                return { ...s, display: fmt(parseFloat(s.display) / 100) };
            }

            if (["+", "−", "×", "÷"].includes(label)) {
                const cur = parseFloat(s.display);
                if (s.prev !== null && !s.waitNext) {
                    const result = applyOp(s.prev, cur, s.op!);
                    return { display: fmt(result), prev: result, op: label, waitNext: true };
                }
                return { ...s, prev: cur, op: label, waitNext: true };
            }

            if (label === "=") {
                if (s.prev === null || s.op === null) return s;
                const result = applyOp(s.prev, parseFloat(s.display), s.op);
                return { display: fmt(result), prev: null, op: null, waitNext: true };
            }

            return s;
        });
    }, []);

    const activeOp = state.op && state.waitNext ? state.op : null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col items-start gap-3 w-72">

                <Link
                    to="/projects/calculator"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
                >
                    ← Back
                </Link>

                <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-[#8748c7]/30">

                    <div className="bg-[#2F4F4F] px-5 pt-8 pb-5">
                        <p className="text-[#d4a8ff] text-sm text-right h-5 mb-1 font-mono">
                            {state.prev !== null && state.op ? `${fmt(state.prev)} ${state.op}` : "\u00A0"}
                        </p>
                        <p
                            className="text-white text-right font-light leading-none"
                            style={{ fontSize: state.display.length > 9 ? "2rem" : "3rem" }}
                        >
                            {state.display}
                        </p>
                    </div>

                    <div className="bg-[#1a0a2e] p-3 grid grid-cols-4 gap-2.5">
                        {BUTTONS.map(({ label, kind, wide }) => (
                            <button
                                key={label}
                                onClick={() => dispatch(label)}
                                className={[
                                    wide ? "col-span-2" : "col-span-1",
                                    KIND_STYLE[kind],
                                    label === activeOp ? "ring-2 ring-white/60" : "",
                                    "h-14 rounded-2xl text-lg font-medium transition-all duration-100 active:scale-95 select-none",
                                ].join(" ")}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}