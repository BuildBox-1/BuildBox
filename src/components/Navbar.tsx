import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="border-b border-(--border)">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">

                <a href="/">
                    <div className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight text-(--text-h)">
                        <span className="w-2 h-2 rounded-full bg-(--accent)" />
                        BuildBox
                    </div>
                </a>

                <div className="hidden md:flex gap-6">
                    <a href="/" className="font-mono text-sm">Home</a>

                    <Link
                        to="/how-to-contribute"
                        className="font-mono text-sm text-(--text) hover:text-(--accent)"
                    >
                        How to contribute
                    </Link>

                    <a
                        href="https://github.com/rajbodhak/BuildBox"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm"
                    >
                        GitHub ↗
                    </a>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden flex flex-col gap-1"
                >
                    <span className="w-5 h-[2px] bg-(--text-h)" />
                    <span className="w-5 h-[2px] bg-(--text-h)" />
                    <span className="w-5 h-[2px] bg-(--text-h)" />
                </button>
            </div>

            {open && (
                <div className="mt-1 md:hidden px-4 pb-4 flex flex-col gap-5 border-t border-(--border)">
                    <a href="/" className="font-mono text-sm mt-2">Home</a>

                    <Link
                        to="/how-to-contribute"
                        className="font-mono text-sm text-(--text) hover:text-(--accent)"
                        onClick={() => setOpen(false)}
                    >
                        How to contribute
                    </Link>

                    <a
                        href="https://github.com/rajbodhak/BuildBox"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm"
                    >
                        GitHub ↗
                    </a>
                </div>
            )}
        </nav>
    );
}