import { useState } from "react";
import { Link } from "react-router";

export default function App() {
  const [text, setText] = useState("");
  const [qr,   setQr]   = useState("");

  function generate() {
    if (!text.trim()) return;
    setQr(`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(text.trim())}`);
  }

  return (
    <div className="min-h-screen bg-[#09051a] flex items-center justify-center p-6">
      <div className="flex flex-col items-start gap-3 w-full max-w-sm">
        <Link
          to="/projects/qr-code-generator"
          className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
        >
          ← Back
        </Link>


        <div className="w-full rounded-2xl overflow-hidden border border-[#8748c7]/30 shadow-xl shadow-[#8748c7]/10">

          <div className="bg-[#8748c7] px-6 py-6">
            <h1 className="text-white font-semibold text-lg">QR Code Generator</h1>
            <p className="text-[#d4a8ff] text-sm mt-0.5">URL, text, anything</p>
          </div>

          <div className="bg-[#120d24] px-6 py-5 space-y-4">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()}
              placeholder="Enter URL or text…"
              className="w-full bg-[#09051a] border border-[#8748c7]/25 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]"
            />

            {qr && (
              <div className="flex justify-center bg-white rounded-xl p-4">
                <img src={qr} alt="QR Code" width={200} height={200} />
              </div>
            )}

            <button
              onClick={generate}
              disabled={!text.trim()}
              className="w-full py-3.5 rounded-xl bg-[#8748c7] hover:bg-[#9b5ad4] active:bg-[#7338b0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-[0.98]"
            >
              Generate
            </button>

            {qr && (
              <a
                href={qr}
                download="qrcode.png"
                className="block text-center text-[#8748c7] text-sm hover:text-[#a060dc] transition-colors"
              >
                Download PNG ↓
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}