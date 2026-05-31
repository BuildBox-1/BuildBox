import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <nav className="flex items-center justify-between px-6 py-5 border-b border-(--border)">
            <a href="/">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-(--text-h)">
                    <span className="w-2 h-2 rounded-full bg-(--accent)" />
                    BuildBox
                </div>
            </a>

            <div className="flex gap-6">

                <a href="/" className="font-mono text-sm">
                    Home
                </a>

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
        </nav>
    );
}