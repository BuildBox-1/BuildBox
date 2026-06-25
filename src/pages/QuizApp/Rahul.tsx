import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const P = "#8748c7";

const ALL = [
    { q: "What does HTTP stand for?", o: ["HyperText Transfer Protocol", "High Transfer Text Process", "Hyper Terminal Transfer Protocol", "HyperText Transmission Process"], a: 0 },
    { q: "Default port for HTTPS?", o: ["80", "8080", "443", "3000"], a: 2 },
    { q: "Which HTTP method fetches data?", o: ["POST", "PATCH", "DELETE", "GET"], a: 3 },
    { q: "What does DNS stand for?", o: ["Data Network System", "Domain Name System", "Digital Node Service", "Dynamic Name Server"], a: 1 },
    { q: "Which status code means 'Not Found'?", o: ["200", "301", "404", "500"], a: 2 },
    { q: "Which protocol sends emails?", o: ["FTP", "HTTP", "SMTP", "SSH"], a: 2 },
    { q: "Which HTTP status means 'Unauthorized'?", o: ["400", "401", "403", "429"], a: 1 },
    { q: "Which HTTP status means 'Forbidden'?", o: ["400", "401", "403", "429"], a: 2 },
    { q: "What does REST stand for?", o: ["Remote Execution State Transfer", "Representational State Transfer", "Remote State Transfer", "Representational System Transfer"], a: 1 },
    { q: "What does an HTTP 301 indicate?", o: ["OK", "Permanent Redirect", "Bad Request", "Unauthorized"], a: 1 },
    { q: "What does SSL/TLS provide?", o: ["Faster speeds", "Encryption and authentication", "Compression", "Caching"], a: 1 },
    { q: "What is a reverse proxy?", o: ["Encrypts data at rest", "Forwards client requests to backend servers", "Manages DB connections", "Serves static files"], a: 1 },
    { q: "Which data structure uses LIFO?", o: ["Queue", "Stack", "Linked List", "Tree"], a: 1 },
    { q: "Time complexity of binary search?", o: ["O(n)", "O(n²)", "O(log n)", "O(1)"], a: 2 },
    { q: "Which traversal visits root first?", o: ["Inorder", "Postorder", "Preorder", "Level-order"], a: 2 },
    { q: "Best case time complexity of QuickSort?", o: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], a: 1 },
    { q: "Which data structure is used for BFS?", o: ["Stack", "Heap", "Queue", "Graph"], a: 2 },
    { q: "Space complexity of merge sort?", o: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], a: 2 },
    { q: "Average time of hash map lookup?", o: ["O(n)", "O(log n)", "O(1)", "O(n²)"], a: 2 },
    { q: "Which is NOT a self-balancing BST?", o: ["AVL Tree", "Red-Black Tree", "B-Tree", "Binary Heap"], a: 3 },
    { q: "Worst case of bubble sort?", o: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], a: 2 },
    { q: "Which data structure uses FIFO?", o: ["Stack", "Queue", "Tree", "Heap"], a: 1 },
    { q: "What is a min-heap?", o: ["Root is largest", "Root is smallest", "A sorted array", "A balanced BST"], a: 1 },
    { q: "Which sorting is divide and conquer?", o: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], a: 2 },
    { q: "What is memoization?", o: ["A sorting technique", "Caching results of function calls", "A graph algorithm", "A type of recursion"], a: 1 },
    { q: "What is a trie used for?", o: ["Sorting numbers", "Storing and searching strings/prefixes", "Balancing trees", "Graph traversal"], a: 1 },
    { q: "Which language runs natively in the browser?", o: ["Python", "Java", "JavaScript", "TypeScript"], a: 2 },
    { q: "What does 'typeof null' return?", o: ["'null'", "'undefined'", "'object'", "'boolean'"], a: 2 },
    { q: "Which keyword declares a block-scoped variable?", o: ["var", "let", "const", "function"], a: 1 },
    { q: "What does '===' check?", o: ["Value only", "Type only", "Value and type", "Reference"], a: 2 },
    { q: "Which method removes the last array element?", o: ["shift()", "pop()", "splice()", "slice()"], a: 1 },
    { q: "What does Promise.all() do?", o: ["Runs sequentially", "Resolves when first resolves", "Resolves when all resolve", "Cancels all"], a: 2 },
    { q: "What is a closure?", o: ["A loop construct", "A function with access to its outer scope", "A class method", "An async pattern"], a: 1 },
    { q: "Which React hook manages side effects?", o: ["useState", "useRef", "useEffect", "useContext"], a: 2 },
    { q: "What does async/await do?", o: ["Speeds up code", "Makes async code look synchronous", "Runs in parallel", "Creates threads"], a: 1 },
    { q: "What is the spread operator '...' used for?", o: ["Declaring variables", "Expanding iterables", "Creating loops", "Defining functions"], a: 1 },
    { q: "Which method adds an element to the start of an array?", o: ["push()", "pop()", "unshift()", "shift()"], a: 2 },
    { q: "What is event bubbling?", o: ["Event fires only on target", "Events propagate child to parent", "Events fire top-down", "A memory leak"], a: 1 },
    { q: "Which command initialises a Git repo?", o: ["git start", "git init", "git new", "git create"], a: 1 },
    { q: "What does 'git stash' do?", o: ["Deletes changes", "Saves changes temporarily", "Pushes to remote", "Merges branches"], a: 1 },
    { q: "What is a Docker image?", o: ["A running container", "A read-only template to create containers", "A VM snapshot", "A config file"], a: 1 },
    { q: "Which file defines Docker Compose services?", o: ["Dockerfile", "docker.json", "docker-compose.yml", "compose.config"], a: 2 },
    { q: "What does CI/CD stand for?", o: ["Continuous Integration/Continuous Deployment", "Code Integration/Code Deployment", "Continuous Iteration/Continuous Delivery", "Compile Integration/Compile Deployment"], a: 0 },
    { q: "Which Git command undoes last commit but keeps changes staged?", o: ["git revert HEAD", "git reset --hard HEAD~1", "git reset --soft HEAD~1", "git checkout HEAD~1"], a: 2 },
    { q: "What does 'git rebase' do?", o: ["Creates a merge commit", "Moves commits to a new base", "Deletes a branch", "Creates a remote branch"], a: 1 },
    { q: "What is .gitignore for?", o: ["List files to delete", "Tell Git which files not to track", "List remote repos", "Store commit messages"], a: 1 },
    { q: "Which command shows Git commit history?", o: ["git history", "git log", "git show", "git status"], a: 1 },
    { q: "Which command builds a Docker image?", o: ["docker run", "docker build", "docker pull", "docker create"], a: 1 },
    { q: "What does SQL stand for?", o: ["Structured Query Language", "Simple Query Logic", "System Query Library", "Structured Quick Language"], a: 0 },
    { q: "Which SQL clause filters grouped results?", o: ["WHERE", "ORDER BY", "HAVING", "GROUP BY"], a: 2 },
    { q: "What is a database index?", o: ["A backup", "A structure to speed up queries", "A primary key constraint", "A type of join"], a: 1 },
    { q: "Which is a NoSQL database?", o: ["PostgreSQL", "MySQL", "SQLite", "MongoDB"], a: 3 },
    { q: "What does ACID stand for?", o: ["Atomicity, Consistency, Isolation, Durability", "Async, Concurrent, Indexed, Distributed", "Atomicity, Concurrency, Integrity, Durability", "Async, Consistency, Isolation, Data"], a: 0 },
    { q: "What is a foreign key?", o: ["References another table's primary key", "The first column", "An encrypted key", "A unique index"], a: 0 },
    { q: "What does JOIN do in SQL?", o: ["Splits a table", "Combines rows from multiple tables", "Deletes duplicates", "Creates an index"], a: 1 },
    { q: "What is Redis commonly used for?", o: ["Full-text search", "Caching and session storage", "File storage", "Log aggregation"], a: 1 },
    { q: "Which Linux command lists directory files?", o: ["dir", "ls", "list", "show"], a: 1 },
    { q: "What does 'chmod 755' do?", o: ["Deletes a file", "Sets rwx for owner, rx for others", "Encrypts a file", "Changes ownership"], a: 1 },
    { q: "Which signal forcefully kills a process?", o: ["SIGTERM", "SIGHUP", "SIGKILL", "SIGINT"], a: 2 },
    { q: "What does 'grep' do?", o: ["Copies files", "Searches text using patterns", "Manages processes", "Monitors network"], a: 1 },
    { q: "Which command shows real-time processes?", o: ["ps", "ls -la", "top", "df"], a: 2 },
    { q: "What does pipe (|) do in Linux?", o: ["Deletes files", "Sends output of one command as input to another", "Creates a process", "Copies files"], a: 1 },
    { q: "What does 'sudo' do?", o: ["Runs as different user", "Runs with superuser privileges", "Switches directory", "Starts a daemon"], a: 1 },
    { q: "What is a cron job?", o: ["A type of process", "A scheduled recurring task", "A shell script", "A system daemon"], a: 1 },
    { q: "What does 'curl' do?", o: ["Compresses files", "Transfers data via URLs", "Lists processes", "Monitors memory"], a: 1 },
    { q: "What is a load balancer?", o: ["A database backup tool", "Distributes traffic across multiple servers", "A caching layer", "A DNS resolver"], a: 1 },
    { q: "What does CDN stand for?", o: ["Content Delivery Network", "Central Data Node", "Cached DNS Network", "Content Deployment Node"], a: 0 },
    { q: "What is horizontal scaling?", o: ["Upgrading CPU/RAM", "Adding more servers", "Partitioning a database", "Compressing data"], a: 1 },
    { q: "What is the CAP theorem about?", o: ["CPU, API, Processing", "Consistency, Availability, Partition tolerance", "Caching, Async, Persistence", "Compute, Access, Performance"], a: 1 },
    { q: "What is a message queue used for?", o: ["Storing SQL records", "Decoupling services via async communication", "HTTP load balancing", "Caching DB queries"], a: 1 },
    { q: "What is sharding?", o: ["Encrypting data", "Horizontally partitioning data across multiple DBs", "Creating backups", "Indexing all columns"], a: 1 },
    { q: "What is an API gateway?", o: ["A DNS server", "Entry point that routes and manages API requests", "A database proxy", "A CDN node"], a: 1 },
    { q: "What does microservices mean?", o: ["One large monolithic app", "App split into small independent services", "A frontend pattern", "A database design"], a: 1 },
    { q: "What is database normalization?", o: ["Speeding up queries", "Organizing data to reduce redundancy", "Encrypting data", "Backing up data"], a: 1 },
    { q: "What is an ORM?", o: ["A database type", "Maps objects to database tables", "A query optimizer", "A backup tool"], a: 1 },
    { q: "What does 'git cherry-pick' do?", o: ["Deletes commits", "Applies a specific commit to current branch", "Merges all branches", "Rebases onto main"], a: 1 },
    { q: "Which command shows disk usage?", o: ["du", "ls", "pwd", "whoami"], a: 0 },
    { q: "What does 'use strict' do in JS?", o: ["Speeds up execution", "Enables strict mode with extra error checking", "Disables async", "Locks variables"], a: 1 },
    { q: "What is Docker Compose used for?", o: ["Building images", "Running multi-container apps", "Pushing images", "Monitoring containers"], a: 1 },
    { q: "What is event delegation in JS?", o: ["Removing event listeners", "Handling events on a parent instead of each child", "Blocking events", "Creating custom events"], a: 1 },
    { q: "What does 'npm install' do?", o: ["Runs the app", "Installs dependencies from package.json", "Builds the project", "Publishes the package"], a: 1 },
];

