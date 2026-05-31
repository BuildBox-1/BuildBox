export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-5 border-b border-(--border)">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-(--text-h)">
                <span className="w-2 h-2 rounded-full bg-(--accent)" />
                BuildBox
            </div>

            <div className="flex gap-6">
                <a href="#projects" className="font-mono text-sm text-(--text) hover:text-(--accent) transition-colors">
                    Projects
                </a>
                <a href="#contribute" className="font-mono text-sm text-(--text) hover:text-(--accent) transition-colors hidden sm:block">
                    How to contribute
                </a>
                <a
                    href="https://github.com/rajbodhak/BuildBox"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm text-(--text) hover:text-(--accent) transition-colors"
                >
                    GitHub ↗
                </a>
            </div>
        </nav>
    )
}