import { useState } from "react";
import { Link } from "react-router";

function hexToHsl(hex: string): [number, number, number] {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return "#" + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
}

function isLight(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function hexToRgb(hex: string) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}

function generate(hex: string) {
    const [h, s, l] = hexToHsl(hex);
    const { r, g, b } = hexToRgb(hex);

    return {
        "Shades": [95, 85, 72, 58, 45, 32, 20, 12].map(li => hslToHex(h, s, li)),
        "Monochromatic": [10, 30, 50, 70, 90].map(si => hslToHex(h, si, l)),
        "Complementary": [hex, hslToHex((h + 180) % 360, s, l)],
        "Analogous": [
            hslToHex((h - 45 + 360) % 360, s, l),
            hslToHex((h - 20 + 360) % 360, s, l),
            hex,
            hslToHex((h + 20) % 360, s, l),
            hslToHex((h + 45) % 360, s, l),
        ],
        "Triadic": [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
        "Tetradic": [hex, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)],
        "Split Comp": [hex, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)],
        "Double Split": [
            hslToHex((h - 30 + 360) % 360, s, l),
            hex,
            hslToHex((h + 30) % 360, s, l),
            hslToHex((h + 150) % 360, s, l),
            hslToHex((h + 210) % 360, s, l),
        ],
        "Pastel": [95, 87, 80, 73, 66].map(li => hslToHex(h, Math.min(s, 40), li)),
        "Muted": [15, 30, 45, 60, 75].map(li => hslToHex(h, Math.round(s * 0.35), li)),
        "Warm Shift": [-30, -15, 0, 15, 30].map(d => hslToHex(Math.max(0, Math.min(60, h + d)), s, l)),
    };
}

export default function App() {
    const [color, setColor] = useState("#8748c7");
    const [copied, setCopied] = useState<string | null>(null);
    const [hexInput, setHexInput] = useState("#8748c7");

    const palettes = generate(color);

    function copy(hex: string) {
        navigator.clipboard.writeText(hex);
        setCopied(hex);
        setTimeout(() => setCopied(null), 1200);
    }

    function handleHexInput(val: string) {
        setHexInput(val);
        if (/^#[0-9a-fA-F]{6}$/.test(val)) setColor(val);
    }

    const card = "rgba(255,255,255,0.07)";
    const border = "rgba(255,255,255,0.1)";

    return (
        <div style={{
            minHeight: "100vh",
            background: "#4f4241b9",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "40px 20px",
            boxSizing: "border-box",
        }}>
            <div style={{ maxWidth: 620, margin: "0 auto" }}>
                <Link
                    to="/projects/color-palette-generator"
                    className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-6 inline-block"
                >
                    ← Back
                </Link>

                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#decccc", margin: "0 0 4px" }}>
                    Color Palette Gen
                </h1>
                <p style={{ fontSize: 14, color: "#9e8f8f", margin: "0 0 24px" }}>
                    Pick a color · click any swatch to copy hex
                </p>

                {/* Picker */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: card, border: `1px solid ${border}`,
                    borderRadius: 12, padding: "14px 18px", marginBottom: 32,
                }}>
                    <input
                        type="color"
                        value={color}
                        onChange={e => { setColor(e.target.value); setHexInput(e.target.value); }}
                        style={{
                            width: 52, height: 52, border: "none",
                            borderRadius: 8, cursor: "pointer",
                            padding: 0, background: "none", flexShrink: 0,
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <input
                            value={hexInput}
                            onChange={e => handleHexInput(e.target.value)}
                            maxLength={7}
                            style={{
                                fontSize: 18, fontWeight: 700, color: "#decccc",
                                background: "transparent", border: "none", outline: "none",
                                letterSpacing: 1, width: "100%", fontFamily: "monospace",
                            }}
                        />
                        <div style={{ fontSize: 13, color: "#9e8f8f", marginTop: 2 }}>base color</div>
                    </div>
                    <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        background: color,
                        border: `1px solid ${border}`,
                        flexShrink: 0,
                    }} />
                </div>

                {/* Palettes */}
                {Object.entries(palettes).map(([label, colors]) => (
                    <div key={label} style={{ marginBottom: 20 }}>
                        <div style={{
                            fontSize: 11, fontWeight: 600, letterSpacing: 1,
                            color: "#9e8f8f", textTransform: "uppercase", marginBottom: 7,
                        }}>
                            {label}
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                            {colors.map((hex) => {
                                const isCopied = copied === hex;
                                return (
                                    <button
                                        key={hex}
                                        onClick={() => copy(hex)}
                                        title={hex}
                                        style={{
                                            flex: 1, height: 60, border: "none",
                                            borderRadius: 7, background: hex, cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            transition: "transform 0.12s, opacity 0.12s",
                                            transform: isCopied ? "scale(0.94)" : "scale(1)",
                                            opacity: isCopied ? 0.75 : 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                                            color: isLight(hex) ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.8)",
                                            overflow: "hidden",
                                        }}>
                                            {isCopied ? "✓" : hex.toUpperCase()}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}