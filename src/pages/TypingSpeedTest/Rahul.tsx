import { useState, useEffect, useRef } from "react";
import {Link} from "react-router-dom";  

const TEXTS = [
    "The quick brown fox jumps over the lazy dog. A pack of deft zebras jumps high. The five boxing wizards jump quickly.",
    "Success is not final, failure is not fatal. It is the courage to continue that counts. Keep going no matter what happens.",
    "The only way to do great work is to love what you do. If you have not found it yet keep looking and never settle.",
    "In the middle of every difficulty lies opportunity. You must do the thing you think you cannot do without any hesitation.",
    "It was the best of times it was the worst of times it was the age of wisdom it was the age of foolishness and doubt.",
    "A journey of a thousand miles begins with a single step. The man who moves a mountain begins by carrying away small stones.",
    "To be or not to be that is the question. Whether it is nobler in the mind to suffer or to take action against troubles.",
    "All that glitters is not gold. You have heard that told many times before. Do not judge a book by its cover ever.",
    "The secret of getting ahead is getting started. Break your big goals into small tasks and focus on doing them well each day.",
    "Technology is best when it brings people together and helps them communicate ideas clearly across the entire world every day.",
];

const TIME = 60;

function pick() { return TEXTS[Math.floor(Math.random() * TEXTS.length)]; }

export default function App() {
    const [text, setText] = useState(pick);
    const [typed, setTyped] = useState("");
    const [timeLeft, setTimeLeft] = useState(TIME);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        if (!started) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    setDone(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [started]);

    function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (done) return;
        const val = e.target.value.slice(0, text.length);
        if (!started && val.length > 0) setStarted(true);
        setTyped(val);
        if (val === text) {
            clearInterval(timerRef.current!);
            setDone(true);
        }
    }

    function restart() {
        if (timerRef.current) clearInterval(timerRef.current);
        setText(pick());
        setTyped("");
        setTimeLeft(TIME);
        setStarted(false);
        setDone(false);
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    const elapsed = Math.max(1, TIME - timeLeft);
    const correctChars = typed.split("").filter((c, i) => c === text[i]).length;
    const wpm = Math.round((correctChars / 5) / (elapsed / 60));
    const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
    const progress = (typed.length / text.length) * 100;

    return (
        <div className="min-h-screen bg-[#09051a] flex justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    to="/projects/typing-speed-test"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-4 inline-block"
                >
                    ← Back
                </Link>
                <div className="bg-[#8748c7] p-16 py-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-white font-semibold text-lg">Typing Speed Test</h1>
                        <p className="text-[#d4a8ff] text-sm">Type the text as fast and accurately as you can</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-mono text-3xl font-bold leading-none">{timeLeft}</p>
                        <p className="text-[#d4a8ff] text-xs mt-0.5">seconds</p>
                    </div>
                </div>

                <div className="bg-[#120d24] px-6 py-5 space-y-4">

                    <div className="h-1 bg-[#09051a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#8748c7] rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-8 py-4 font-mono text-sm leading-relaxed select-none">
                        {text.split("").map((char, i) => {
                            if (i < typed.length) {
                                return typed[i] === char
                                    ? <span key={i} className="text-white">{char}</span>
                                    : <span key={i} className="text-red-400 bg-red-500/20">{char}</span>;
                            }
                            if (i === typed.length) {
                                return <span key={i} className="text-[#4a3a7a] border-b-2 border-[#8748c7]">{char}</span>;
                            }
                            return <span key={i} className="text-[#4a3a7a]">{char}</span>;
                        })}
                    </div>

                    <textarea
                        ref={inputRef}
                        value={typed}
                        onChange={handleInput}
                        onKeyDown={e => e.key === "Enter" && e.preventDefault()}
                        disabled={done}
                        rows={2}
                        placeholder="Start typing here…"
                        className="w-full bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a] resize-none disabled:opacity-40"
                    />

                    {started && (
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "WPM", value: wpm },
                                { label: "Accuracy", value: `${accuracy}%` },
                                { label: "Chars", value: `${correctChars}/${typed.length}` },
                            ].map(s => (
                                <div key={s.label} className="bg-[#09051a] border border-[#8748c7]/15 rounded-xl py-3 text-center">
                                    <p className="text-white font-semibold text-lg">{s.value}</p>
                                    <p className="text-[#4a3a7a] text-xs">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {done && (
                        <div className="bg-[#8748c7]/10 border border-[#8748c7]/30 rounded-xl px-4 py-3 text-center">
                            <p className="text-white font-medium">
                                {wpm >= 70 ? "🔥 Outstanding!" : wpm >= 50 ? "👏 Great job!" : wpm >= 30 ? "💪 Good effort!" : "📝 Keep practicing!"}
                            </p>
                            <p className="text-[#8748c7] text-sm mt-0.5">{wpm} WPM · {accuracy}% accuracy</p>
                        </div>
                    )}

                    <button
                        onClick={restart}
                        className="w-full py-3 rounded-xl bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] text-white text-sm font-medium transition-all active:scale-[0.98]"
                    >
                        {done ? "Try Again" : "New Text"}
                    </button>

                </div>
            </div>
        </div>
    );
}