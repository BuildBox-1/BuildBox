import { useState } from 'react';
import { Link } from "react-router";


const raj = () => {

    const [username, setUsername] = useState<string>("");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    async function searchUser() {
        setLoading(true);
        const u = username.trim();
        if (!u) return;
        setLoading(false);
        setError("");
        setUser(null);

        try {
            const res = await fetch(`https://api.github.com/users/${u}`);
            if (res.status === 404) setError("User not Found!!");
            if (!res.ok) setError("Something West Wrong");
            setUser(await res.json());
        } catch (e: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col flex-1 px-6 py-10 max-w-lg mx-auto w-full">
            <Link
                to="/projects/github-profile-finder"
                className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8"
            >
                ← Back
            </Link>

            <div className="flex items-baseline justify-between mb-1">
                <h1 className="text-2xl font-bold text-(--text-h) tracking-tight">◉ GitHub Profile Finder</h1>
            </div>
            <p className="font-mono text-xs text-(--text) mb-6">Built by Raj</p>

            <div className="rounded-2xl overflow-hidden bordershadow-xl shadow-[#8748c7]/10 ">
                <div className="py-5 space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && searchUser()}
                            placeholder="e.g. torvalds"
                            className="flex-1 px-4 py-3.5 rounded-xl border border-(--border) bg-(--code-bg)text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]"
                        />
                        <button
                            onClick={searchUser}
                            disabled={loading || !username.trim()}
                            className="px-5 py-3 rounded-xl bg-(--accent) hover:bg-[#9b5ad4] active:bg-[#7338b0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-95"
                        >
                            {loading ? "…" : "Search"}
                        </button>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {user && (
                        <div className="bg-[#0a0716] border border-[#8748c7]/20 rounded-xl p-4">

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
        </div>
    )
}

export default raj