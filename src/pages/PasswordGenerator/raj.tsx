import { useState } from 'react';
import { Link } from 'react-router';

const raj = () => {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
    });
    const [copied, setCopied] = useState(false);

    const toggle = (key: keyof typeof options) =>
        setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

    const copy = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const optionList: { key: keyof typeof options; label: string }[] = [
        { key: 'uppercase', label: 'Uppercase (A–Z)' },
        { key: 'lowercase', label: 'Lowercase (a–z)' },
        { key: 'numbers', label: 'Numbers (0–9)' },
        { key: 'symbols', label: 'Symbols (!@#$)' },
    ];

    const strength = (() => {
        if (!password) return null;
        const active = Object.values(options).filter(Boolean).length;
        if (length >= 20 && active >= 3) return { label: 'Strong', color: 'text-emerald-400' };
        if (length >= 12 && active >= 2) return { label: 'Medium', color: 'text-yellow-400' };
        return { label: 'Weak', color: 'text-red-400' };
    })();

    const generatePassword = () => {
        const lowercaseChars = 'abcdefghijklmnpqrstvwxyz';
        const uppercaseChars = 'ABCDEFGHJKMNPQRSTVWXYZ';
        const digitChars = '123456789';
        const symbolChars = '!@#$%^*()-_=+[]{}|;:/?';

        // Build charset from active options
        let charset = '';
        if (options.lowercase) charset += lowercaseChars;
        if (options.uppercase) charset += uppercaseChars;
        if (options.numbers) charset += digitChars;
        if (options.symbols) charset += symbolChars;

        // if nothing selected
        if (!charset) return;

        // Pick `length` random chars
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        const generatedPass = Array.from(array)
            .map((n) => charset[n % charset.length])
            .join('');

        setPassword(generatedPass);
    };

    return (
        <div className="flex flex-col flex-1 px-6 py-10 max-w-lg mx-auto w-full">
            <Link
                to="/projects/password-generator"
                className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8"
            >
                ← Back
            </Link>

            <div className="flex items-baseline justify-between mb-1">
                <h1 className="text-2xl font-bold text-(--text-h) tracking-tight">⌘ Password Generator</h1>
            </div>
            <p className="font-mono text-xs text-(--text) mb-8">Built by Raj</p>

            {/* Output */}
            <div className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl border border-(--border) bg-(--code-bg) mb-6 min-h-13">
                <span className="flex-1 font-mono text-sm text-(--text-h) break-all select-all">
                    {password || <span className="text-(--text) opacity-50">Click generate…</span>}
                </span>
                <button
                    onClick={copy}
                    disabled={!password}
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors shrink-0 disabled:opacity-30 w-12 text-right"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            {/* Length */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-(--text)">Length</span>
                    <span className="font-mono text-xs text-(--text-h)">{length}</span>
                </div>
                <input
                    type="range"
                    min={6}
                    max={64}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-(--accent) cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                    <span className="font-mono text-[10px] text-(--text) opacity-50">6</span>
                    <span className="font-mono text-[10px] text-(--text) opacity-50">64</span>
                </div>
            </div>

            {/* Options */}
            <ul className="flex flex-col gap-2 mb-6">
                {optionList.map(({ key, label }) => (
                    <li
                        key={key}
                        onClick={() => toggle(key)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl border border-(--border) bg-(--code-bg) cursor-pointer select-none hover:border-(--accent) transition-colors"
                    >
                        <span className="font-mono text-sm text-(--text-h)">{label}</span>
                        <div className={`w-8 h-4 rounded-full transition-colors relative ${options[key] ? 'bg-(--accent)' : 'bg-(--border)'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${options[key] ? 'left-4' : 'left-0.5'}`} />
                        </div>
                    </li>
                ))}
            </ul>

            {/* Strength + Generate */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => generatePassword()}
                    className="flex-1 font-mono text-sm bg-(--accent) text-white px-4 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
                >
                    Generate
                </button>
                {strength && (
                    <span className={`font-mono text-xs ${strength.color} shrink-0`}>
                        {strength.label}
                    </span>
                )}
            </div>
        </div>
    );
};

export default raj;