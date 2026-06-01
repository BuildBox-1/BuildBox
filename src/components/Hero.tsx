import { Link } from "react-router";

export default function Hero() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4 sm:px-6 pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-(--border) items-end">

            <div>
                <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-(--accent) uppercase tracking-widest mb-3 sm:mb-4">
                    <span className="block w-4 sm:w-5 h-px bg-(--accent)" />
                    Open source · Git practice
                </div>

                <h1 className="font-bold text-3xl sm:text-4xl md:text-[52px] leading-tight md:leading-[1.05] tracking-tight md:tracking-[-2px] text-(--text-h) mb-4 sm:mb-5">
                    Build things.<br />
                    <span className="text-(--accent)">Together.</span>
                </h1>

                <p className="font-mono text-xs sm:text-sm font-light leading-relaxed text-(--text) max-w-full sm:max-w-[38ch]">
                    A shared space to practice Git workflows, sharpen frontend skills,
                    and ship real mini-projects alongside other contributors.
                </p>

                <div className="mt-4">
                    <h3 className="font-mono text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center gap-2">
                        <span>To Contribute First Go Through:</span>
                        <Link
                            to="/how-to-contribute"
                            className="font-medium bg-gray-800 text-white px-4 py-2 rounded-md hover:opacity-75 transition-opacity text-center"
                        >
                            How To Contribute
                        </Link>
                    </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <a
                        href="https://github.com/rajbodhak/BuildBox"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm font-medium bg-(--accent) text-white px-5 py-2.5 rounded-md text-center hover:opacity-85 transition-opacity"
                    >
                        Start contributing
                    </a>

                    <a
                        href="#projects"
                        className="font-mono text-sm text-(--text-h) border border-(--border) px-5 py-2.5 rounded-md text-center hover:border-(--accent) hover:text-(--accent) transition-colors"
                    >
                        Browse projects
                    </a>
                </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="flex-1 bg-(--code-bg) border border-(--border) rounded-xl px-4 py-3 text-center">
                        <div className="font-bold text-2xl sm:text-3xl text-(--text-h)">30+</div>
                        <div className="font-mono text-[10px] sm:text-[11px] text-(--text) mt-1">mini projects</div>
                    </div>

                    <div className="flex-1 bg-(--code-bg) border border-(--border) rounded-xl px-4 py-3 text-center">
                        <div className="font-bold text-2xl sm:text-3xl text-(--text-h)">∞</div>
                        <div className="font-mono text-[10px] sm:text-[11px] text-(--text) mt-1">contributors</div>
                    </div>
                </div>

                <div className="bg-(--code-bg) border border-(--border) rounded-xl px-4 py-3 text-center w-full md:w-auto">
                    <div className="font-bold text-sm sm:text-lg text-(--text-h)">
                        React · JS · TS
                    </div>
                    <div className="font-mono text-[10px] sm:text-[11px] text-(--text) mt-1">
                        any stack welcome
                    </div>
                </div>
            </div>

        </section>
    );
}