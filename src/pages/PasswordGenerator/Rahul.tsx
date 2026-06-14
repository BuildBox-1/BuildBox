import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router";

const CS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    upperClean: "ABCDEFGHJKLMNPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    lowerClean: "abcdefghjkmnpqrstuvwxyz",
    digits: "0123456789",
    digitsClean: "23456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};
const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";

interface Opts {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    noAmbiguous: boolean;
}

type Strength = "weak" | "fair" | "good" | "strong";

const CHAR_TYPES = ["uppercase", "lowercase", "numbers", "symbols"] as const;

function buildCharset(o: Opts): string {
    const c = o.noAmbiguous;
    return [
        o.uppercase ? (c ? CS.upperClean : CS.upper) : "",
        o.lowercase ? (c ? CS.lowerClean : CS.lower) : "",
        o.numbers ? (c ? CS.digitsClean : CS.digits) : "",
        o.symbols ? CS.symbols : "",
    ].join("");
}

function generatePassword(o: Opts): string {
    const cs = buildCharset(o);
    if (!cs) return "";
    const buf = new Uint32Array(o.length);
    crypto.getRandomValues(buf);
    return Array.from(buf, (x) => cs[x % cs.length]).join("");
}

function calcStrength(pw: string, o: Opts): { label: Strength; bars: number } {
    let s = 0;
    const types = CHAR_TYPES.filter((k) => o[k]).length;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (pw.length >= 16) s++;
    if (types >= 2) s++;
    if (types >= 3) s++;
    if (types >= 4) s++;
    const bars = Math.max(1, Math.round((s / 6) * 4));
    const label: Strength = s <= 2 ? "weak" : s <= 3 ? "fair" : s <= 4 ? "good" : "strong";
    return { label, bars };
}

const BAR_COLOR: Record<Strength, string> = {
    weak: "bg-red-500",
    fair: "bg-amber-400",
    good: "bg-yellow-300",
    strong: "bg-green-500",
};

