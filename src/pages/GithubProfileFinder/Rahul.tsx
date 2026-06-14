import { useState } from "react";
import { Link } from "react-router";

export default function App() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function search() {
        const u = username.trim();
        if (!u) return;
        setLoading(true);
        setError("");
        setUser(null);
        try {
            const res = await fetch(`https://api.github.com/users/${u}`);
            if (res.status === 404) throw new Error("User not found.");
            if (!res.ok) throw new Error("Something went wrong.");
            setUser(await res.json());
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#09051a] flex justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    to="/projects/github-profile-finder"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
                >
                    ← Back
                </Link>
                
                <div className="rounded-2xl overflow-hidden border border-[#8748c7]/30 shadow-xl shadow-[#8748c7]/10 mt-12">
                    <div className="bg-[#8748c7] px-6 py-6">
                        <h1 className="text-white font-semibold text-lg tracking-tight">GitHub Profile Finder</h1>
                        <p className="text-[#d4a8ff] text-sm mt-0.5">Search any GitHub username</p>
                    </div>

                    <div className="bg-[#120d24] px-6 py-5 space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && search()}
                                placeholder="e.g. torvalds"
                                className="flex-1 bg-[#09051a] border border-[#8748c7]/25 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]"
                            />
                            <button
                                onClick={search}
                                disabled={loading || !username.trim()}
                                className="px-5 py-3 rounded-xl bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-95"
                            >
                                {loading ? "…" : "Search"}
                            </button>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        
                        {user && (
                            <div className="bg-[#09051a] border border-[#8748c7]/20 rounded-xl p-4">
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        className="w-16 h-16 rounded-full border-2 border-[#8748c7]/40"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold truncate">{user.name || user.login}</p>
                                        <a
                                            href={user.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#8748c7] text-sm hover:text-[#a060dc] transition-colors"
                                        >
                                            @{user.login}
                                        </a>
                                        {user.location && (
                                            <p className="text-[#4a3a7a] text-xs mt-0.5">📍 {user.location}</p>
                                        )}
                                    </div>
                                </div>

                                {user.bio && (
                                    <p className="text-[#8b7aaa] text-sm mb-4 leading-relaxed">{user.bio}</p>
                                )}

                            
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {[
                                        { label: "Repos", value: user.public_repos },
                                        { label: "Followers", value: user.followers },
                                        { label: "Following", value: user.following },
                                    ].map(s => (
                                        <div key={s.label} className="bg-[#120d24] border border-[#8748c7]/15 rounded-lg py-2.5 text-center">
                                            <p className="text-white font-semibold text-sm">{s.value}</p>
                                            <p className="text-[#4a3a7a] text-[11px]">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href={user.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2.5 rounded-xl border border-[#8748c7]/40 text-[#8748c7] text-sm font-medium text-center hover:bg-[#8748c7]/10 transition-colors"
                                >
                                    View on GitHub ↗
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-[11px] text-[#2a1a4a] mt-4">
                    Powered by GitHub Public API
                </p>
            </div>
        </div>
    );
}