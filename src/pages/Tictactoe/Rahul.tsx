import { useState, useEffect } from "react";
import { Link } from "react-router";

const WINS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function getWinner(board: (string | null)[]) {
    for (const [a, b, c] of WINS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c])
            return { winner: board[a], line: [a, b, c] };
    }
    if (board.every(Boolean)) return { winner: "draw", line: [] };
    return null;
}

function minimax(board: (string | null)[], isMax: boolean): number {
    const r = getWinner(board);
    if (r) return r.winner === "O" ? 10 : r.winner === "X" ? -10 : 0;
    let best = isMax ? -Infinity : Infinity;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = isMax ? "O" : "X";
            const score = minimax(board, !isMax);
            board[i] = null;
            best = isMax ? Math.max(best, score) : Math.min(best, score);
        }
    }
    return best;
}

function bestMove(board: (string | null)[]) {
    let best = -Infinity, move = -1;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = "O";
            const score = minimax(board, false);
            board[i] = null;
            if (score > best) { best = score; move = i; }
        }
    }
    return move;
}

export default function App() {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(true);

    const result = getWinner(board);
    const winLine = result?.line ?? [];

    useEffect(() => {
        if (!playerTurn && !result) {
            const t = setTimeout(() => {
                const b = [...board];
                b[bestMove(b)] = "O";
                setBoard(b);
                setPlayerTurn(true);
            }, 350);
            return () => clearTimeout(t);
        }
    }, [playerTurn, board]);

    function click(i: number) {
        if (!playerTurn || board[i] || result) return;
        const b = [...board];
        b[i] = "X";
        setBoard(b);
        setPlayerTurn(false);
    }

    function reset() {
        setBoard(Array(9).fill(null));
        setPlayerTurn(true);
    }

    const status = result
        ? result.winner === "draw" ? "Draw!" : result.winner === "X" ? "You win! 🎉" : "AI wins!"
        : playerTurn ? "Your turn" : "AI thinking...";

    return (
        <div style={{
            minHeight: "100vh", background: "#39185a",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            fontFamily: "system-ui, sans-serif", gap: 24,
        }}>
            <Link
                to="/projects/tic-tac-toe"
                className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-12 mt-4 ml-4"
            >
                ← Back
            </Link>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: 1 }}>
                Tic Tac Toe
            </h1>

            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, margin: 0 }}>{status}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 96px)", gap: 8 }}>
                {board.map((cell, i) => (
                    <button key={i} onClick={() => click(i)} style={{
                        width: 96, height: 96, borderRadius: 12, border: "none",
                        background: winLine.includes(i) ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
                        fontSize: 36, fontWeight: 700, cursor: !cell && playerTurn && !result ? "pointer" : "default",
                        color: cell === "X" ? "#fff" : "#ffd966",
                        transition: "background 0.15s",
                    }}>
                        {cell}
                    </button>
                ))}
            </div>

            {result && (
                <button onClick={reset} style={{
                    padding: "10px 28px", borderRadius: 8, border: "none",
                    background: "#fff", color: "#8748c7", fontWeight: 700,
                    fontSize: 14, cursor: "pointer",
                }}>
                    Play Again
                </button>
            )}
        </div>
    );
}