function Switch({ on }: { on: boolean }) {
    return (
        <div
            aria-hidden="true"
            className={`relative w-9 h-5 rounded-full flex-shrink-0 pointer-events-none transition-colors duration-200 ${on ? "bg-[#8748c7]" : "bg-[#21262D]"
                }`}
        >
            <div
                className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] bg-white rounded-full transition-transform duration-200 ${on ? "translate-x-4" : "translate-x-0"
                    }`}
            />
        </div>
    );
}

export default function App() {
    const [opts, setOpts] = useState<Opts>({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        noAmbiguous: false,
    });

    const [password, setPassword] = useState("");
    const [display, setDisplay] = useState("");
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scramble = useCallback((target: string) => {
        if (timer.current) clearTimeout(timer.current);
        let frame = 0;
        const FRAMES = 10;
        const tick = () => {
            frame++;
            if (frame >= FRAMES) { setDisplay(target); return; }
            const done = Math.floor((frame / FRAMES) * target.length);
            const noise = Array.from(
                { length: target.length - done },
                () => NOISE[Math.floor(Math.random() * NOISE.length)],
            ).join("");
            setDisplay(target.slice(0, done) + noise);
            timer.current = setTimeout(tick, 25);
        };
        tick();
    }, []);

    const regen = useCallback(() => {
        const pw = generatePassword(opts);
        setPassword(pw);
        scramble(pw);
        setCopied(false);
    }, [opts, scramble]);

    useEffect(() => { regen(); }, [regen]);

    const copy = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggle = (key: keyof Opts) => {
        setOpts((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            // keep at least one character type active
            if ((CHAR_TYPES as readonly string[]).includes(key)) {
                if (!CHAR_TYPES.some((k) => next[k])) return prev;
            }
            return next;
        });
    };

    const str = password ? calcStrength(password, opts) : null;
    const entropy = Math.round(Math.log2(Math.max(1, buildCharset(opts).length)) * opts.length);

    return (

        <div className="min-h-screen bg-[#0D1117] flex justify-center p-4">

            <div className="w-full max-w-sm">
                <Link
                    to="/projects/password-generator"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8"
                >
                    ← Back
                </Link>
                <div className="text-center mt-12 mb-8">
                    <p className="text-[10px] tracking-[0.22em] text-[#58A6FF] uppercase font-medium mb-1">
                        Secure · Local · Cryptographic
                    </p>
                    <h1 className="text-[22px] font-semibold text-[#E6EDF3] tracking-tight">
                        Password Generator
                    </h1>
                </div>

                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 mb-3">
                    <div className="flex items-start gap-3">
                        <p
                            aria-live="polite"
                            aria-label="Generated password"
                            className="flex-1 font-mono text-[15px] text-[#8748c7] break-all leading-relaxed tracking-wider min-h-6 select-all"
                        >
                            {display || <span className="text-[#484F58]">—</span>}
                        </p>
                        <button
                            onClick={copy}
                            aria-label={copied ? "Password copied" : "Copy password to clipboard"}
                            className={`flex-shrink-0 mt-0.5 px-3 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150 ${copied
                                ? "border-green-500/30 text-green-400 bg-green-500/10"
                                : "border-[#30363D] text-[#8B949E] hover:text-[#C9D1D9] hover:border-[#484F58]"
                                }`}
                        >
                            {copied ? "✓ Copied" : "Copy"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-5 px-1">
                    <div className="flex gap-1 flex-1" role="meter" aria-label="Password strength">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${str && i < str.bars ? BAR_COLOR[str.label] : "bg-[#21262D]"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {str && (
                            <span className="text-[11px] text-[#8B949E] capitalize">{str.label}</span>
                        )}
                        <span className="text-[11px] text-[#484F58] font-mono">~{entropy}b</span>
                    </div>
                </div>

                <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden mb-4">

                    <div className="px-4 pt-4 pb-3">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="length-slider" className="text-sm text-[#8B949E]">
                                Length
                            </label>
                            <span className="font-mono text-sm text-[#E6EDF3]">{opts.length}</span>
                        </div>
                        <input
                            id="length-slider"
                            type="range"
                            min={4}
                            max={64}
                            step={1}
                            value={opts.length}
                            onChange={(e) => setOpts((p) => ({ ...p, length: +e.target.value }))}
                            className="w-full accent-[#58A6FF] cursor-pointer"
                        />
                    </div>

                    <div className="h-px bg-[#21262D]" />

                    {(
                        [
                            { key: "uppercase", label: "Uppercase", hint: "A–Z" },
                            { key: "lowercase", label: "Lowercase", hint: "a–z" },
                            { key: "numbers", label: "Numbers", hint: "0–9" },
                            { key: "symbols", label: "Symbols", hint: "!@#$" },
                            { key: "noAmbiguous", label: "Exclude ambiguous", hint: "0 O l I 1" },
                        ] as const
                    ).map(({ key, label, hint }, idx, arr) => (
                        <button
                            key={key}
                            onClick={() => toggle(key)}
                            aria-pressed={!!opts[key]}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1C2128] transition-colors ${idx < arr.length - 1 ? "border-b border-[#21262D]" : ""
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#C9D1D9]">{label}</span>
                                <span className="text-[10px] text-[#484F58] font-mono">{hint}</span>
                            </div>
                            <Switch on={!!opts[key]} />
                        </button>
                    ))}
                </div>

                <button
                    onClick={regen}
                    className="w-full py-[11px] rounded-xl bg-[#8748c7] hover:bg-[#9A63E0] active:scale-[0.98] text-white text-sm font-medium transition-all duration-150"
                >
                    Generate new password
                </button>

                <p className="text-center text-[11px] text-[#484F58] mt-4 leading-relaxed">
                    Uses{" "}
                    <code className="font-mono">crypto.getRandomValues</code>
                    {" "}— never leaves your browser
                </p>

            </div>
        </div>
    );
}