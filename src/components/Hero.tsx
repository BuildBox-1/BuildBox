export default function Hero() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pt-16 pb-12 border-b border-(--border) items-end">

            {/* Left */}
            <div>
                <div className="flex items-center gap-2 font-mono text-xs text-(--accent) uppercase tracking-widest mb-4">
                    <span className="block w-5 h-px bg-(--accent)" />
                    Open source · Git practice
                </div>

                <h1 className="font-bold text-5xl md:text-[52px] leading-[1.05] tracking-[-2px] text-(--text-h) mb-5">
                    Build things.<br />
                    <span className="text-(--accent)">Together.</span>
                </h1>

                <p className="font-mono text-sm font-light leading-relaxed text-(--text) max-w-[38ch]">
                    A shared space to practice Git workflows, sharpen frontend skills,
                    and ship real mini-projects alongside other contributors.
                </p>

                <div className="flex gap-3 mt-6 flex-wrap">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm font-medium bg-(--accent) text-white px-5 py-2.5 rounded-md hover:opacity-85 transition-opacity"
                    >
                        Start contributing
                    </a>
                    <a
                        href="#projects"
                        className="font-mono text-sm text-(--text-h) border border-(--border) px-5 py-2.5 rounded-md hover:border-(--accent) hover:text-(--accent) transition-colors"
                    >
                        Browse projects
                    </a>
                </div>
            </div>

            {/* Right — stat cards */}
            <div className="flex flex-col gap-3 md:items-end">
                <div className="flex gap-3">
                    <div className="bg-(--code-bg) border border-(--border) rounded-xl px-5 py-4 text-center min-w-[100px]">
                        <div className="font-bold text-3xl tracking-[-1px] text-(--text-h) leading-none">30+</div>
                        <div className="font-mono text-[11px] text-(--text) mt-1">mini projects</div>
                    </div>
                    <div className="bg-(--code-bg) border border-(--border) rounded-xl px-5 py-4 text-center min-w-[100px]">
                        <div className="font-bold text-3xl tracking-[-1px] text-(--text-h) leading-none">∞</div>
                        <div className="font-mono text-[11px] text-(--text) mt-1">contributors</div>
                    </div>
                </div>
                <div className="bg-(--code-bg) border border-(--border) rounded-xl px-5 py-4 text-center w-full md:w-auto">
                    <div className="font-bold text-lg tracking-[-0.5px] text-(--text-h) leading-none">React · JS · TS</div>
                    <div className="font-mono text-[11px] text-(--text) mt-1">any stack welcome</div>
                </div>
            </div>

        </section>
    )
}