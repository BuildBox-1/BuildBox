import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Link } from "react-router";

// theme
const P = "#8748c7";
const PL = "#b07ada";
const BG = "#0d0d16";
const PANEL = "#111120";
const CARD = "#16162a";
const BORD = "#24243e";
const TEXT = "#d0d0ec";
const MUTED = "#585890";
const PBGL = "#dddfe9";

// types
interface Exp { id: string; company: string; role: string; start: string; end: string; current: boolean; bullets: string; }
interface Edu { id: string; institution: string; degree: string; field: string; start: string; end: string; gpa: string; }
interface Proj { id: string; name: string; tech: string; desc: string; link: string; }
interface ResumeData {
    name: string; title: string; email: string; phone: string;
    location: string; linkedin: string; github: string; portfolio: string;
    summary: string; experience: Exp[]; education: Edu[];
    skills: string; projects: Proj[];
}

const uid = () => Math.random().toString(36).slice(2, 9);

// data seed for quick testing
const DEFAULT: ResumeData = {
    name: "Your Name", title: "Software Engineer",
    email: "you@example.com", phone: "+91 98765 43210",
    location: "Kolkata, India", linkedin: "linkedin.com/in/yourname",
    github: "github.com/yourname", portfolio: "",
    summary: "",
    experience: [{
        id: uid(), company: "Tech Startup", role: "Backend Engineer Intern",
        start: "Jun 2024", end: "Aug 2024", current: false,
        bullets: [
            "Designed distributed async task queue in Python + Redis, processing 10k+ jobs/day at sub-50ms P99 latency",
            "Reduced CI/CD pipeline duration by 62% via parallel test execution and intelligent layer caching in GitHub Actions",
            "Containerised 4-service architecture with Docker Compose, cutting local setup time from 90 min to 3 min",
        ].join("\n"),
    }],
    education: [{
        id: uid(), institution: "State University", degree: "B.Tech",
        field: "Computer Science & Engineering", start: "2021", end: "2025", gpa: "8.5 / 10",
    }],
    skills: [
        "Languages:   Python, Go, JavaScript, TypeScript, C++",
        "Frameworks:  Node.js, React, Express.js",
        "Databases:   PostgreSQL, MongoDB, Redis",
        "Tools:       Docker, Git, GitHub Actions, Linux, Prometheus, Grafana, Nginx",
    ].join("\n"),
    projects: [
        {
            id: uid(), name: "AsyncFlow",
            tech: "Python, Redis, Prometheus, Docker Compose",
            desc: [
                "Architected priority-queue engine with 3 SLA tiers, guaranteeing sub-100ms dispatch for P0 jobs across 5 worker processes",
                "Instrumented 18 Prometheus metrics (latency, queue depth, error rate) visualised via Grafana dashboards with alerting rules",
            ].join("\n"),
            link: "github.com/you/asyncflow",
        },
        {
            id: uid(), name: "CodeCollab",
            tech: "React, TypeScript, Socket.IO, Monaco Editor, Node.js",
            desc: [
                "Built real-time collaborative editor syncing cursors and code across 6 concurrent clients with <100ms round-trip via Socket.IO rooms",
                "Integrated JDoodle API for sandboxed execution in 6 languages; added ownership transfer and session persistence via Redis",
            ].join("\n"),
            link: "github.com/you/codecollab",
        },
    ],
};

//resource links
const LINKS = [
    { name: "Overleaf CV Gallery", url: "https://www.overleaf.com/gallery/tagged/cv", tag: "LaTeX" },
    { name: "Reactive Resume", url: "https://rxresu.me", tag: "Open Source" },
    { name: "FlowCV", url: "https://flowcv.com", tag: "Free" },
    { name: "Novoresume", url: "https://novoresume.com", tag: "ATS" },
    { name: "Canva Resume", url: "https://www.canva.com/resumes", tag: "Design" },
    { name: "Zety", url: "https://zety.com/resume-builder", tag: "AI" },
    { name: "Kickresume", url: "https://www.kickresume.com", tag: "Templates" },
    { name: "Resume.io", url: "https://resume.io", tag: "Simple" },
    { name: "JSON Resume", url: "https://jsonresume.org", tag: "Dev" },
    { name: "LinkedIn Builder", url: "https://www.linkedin.com/jobs", tag: "Export" },
];

