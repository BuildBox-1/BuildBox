export default function Footer() {
    return (
        <footer className="flex items-center justify-between flex-wrap gap-4 px-6 py-6">
            <p className="font-mono text-xs text-(--text)">
                BuildBox — open to <span className="text-(--accent)">everyone</span>
            </p>
            <div className="flex gap-4">
                <a
                    href="https://github.com/rajbodhak/BuildBox/blob/main/README.md"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-(--text) hover:text-(--accent) transition-colors">
                    README
                </a>
                <a
                    href="#how-to-contribute"
                    className="font-mono text-[11px] text-(--text) hover:text-(--accent) transition-colors">
                    Contributing guide
                </a>
                <a
                    href="https://github.com/rajbodhak/BuildBox"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-(--text) hover:text-(--accent) transition-colors"
                >
                    GitHub
                </a>
            </div>
        </footer>
    )
}