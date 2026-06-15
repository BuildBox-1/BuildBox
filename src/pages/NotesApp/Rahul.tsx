import { useState } from "react";
import { Link } from "react-router";

interface Note {
  id:      number;
  title:   string;
  content: string;
  date:    string;
}

function load(): Note[] {
  try { return JSON.parse(localStorage.getItem("notes") || "[]"); }
  catch { return []; }
}

function save(notes: Note[]) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export default function App() {
  const [notes,   setNotes]   = useState<Note[]>(load);
  const [title,   setTitle]   = useState("");
  const [content, setContent] = useState("");
  const [view,    setView]    = useState<"list" | "new">("list");

  function add() {
    if (!content.trim()) return;
    const updated = [
      { id: Date.now(), title: title.trim() || "Untitled", content: content.trim(), date: new Date().toLocaleDateString() },
      ...notes,
    ];
    setNotes(updated);
    save(updated);
    setTitle("");
    setContent("");
    setView("list");
  }

  function remove(id: number) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    save(updated);
  }

  return (
    <div className="min-h-screen bg-[#09051a] flex items-center justify-center p-6">
      <div className="flex flex-col items-start gap-3 w-full max-w-sm">

        <Link
          to="/projects/notes-app"
          className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
        >
          ← Back
        </Link>

        <div className="w-full rounded-2xl overflow-hidden border border-[#8748c7]/30 shadow-xl shadow-[#8748c7]/10">

          <div className="bg-[#8748c7] px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-white font-semibold text-lg">Notes</h1>
              <p className="text-[#d4a8ff] text-sm">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={() => setView(view === "new" ? "list" : "new")}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xl flex items-center justify-center transition-all active:scale-90"
            >
              {view === "new" ? "×" : "+"}
            </button>
          </div>

          <div className="bg-[#120d24]">

            {view === "new" && (
              <div className="px-5 py-4 space-y-3 border-b border-[#8748c7]/15">
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="w-full bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]"
                />
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your note…"
                  rows={4}
                  className="w-full bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a] resize-none"
                />
                <button
                  onClick={add}
                  disabled={!content.trim()}
                  className="w-full py-3 rounded-xl bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-[0.98]"
                >
                  Save Note
                </button>
              </div>
            )}

            {notes.length === 0 && view === "list" ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[#3a2a6a] text-sm">No notes yet. Hit + to add one.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#8748c7]/10 max-h-[420px] overflow-y-auto">
                {notes.map(n => (
                  <div key={n.id} className="px-5 py-4 flex items-start gap-3 hover:bg-[#1a0e30] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{n.title}</p>
                      <p className="text-[#5a4a7a] text-xs mt-0.5 line-clamp-2">{n.content}</p>
                      <p className="text-[#3a2a5a] text-[10px] mt-1">{n.date}</p>
                    </div>
                    <button
                      onClick={() => remove(n.id)}
                      className="flex-shrink-0 text-[#3a2a5a] hover:text-red-400 transition-colors text-lg leading-none mt-0.5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}