// editor input base style
const iBase: React.CSSProperties = {
    width: "100%", background: BG, border: `1px solid ${BORD}`, borderRadius: 6,
    color: TEXT, padding: "7px 10px", fontSize: 12.5, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
};

function Field({
    label, value, onChange, placeholder = "", multi = false, rows = 3,
}: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; multi?: boolean; rows?: number;
}) {
    const hl = (e: React.FocusEvent<HTMLElement>) => ((e.target as HTMLElement).style.borderColor = P);
    const bl = (e: React.FocusEvent<HTMLElement>) => ((e.target as HTMLElement).style.borderColor = BORD);
    return (
        <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 4 }}>
                {label}
            </label>
            {multi
                ? <textarea value={value} rows={rows} placeholder={placeholder} onChange={e => onChange(e.target.value)}
                    style={{ ...iBase, resize: "vertical" }} onFocus={hl} onBlur={bl} />
                : <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
                    style={{ ...iBase }} onFocus={hl} onBlur={bl} />
            }
        </div>
    );
}

function Pane({ title, icon, isOpen, toggle, children }: {
    title: string; icon: string; isOpen: boolean; toggle: () => void; children: React.ReactNode;
}) {
    return (
        <div style={{ borderBottom: `1px solid ${BORD}` }}>
            <button onClick={toggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "none", border: "none", cursor: "pointer", color: isOpen ? PL : TEXT, fontWeight: 600, fontSize: 12.5, fontFamily: "inherit" }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{title}</span>
                <span style={{ fontSize: 9, color: MUTED, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
            </button>
            {isOpen && <div style={{ padding: "0 18px 16px" }}>{children}</div>}
        </div>
    );
}

function Card({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
    return (
        <div style={{ background: BG, border: `1px solid ${BORD}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10, position: "relative" }}>
            <button onClick={onRemove} style={{ position: "absolute", top: 8, right: 10, padding: "1px 7px", background: "transparent", border: "1px solid #cc3355", borderRadius: 4, color: "#cc3355", fontSize: 10, cursor: "pointer" }}>✕</button>
            {children}
        </div>
    );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
    const [h, sh] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: h ? `${P}20` : "transparent", border: `1px dashed ${P}`, borderRadius: 6, color: PL, fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginTop: 8, transition: "background .15s" }}>
            + {label}
        </button>
    );
}

const G2 = ({ children }: { children: React.ReactNode }) =>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{children}</div>;

const G3 = ({ children }: { children: React.ReactNode }) =>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>{children}</div>;

// faang resume design
function ResumeDoc({ d }: { d: ResumeData }) {
    const ff = "'Helvetica Neue', Arial, Helvetica, sans-serif";

    const Rule = () => <div style={{ borderTop: "1px solid #111", margin: "3px 0 7px" }} />;

    const SectionHead = ({ title }: { title: string }) => (
        <>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#000", fontFamily: ff, marginBottom: 1 }}>
                {title}
            </div>
            <Rule />
        </>
    );

    const contacts = [
        d.email, d.phone, d.location, d.linkedin, d.github, d.portfolio,
    ].filter(Boolean);

    // Parse categorised skills (lines like "Languages: Python, Go")
    const skillLines = d.skills.split("\n").map(s => s.trim()).filter(Boolean);
    const isCategorised = skillLines.some(l => l.includes(":"));

    return (
        <div style={{ fontFamily: ff, fontSize: 10.2, color: "#111", lineHeight: 1.5 }}>
            {/* ── header ── */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.01em", color: "#000", lineHeight: 1.1 }}>
                    {d.name || "Your Name"}
                </div>
                {d.title && (
                    <div style={{ fontSize: 10.5, color: "#444", marginTop: 2, fontWeight: 400 }}>{d.title}</div>
                )}
                {contacts.length > 0 && (
                    <div style={{ fontSize: 9.5, color: "#222", marginTop: 5, lineHeight: 1.6 }}>
                        {contacts.map((c, i) => (
                            <span key={i}>{c}{i < contacts.length - 1 && <span style={{ margin: "0 7px", color: "#8748c7" }}>|</span>}</span>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ borderTop: "1.5px solid #000", marginBottom: 10 }} />

            {/** Summary */}
            {d.summary.trim() && (
                <div style={{ marginBottom: 9 }}>
                    <SectionHead title="Summary" />
                    <p style={{ margin: 0, fontSize: 10, lineHeight: 1.6, color: "#222" }}>{d.summary}</p>
                </div>
            )}

            {/* ── education ── */}
            {d.education.some(e => e.institution) && (
                <div style={{ marginBottom: 9 }}>
                    <SectionHead title="Education" />
                    {d.education.map(e => (
                        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 10.5 }}>{e.institution}</div>
                                {(e.degree || e.field) && (
                                    <div style={{ fontSize: 10, color: "#333", fontStyle: "italic" }}>
                                        {[e.degree, e.field].filter(Boolean).join(" in ")}
                                        {e.gpa && <span style={{ fontStyle: "normal", color: "#444" }}>{" "}· GPA: {e.gpa}</span>}
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: 9.5, color: "#333", whiteSpace: "nowrap", marginLeft: 10, marginTop: 1 }}>
                                {[e.start, e.end].filter(Boolean).join(" – ")}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── experience ── */}
            {d.experience.some(e => e.company) && (
                <div style={{ marginBottom: 9 }}>
                    <SectionHead title="Experience" />
                    {d.experience.map((e, i) => (
                        <div key={e.id} style={{ marginBottom: i < d.experience.length - 1 ? 8 : 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ fontWeight: 700, fontSize: 10.5 }}>{e.company}</span>
                                <span style={{ fontSize: 9.5, color: "#333", whiteSpace: "nowrap", marginLeft: 10 }}>
                                    {[e.start, e.current ? "Present" : e.end].filter(Boolean).join(" – ")}
                                </span>
                            </div>
                            {e.role && <div style={{ fontSize: 10, fontStyle: "italic", color: "#333", marginBottom: 2 }}>{e.role}</div>}
                            {e.bullets && (
                                <ul style={{ margin: "3px 0 0 14px", padding: 0, fontSize: 10, lineHeight: 1.6, color: "#111" }}>
                                    {e.bullets.split("\n").filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 1 }}>{b}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── projects ── */}
            {d.projects.some(p => p.name) && (
                <div style={{ marginBottom: 9 }}>
                    <SectionHead title="Projects" />
                    {d.projects.map((p, i) => (
                        <div key={p.id} style={{ marginBottom: i < d.projects.length - 1 ? 7 : 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div>
                                    <span style={{ fontWeight: 700, fontSize: 10.5 }}>{p.name}</span>
                                    {p.tech && <span style={{ fontStyle: "italic", fontSize: 10, color: "#444" }}> | {p.tech}</span>}
                                </div>
                                {p.link && <span style={{ fontSize: 9.5, color: "#555", whiteSpace: "nowrap", marginLeft: 10 }}>{p.link}</span>}
                            </div>
                            {p.desc && (
                                <ul style={{ margin: "3px 0 0 14px", padding: 0, fontSize: 10, lineHeight: 1.6, color: "#111" }}>
                                    {p.desc.split("\n").filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 1 }}>{b}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── skills ── */}
            {d.skills.trim() && (
                <div>
                    <SectionHead title="Technical Skills" />
                    {isCategorised
                        ? skillLines.map((line, i) => {
                            const colon = line.indexOf(":");
                            const cat = colon > -1 ? line.slice(0, colon).trim() : "";
                            const rest = colon > -1 ? line.slice(colon + 1).trim() : line;
                            return (
                                <div key={i} style={{ fontSize: 10, lineHeight: 1.65 }}>
                                    {cat && <strong>{cat}:{" "}</strong>}{rest}
                                </div>
                            );
                        })
                        : <div style={{ fontSize: 10, lineHeight: 1.65 }}>{d.skills}</div>
                    }
                </div>
            )}
        </div>
    );
}

// app
export default function App() {
    const [data, setData] = useState<ResumeData>(DEFAULT);
    const [open, setOpen] = useState("personal");
    const [links, setLinks] = useState(false);
    const [dling, setDling] = useState(false);

    const tog = (k: string) => setOpen(o => o === k ? "" : k);
    const set = (k: keyof ResumeData, v: string) => setData(d => ({ ...d, [k]: v }));

    const upd = <T extends Exp | Edu | Proj>(list: keyof ResumeData, id: string, field: keyof T, val: unknown) =>
        setData(d => ({ ...d, [list]: (d[list] as T[]).map(e => e.id === id ? { ...e, [field]: val } : e) }));

    const add = <T,>(list: keyof ResumeData, tmpl: T) =>
        setData(d => ({ ...d, [list]: [...(d[list] as T[]), { id: uid(), ...tmpl }] }));

    const rem = (list: keyof ResumeData, id: string) =>
        setData(d => ({ ...d, [list]: (d[list] as { id: string }[]).filter(e => e.id !== id) }));

    // Real PDF export 
    const downloadPDF = async () => {
        if (dling) return;
        setDling(true);
        try {
            const el = document.getElementById("rp")!;
            const canvas = await html2canvas(el, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false,
            });
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const imgData = canvas.toDataURL("image/png");
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = pdf.internal.pageSize.getHeight();
            const imgH = (canvas.height * pdfW) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfW, imgH);

            // Multi-page support
            if (imgH > pdfH) {
                let offset = -pdfH;
                while (offset > -imgH) {
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, offset, pdfW, imgH);
                    offset -= pdfH;
                }
            }
            pdf.save(`${(data.name || "resume").replace(/\s+/g, "_")}.pdf`);
        } catch (err) {
            console.error(err);
            alert("PDF generation failed. Please try again.");
        } finally {
            setDling(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: BG, fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
            <style>{`
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#252542;border-radius:3px}
        input::placeholder,textarea::placeholder{color:#3a3a60!important}
        input,textarea{color:${TEXT}!important}
      `}</style>

            {/* ── top bar ── */}
            <Link
                to="/projects/resume-builder"
                className="font-mono text-sm text-(--text) hover:text-(--accent) transition-colors mb-4 mt-4 ml-6"
            >
                ← Back
            </Link>
            <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 46, background: PANEL, borderBottom: `1px solid ${BORD}`, flexShrink: 0, gap: 12, position: "relative", zIndex: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, background: P, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📄</div>
                    <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.3px" }}>ResuFlow</span>
                </div>
                <div style={{ width: 1, height: 18, background: BORD }} />
                <span style={{ color: MUTED, fontSize: 12 }}>{data.name || "Untitled"}.pdf</span>
                <div style={{ flex: 1 }} />

                <button onClick={() => setLinks(l => !l)}
                    style={{ padding: "5px 12px", background: CARD, border: `1px solid ${BORD}`, borderRadius: 6, color: TEXT, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                    🔗 Resources
                </button>

                <button onClick={downloadPDF} disabled={dling}
                    style={{ padding: "5px 18px", background: dling ? "#5c32a0" : P, border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 700, cursor: dling ? "not-allowed" : "pointer", fontFamily: "inherit", minWidth: 130, transition: "background .2s" }}>
                    {dling ? "⏳ Generating…" : "↓ Download PDF"}
                </button>

                {links && (
                    <>
                        <div style={{ position: "fixed", inset: 0, zIndex: 998 }} onClick={() => setLinks(false)} />
                        <div style={{ position: "absolute", top: 48, right: 14, background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, padding: "10px 8px", width: 284, zIndex: 999, boxShadow: "0 12px 48px rgba(0,0,0,.65)" }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px 10px" }}>Resume Tools & References</div>
                            {LINKS.map(l => (
                                <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 6, textDecoration: "none", color: TEXT, fontSize: 12 }}
                                    onMouseEnter={e => (e.currentTarget.style.background = `${P}22`)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                    <span style={{ flex: 1 }}>{l.name}</span>
                                    <span style={{ fontSize: 9.5, background: `${P}30`, color: PL, borderRadius: 4, padding: "1px 7px" }}>{l.tag}</span>
                                    <span style={{ color: MUTED, fontSize: 10 }}>↗</span>
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── body ── */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                {/* editor */}
                <div style={{ width: 348, overflowY: "auto", background: PANEL, borderRight: `2px solid ${P}55`, flexShrink: 0 }}>

                    <Pane title="Personal Info" icon="👤" isOpen={open === "personal"} toggle={() => tog("personal")}>
                        <Field label="Full Name" value={data.name} onChange={v => set("name", v)} placeholder="Your Name" />
                        <Field label="Job Title" value={data.title} onChange={v => set("title", v)} placeholder="Software Engineer" />
                        <G2>
                            <Field label="Email" value={data.email} onChange={v => set("email", v)} />
                            <Field label="Phone" value={data.phone} onChange={v => set("phone", v)} />
                        </G2>
                        <Field label="Location" value={data.location} onChange={v => set("location", v)} placeholder="City, Country" />
                        <Field label="LinkedIn" value={data.linkedin} onChange={v => set("linkedin", v)} />
                        <Field label="GitHub" value={data.github} onChange={v => set("github", v)} />
                        <Field label="Portfolio (optional)" value={data.portfolio} onChange={v => set("portfolio", v)} />
                    </Pane>

                    <Pane title="Summary (optional)" icon="📝" isOpen={open === "summary"} toggle={() => tog("summary")}>
                        <Field label="2–3 sentence pitch" value={data.summary} onChange={v => set("summary", v)} multi rows={4} placeholder="Leave blank to omit from resume..." />
                    </Pane>

                    <Pane title="Education" icon="🎓" isOpen={open === "education"} toggle={() => tog("education")}>
                        {data.education.map(e => (
                            <Card key={e.id} onRemove={() => rem("education", e.id)}>
                                <Field label="Institution" value={e.institution} onChange={v => upd<Edu>("education", e.id, "institution", v)} />
                                <G2>
                                    <Field label="Degree" value={e.degree} onChange={v => upd<Edu>("education", e.id, "degree", v)} placeholder="B.Tech" />
                                    <Field label="Field" value={e.field} onChange={v => upd<Edu>("education", e.id, "field", v)} placeholder="CSE" />
                                </G2>
                                <G3>
                                    <Field label="Start" value={e.start} onChange={v => upd<Edu>("education", e.id, "start", v)} placeholder="2021" />
                                    <Field label="End" value={e.end} onChange={v => upd<Edu>("education", e.id, "end", v)} placeholder="2025" />
                                    <Field label="GPA/CGPA" value={e.gpa} onChange={v => upd<Edu>("education", e.id, "gpa", v)} placeholder="8.5/10" />
                                </G3>
                            </Card>
                        ))}
                        <AddBtn onClick={() => add<Omit<Edu, "id">>("education", { institution: "", degree: "", field: "", start: "", end: "", gpa: "" })} label="Add Education" />
                    </Pane>

                    <Pane title="Work Experience" icon="💼" isOpen={open === "experience"} toggle={() => tog("experience")}>
                        {data.experience.map(e => (
                            <Card key={e.id} onRemove={() => rem("experience", e.id)}>
                                <Field label="Company" value={e.company} onChange={v => upd<Exp>("experience", e.id, "company", v)} />
                                <Field label="Role / Position" value={e.role} onChange={v => upd<Exp>("experience", e.id, "role", v)} />
                                <G2>
                                    <Field label="Start" value={e.start} onChange={v => upd<Exp>("experience", e.id, "start", v)} placeholder="Jun 2024" />
                                    <Field label="End" value={e.current ? "Present" : e.end} onChange={v => upd<Exp>("experience", e.id, "end", v)} placeholder="Aug 2024" />
                                </G2>
                                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: MUTED, marginBottom: 10, cursor: "pointer" }}>
                                    <input type="checkbox" checked={e.current} onChange={ev => upd<Exp>("experience", e.id, "current", ev.target.checked)} style={{ accentColor: P }} />
                                    Currently working here
                                </label>
                                <Field label="Achievements — one per line, start with action verb + metric" value={e.bullets}
                                    onChange={v => upd<Exp>("experience", e.id, "bullets", v)} multi rows={5}
                                    placeholder={"Designed X using Y, achieving Z% improvement in W\nBuilt X that reduced Y from A to B"} />
                            </Card>
                        ))}
                        <AddBtn onClick={() => add<Omit<Exp, "id">>("experience", { company: "", role: "", start: "", end: "", current: false, bullets: "" })} label="Add Experience" />
                    </Pane>

                    <Pane title="Projects" icon="🚀" isOpen={open === "projects"} toggle={() => tog("projects")}>
                        {data.projects.map(p => (
                            <Card key={p.id} onRemove={() => rem("projects", p.id)}>
                                <Field label="Project Name" value={p.name} onChange={v => upd<Proj>("projects", p.id, "name", v)} />
                                <Field label="Tech Stack" value={p.tech} onChange={v => upd<Proj>("projects", p.id, "tech", v)} placeholder="React, Node.js, Docker" />
                                <Field label="Bullets — one per line" value={p.desc} onChange={v => upd<Proj>("projects", p.id, "desc", v)} multi rows={4}
                                    placeholder={"Built X that does Y, achieving Z metric\nImplemented X using Y technique"} />
                                <Field label="GitHub / Live URL" value={p.link} onChange={v => upd<Proj>("projects", p.id, "link", v)} />
                            </Card>
                        ))}
                        <AddBtn onClick={() => add<Omit<Proj, "id">>("projects", { name: "", tech: "", desc: "", link: "" })} label="Add Project" />
                    </Pane>

                    <Pane title="Technical Skills" icon="⚡" isOpen={open === "skills"} toggle={() => tog("skills")}>
                        <Field label="One category per line  (Category: item1, item2)" value={data.skills} onChange={v => set("skills", v)} multi rows={6}
                            placeholder={"Languages:   Python, Go, TypeScript\nFrameworks:  React, Node.js\nDatabases:   PostgreSQL, Redis\nTools:       Docker, Git, Linux"} />
                    </Pane>

                    <div style={{ height: 48 }} />
                </div>

                {/* preview */}
                <div style={{ flex: 1, overflowY: "auto", background: PBGL, padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div id="rp" style={{ width: 740, minHeight: 1040, background: "#fff", boxShadow: "0 6px 40px rgba(0,0,0,.22)", padding: "52px 60px", boxSizing: "border-box", flexShrink: 0 }}>
                        <ResumeDoc d={data} />
                    </div>
                    <p style={{ marginTop: 14, fontSize: 11.5, color: "#7070a0", textAlign: "center" }}>
                        A4 preview · <strong style={{ color: P }}>↓ Download PDF</strong> exports a clean PDF with no browser chrome
                    </p>
                </div>

            </div>
        </div>
    );
}