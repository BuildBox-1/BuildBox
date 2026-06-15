import { useState } from "react";
import { marked } from "marked";
import { Link } from "react-router";

const styles = `
  .preview h1{font-size:1.5rem;font-weight:700;color:#fff;margin:.5rem 0}
  .preview h2{font-size:1.2rem;font-weight:600;color:#fff;margin:.5rem 0}
  .preview h3{font-size:1rem;font-weight:600;color:#e0d0f0;margin:.5rem 0}
  .preview p{color:#c4b5d4;line-height:1.7;margin:.4rem 0}
  .preview strong{color:#fff}
  .preview em{color:#b09ac0}
  .preview a{color:#8748c7;text-decoration:underline}
  .preview code{background:#1a0e30;color:#a060dc;padding:.1em .3em;border-radius:4px;font-size:.85em}
  .preview pre{background:#1a0e30;border:1px solid rgba(135,72,199,.2);border-radius:8px;padding:.75rem;overflow-x:auto;margin:.5rem 0}
  .preview pre code{background:none;padding:0;color:#c4b5d4}
  .preview ul,.preview ol{color:#c4b5d4;margin:.4rem 0 .4rem 1.25rem}
  .preview blockquote{border-left:3px solid #8748c7;padding:.4rem .75rem;color:#7a6a9a;margin:.5rem 0}
`;

export default function App() {
    const [md, setMd] = useState("# Hello\n\nWrite **markdown** here...");
    const [tab, setTab] = useState<"edit" | "preview">("edit");

    return (
        <div className="h-screen flex flex-col bg-[#09051a]">
            <style>{styles}</style>
            <Link
                to="/projects/markdown-previewer"
                className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-12 mt-6 ml-4"
            >
                ← Back
            </Link>
            {/* Header */}
            <div className="bg-[#8748c7] px-5 py-4 flex items-center justify-between flex-shrink-0">
                <h1 className="text-white font-semibold">Markdown Previewer</h1>
                <div className="flex gap-1">
                    {(["edit", "preview"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-white/20 text-white" : "text-[#d4a8ff] hover:text-white"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {tab === "edit" ? (
                <textarea
                    value={md}
                    onChange={e => setMd(e.target.value)}
                    spellCheck={false}
                    className="flex-1 bg-[#09051a] text-[#c4b5d4] text-sm font-mono p-5 resize-none focus:outline-none leading-relaxed"
                />
            ) : (
                <div
                    className="preview flex-1 overflow-auto p-5 text-sm"
                    dangerouslySetInnerHTML={{ __html: marked.parse(md) as string }}
                />
            )}
        </div>
    );
}