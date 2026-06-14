import { useState } from "react";
import { Link } from "react-router";

export default function App() {
    const [url, setUrl] = useState("");
    const [short, setShort] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    async function shorten() {
        const raw = url.trim();
        if (!raw) return;

        const full = raw.startsWith("http") ? raw : `https://${raw}`;

        setLoading(true);
        setError("");
        setShort("");

        try {
            const res = await fetch("https://spoo.me/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
                body: `url=${encodeURIComponent(full)}`,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Failed to shorten.");
            setShort(data.short_url);
        } catch (e: any) {
            setError(e.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }

    async function copy() {
        await navigator.clipboard.writeText(short);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function clear() {
        setUrl("");
        setShort("");
        setError("");
        setCopied(false);
    }

    return (
        <div className="min-h-screen bg-[#09051a] flex justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    to="/projects/url-shortener"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
                >
                    ← Back
                </Link>

                <div className="rounded-2xl overflow-hidden border border-[#8748c7]/30 shadow-2xl shadow-[#8748c7]/10 mt-12">


                    <div className="bg-[#8748c7] px-6 py-6">
                        <div className="flex items-center gap-3 mb-1">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9 11a4 4 0 005.66 0l2.5-2.5a4 4 0 00-5.66-5.66L9.9 4.34"
                                    stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M11 9a4 4 0 00-5.66 0l-2.5 2.5a4 4 0 005.66 5.66l1.53-1.53"
                                    stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                            <h1 className="text-white font-semibold text-lg tracking-tight">URL Shortener</h1>
                        </div>
                        <p className="text-[#d4a8ff] text-sm">Paste a long link, get a short one instantly</p>
                    </div>

                    <div className="bg-[#120d24] px-6 py-5 space-y-4">

                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => { setUrl(e.target.value); setError(""); setShort(""); }}
                                onKeyDown={(e) => e.key === "Enter" && shorten()}
                                placeholder="https://your-very-long-url.com/goes/here"
                                className="w-full bg-[#09051a] border border-[#8748c7]/25 rounded-xl px-4 py-3.5 pr-10 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]"
                            />
                            {url && (
                                <button
                                    onClick={clear}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a3a7a] hover:text-[#8748c7] transition-colors text-sm leading-none"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs -mt-2 pl-1">{error}</p>
                        )}

                        {short && (
                            <div className="bg-[#8748c7]/10 border border-[#8748c7]/30 rounded-xl px-4 py-3.5 flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-[#8748c7] font-medium uppercase tracking-widest mb-0.5">
                                        ✓ Short link ready
                                    </p>
                                    <a
                                        href={short}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white font-mono text-sm hover:text-[#d4a8ff] transition-colors truncate block"
                                    >
                                        {short}
                                    </a>
                                </div>
                                <button
                                    onClick={copy}
                                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${copied
                                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                                        : "border-[#8748c7]/40 text-[#8748c7] hover:bg-[#8748c7]/20"
                                        }`}
                                >
                                    {copied ? "✓ Copied" : "Copy"}
                                </button>
                            </div>
                        )}

                        <button
                            onClick={shorten}
                            disabled={loading || !url.trim()}
                            className="w-full py-3.5 rounded-xl bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-all duration-150 active:scale-[0.98]"
                        >
                            {loading ? "Shortening…" : "Shorten URL"}
                        </button>

                    </div>
                </div>

                <p className="text-center text-[11px] text-[#2a1a4a] mt-4">
                    Powered by spoo.me
                </p>

            </div>
        </div>
    );
}