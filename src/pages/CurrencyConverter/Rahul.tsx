import { useState, useEffect } from "react";
import { Link } from "react-router";

const FALLBACK = [
    "usd", "eur", "gbp", "jpy", "aud", "cad", "chf", "cny", "inr",
    "mxn", "brl", "krw", "sgd", "hkd", "sek", "nok", "nzd", "zar",
    "try", "aed", "thb", "myr", "pln", "dkk", "php", "idr", "czk",
];

const BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";

export default function App() {
    const [amount, setAmount] = useState("1");
    const [from, setFrom] = useState("usd");
    const [to, setTo] = useState("eur");
    const [rates, setRates] = useState<Record<string, number>>({});
    const [names, setNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // currency names — once
    useEffect(() => {
        fetch(`${BASE}/currencies.json`)
            .then(r => r.json())
            .then(setNames)
            .catch(() => { });
    }, []);

    // rates — whenever base changes
    useEffect(() => {
        setLoading(true);
        setError("");
        fetch(`${BASE}/currencies/${from}.json`)
            .then(r => r.json())
            .then(data => setRates(data[from] ?? {}))
            .catch(() => setError("Failed to fetch rates. Check your connection."))
            .finally(() => setLoading(false));
    }, [from]);

    const swap = () => { setFrom(to); setTo(from); };

    const rate = rates[to] ?? null;
    const n = parseFloat(amount);
    const result = rate !== null && !isNaN(n) && n > 0 ? n * rate : null;

    const list = Object.keys(names).length > 0 ? Object.keys(names) : FALLBACK;

    const fmt = (v: number) =>
        v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });

    const Select = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <div className="relative">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-[#0f0a1e] border border-[#8748c7]/20 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#8748c7]/60 transition-colors cursor-pointer appearance-none pr-8 uppercase"
            >
                {list.map(c => (
                    <option key={c} value={c} className="bg-[#0f0a1e] normal-case">
                        {c.toUpperCase()}{names[c] ? ` — ${names[c]}` : ""}
                    </option>
                ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8748c7]/40 pointer-events-none text-xs">▾</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <Link
                    to="/projects/currency-converter"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8"
                >
                    ← Back
                </Link>
               
                <div className="text-center mb-6">
                    <p className="text-[10px] tracking-[0.22em] text-[#8748c7] uppercase font-medium mb-1">
                        Live Rates · Auto-convert
                    </p>
                    <h1 className="text-[22px] font-semibold text-white tracking-tight">
                        Currency Converter
                    </h1>
                </div>

                <div className="bg-[#161028] border border-[#8748c7]/30 rounded-2xl">

                    <div className="px-5 pt-5 pb-4">
                        <label className="text-[11px] text-[#8748c7] font-medium uppercase tracking-widest">
                            Amount
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0"
                            className="w-full mt-2 bg-[#0f0a1e] border border-[#8748c7]/20 rounded-xl px-4 py-3 text-white text-2xl font-light focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]"
                        />
                    </div>

                    <div className="h-px bg-[#8748c7]/10 mx-5" />

                    <div className="px-5 py-4 space-y-2">
                        <div>
                            <label className="text-[11px] text-[#8748c7] font-medium uppercase tracking-widest">From</label>
                            <div className="mt-2">
                                <Select value={from} onChange={setFrom} />
                            </div>
                        </div>

                        <div className="flex justify-center py-1">
                            <button
                                onClick={swap}
                                className="w-8 h-8 rounded-full bg-[#8748c7]/15 hover:bg-[#8748c7]/30 border border-[#8748c7]/30 text-[#8748c7] flex items-center justify-center transition-all active:scale-90"
                            >
                                ⇅
                            </button>
                        </div>

                        <div>
                            <label className="text-[11px] text-[#8748c7] font-medium uppercase tracking-widest">To</label>
                            <div className="mt-2">
                                <Select value={to} onChange={setTo} />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-[#8748c7]/10 mx-5" />
                    <div className="px-5 py-4 min-h-[80px] flex items-center">
                        {loading ? (
                            <p className="text-[#4a3a7a] text-sm">Fetching rates…</p>
                        ) : error ? (
                            <p className="text-red-400 text-sm">{error}</p>
                        ) : result !== null ? (
                            <div>
                                <p className="text-[#6040a0] text-sm mb-1">
                                    {amount} {from.toUpperCase()} =
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-white text-3xl font-light">{fmt(result)}</span>
                                    <span className="text-[#8748c7] text-xl font-medium">{to.toUpperCase()}</span>
                                </div>
                                {rate && (
                                    <p className="text-[#3a2a6a] text-[11px] mt-1.5 font-mono">
                                        1 {from.toUpperCase()} = {rate.toFixed(6)} {to.toUpperCase()}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-[#3a2a6a] text-sm">Enter an amount above</p>
                        )}
                    </div>

                </div>

                <p className="text-center text-[11px] text-[#2a1a4a] mt-4">
                    Rates via jsDelivr CDN · Updated daily
                </p>

            </div>
        </div>
    );
}