const TOTAL = 10;
const getRandom = () => [...ALL].sort(() => Math.random() - 0.5).slice(0, TOTAL);

export default function App() {
    const [questions, setQuestions] = useState(getRandom);
    const [idx, setIdx] = useState(0);
    const [selected, setSel] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const q = questions[idx];

    const choose = (i: number) => {
        if (selected !== null) return;
        setSel(i);
        if (i === q.a) setScore(s => s + 1);
    };

    const next = () => {
        if (idx + 1 >= TOTAL) { setDone(true); return; }
        setIdx(i => i + 1); setSel(null);
    };

    const restart = () => {
        setQuestions(getRandom()); setIdx(0); setSel(null); setScore(0); setDone(false);
    };

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            const n = Number(e.key);
            if (n >= 1 && n <= 4 && !done && selected === null) choose(n - 1);
            if (e.key === "Enter" && selected !== null && !done) next();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [selected, idx, done]);

    const pct = Math.round((score / TOTAL) * 100);

    if (done) return (
        <div style={wrap}>
            <div style={card}>
                <div style={{ fontSize: 48, textAlign: "center", marginBottom: 8 }}>
                    {pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}
                </div>
                <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Quiz Complete</h2>
                <p style={{ textAlign: "center", color: "#6060a0", fontSize: 14, margin: "0 0 28px" }}>
                    You scored <strong style={{ color: "#a56fd4" }}>{score} / {TOTAL}</strong> ({pct}%)
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
                    {[["Correct", score, "#22c55e", "rgba(34,197,94,0.08)", "rgba(34,197,94,0.2)"],
                    ["Wrong", TOTAL - score, "#ef4444", "rgba(239,68,68,0.08)", "rgba(239,68,68,0.2)"]].map(([l, v, c, bg, bd]) => (
                        <div key={l as string} style={{ background: bg as string, border: `1px solid ${bd}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                            <div style={{ fontSize: 26, fontWeight: 700, color: c as string }}>{v as number}</div>
                            <div style={{ fontSize: 13, color: "#5050a0", marginTop: 2 }}>{l as string}</div>
                        </div>
                    ))}
                </div>
                <button onClick={restart} style={btn}>Restart Quiz</button>
                <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#2e2e50" }}>{TOTAL} random from {ALL.length}</p>
            </div>
        </div>
    );

    return (
        <div style={wrap}>
            <div style={card}>
                <Link
                    to="/projects/quiz-app"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-12 mt-4 ml-4"
                >
                    ← Back
                </Link>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontSize: 13, color: "#5050a0" }}>Question {idx + 1} / {TOTAL}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#a56fd4" }}>Score: {score}</span>
                </div>

                <div style={{ height: 4, background: "#1e1e38", borderRadius: 4, marginBottom: 24 }}>
                    <div style={{ height: "100%", width: `${((idx + (selected !== null ? 1 : 0)) / TOTAL) * 100}%`, background: P, borderRadius: 4, transition: "width .3s" }} />
                </div>

                <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5, color: "#e8e8f8", margin: "0 0 24px" }}>{q.q}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {q.o.map((opt, i) => {
                        const isAns = i === q.a, isSel = i === selected;
                        let bg = "#1c1c34", border = "1px solid #2a2a48", color = "#a0a0c8";
                        if (selected !== null) {
                            if (isAns) { bg = "rgba(34,197,94,0.1)"; border = "1px solid #22c55e"; color = "#86efac"; }
                            else if (isSel) { bg = "rgba(239,68,68,0.1)"; border = "1px solid #ef4444"; color = "#fca5a5"; }
                            else { bg = "#14142a"; border = "1px solid #1e1e32"; color = "#2e2e50"; }
                        }
                        return (
                            <button key={i} onClick={() => choose(i)}
                                style={{ padding: "12px 16px", background: bg, border, borderRadius: 10, fontSize: 14, color, textAlign: "left", cursor: selected !== null ? "default" : "pointer", transition: "all .15s", fontFamily: "inherit" }}>
                                <span style={{ fontWeight: 600, marginRight: 10, color: selected !== null ? "inherit" : "#a56fd4" }}>
                                    {String.fromCharCode(65 + i)}.
                                </span>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {selected !== null && (
                    <button onClick={next} style={btn}>
                        {idx + 1 >= TOTAL ? "See Results" : "Next →"}
                    </button>
                )}
            </div>
        </div>
    );
}

const wrap: React.CSSProperties = {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a14 0%, #16082a 100%)", fontFamily: "'Inter', system-ui, sans-serif", padding: 20,
};
const card: React.CSSProperties = {
    background: "#13132a", border: "1px solid rgba(135,72,199,0.18)", borderRadius: 16, padding: 32, width: "100%", maxWidth: 480,
    boxShadow: "0 0 60px rgba(135,72,199,0.08), 0 20px 40px rgba(0,0,0,0.4)",
};
const btn: React.CSSProperties = {
    width: "100%", padding: "13px", background: P, color: "#fff", border: "none",
    borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
};