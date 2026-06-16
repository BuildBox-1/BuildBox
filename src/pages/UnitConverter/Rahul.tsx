import { useState } from "react";
import { Link } from "react-router-dom";

const UNITS = {
  Length: {
    Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001,
    Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254,
  },
  Weight: {
    Kilogram: 1, Gram: 0.001, Milligram: 0.000001,
    Pound: 0.453592, Ounce: 0.0283495, Ton: 1000,
  },
  Temperature: { Celsius: 0, Fahrenheit: 0, Kelvin: 0 },
  Speed: {
    "m/s": 1, "km/h": 0.277778, "mph": 0.44704, Knot: 0.514444,
  },
  Area: {
    "m²": 1, "km²": 1e6, "cm²": 0.0001, "ft²": 0.092903, Acre: 4046.86, Hectare: 10000,
  },
  Volume: {
    Liter: 1, Milliliter: 0.001, "m³": 1000,
    Gallon: 3.78541, Pint: 0.473176, Cup: 0.236588,
  },
} as const;

type Category = keyof typeof UNITS;

function convert(value: number, from: string, to: string, cat: Category): number {
  if (cat === "Temperature") {
    let celsius =
      from === "Fahrenheit" ? (value - 32) * 5 / 9 :
      from === "Kelvin"     ? value - 273.15 : value;
    return to === "Fahrenheit" ? celsius * 9 / 5 + 32 :
           to === "Kelvin"     ? celsius + 273.15 : celsius;
  }
  const units = UNITS[cat] as Record<string, number>;
  return (value * units[from]) / units[to];
}

export default function App() {
  const [cat,   setCat]   = useState<Category>("Length");
  const [from,  setFrom]  = useState("Meter");
  const [to,    setTo]    = useState("Kilometer");
  const [value, setValue] = useState("");

  const units  = Object.keys(UNITS[cat]);
  const result = value !== "" && !isNaN(+value)
    ? convert(+value, from, to, cat)
    : null;

  function switchCat(c: Category) {
    setCat(c);
    const keys = Object.keys(UNITS[c]);
    setFrom(keys[0]);
    setTo(keys[1]);
    setValue("");
  }

  const fmt = (n: number) =>
    Math.abs(n) < 0.0001 || Math.abs(n) > 1e9
      ? n.toExponential(4)
      : parseFloat(n.toFixed(6)).toString();

  return (
    <div className="min-h-screen bg-[#09051a] flex items-center justify-center p-6">
      <div className="flex flex-col items-start gap-3 w-full max-w-sm">

        <Link to="/projects/unit-converter"
          className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors">
          ← Back
        </Link>

        <div className="w-full rounded-2xl overflow-hidden border border-[#8748c7]/30 shadow-xl shadow-[#8748c7]/10">

          <div className="bg-[#8748c7] px-6 py-5">
            <h1 className="text-white font-semibold text-lg">Unit Converter</h1>
            <p className="text-[#d4a8ff] text-sm">Length, Weight, Temp & more</p>
          </div>

          <div className="bg-[#120d24] px-6 py-5 space-y-4">

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(UNITS) as Category[]).map(c => (
                <button key={c} onClick={() => switchCat(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    cat === c
                      ? "bg-[#8748c7] text-white"
                      : "bg-[#09051a] border border-[#8748c7]/20 text-[#5a4a7a] hover:text-[#8748c7]"
                  }`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Value input */}
            <input type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="Enter value…"
              className="w-full bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]" />

            {/* From / To selects */}
            <div className="flex gap-2 items-center">
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="flex-1 bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors cursor-pointer appearance-none">
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>

              <button onClick={() => { setFrom(to); setTo(from); }}
                className="flex-shrink-0 text-[#8748c7] hover:text-[#a060dc] transition-colors text-lg">
                ⇄
              </button>

              <select value={to} onChange={e => setTo(e.target.value)}
                className="flex-1 bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors cursor-pointer appearance-none">
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            {/* Result */}
            {result !== null && (
              <div className="bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-4">
                <p className="text-[#6040a0] text-sm mb-1">{value} {from} =</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-3xl font-light">{fmt(result)}</span>
                  <span className="text-[#8748c7] font-medium">{to}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}