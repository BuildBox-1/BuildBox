import { useState } from "react";
import { Link } from "react-router-dom";

export default function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  const bmi = h > 0 && w > 0 ? (w / (h * h)).toFixed(1) : null;

  const category =
    !bmi ? "" :
    +bmi < 18.5 ? "Underweight" :
    +bmi < 25   ? "Normal" :
    +bmi < 30   ? "Overweight" : "Obese";

  return (
    <div className="min-h-screen bg-[#09051a] flex items-center justify-center p-6">
      <div className="flex flex-col items-start gap-3 w-full max-w-sm">

        {/* Back — always outside the card */}
        <Link
          to="/projects/bmi-calculator"
          className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors"
        >
          ← Back
        </Link>

        {/* Card */}
        <div className="w-full rounded-2xl overflow-hidden border border-[#8748c7]/30 shadow-xl shadow-[#8748c7]/10">

          <div className="bg-[#8748c7] px-6 py-5">
            <h1 className="text-white font-semibold text-lg">BMI Calculator</h1>
            <p className="text-[#d4a8ff] text-sm">Body Mass Index</p>
          </div>

          <div className="bg-[#120d24] px-6 py-5 space-y-4">

            <div>
              <label className="text-[11px] text-[#8748c7] font-medium uppercase tracking-widest">Height (cm)</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175"
                className="w-full mt-2 bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]" />
            </div>

            <div>
              <label className="text-[11px] text-[#8748c7] font-medium uppercase tracking-widest">Weight (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70"
                className="w-full mt-2 bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8748c7]/60 transition-colors placeholder-[#3a2a5a]" />
            </div>

            {bmi && (
              <div className="bg-[#09051a] border border-[#8748c7]/20 rounded-xl px-4 py-4 text-center">
                <p className="text-white text-5xl font-light">{bmi}</p>
                <p className={`text-sm font-medium mt-1 ${
                  category === "Normal"      ? "text-green-400" :
                  category === "Underweight" ? "text-blue-400"  :
                  category === "Overweight"  ? "text-amber-400" : "text-red-400"
                }`}>{category}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}