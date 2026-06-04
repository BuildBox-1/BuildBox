// src/pages/[ProjectName]/your-name.tsx
//
// 1. Rename this file to your name e.g. john.tsx
// 2. Put it in the right folder e.g. src/pages/WeatherApp/john.tsx
// 3. Register it in src/data/builds.ts
// 4. Build your project below — keep everything in this one file if possible
// 5. Use CSS vars for theming (see index.css) so it works in dark mode too
//
// Available vars:
//   var(--accent)       purple highlight
//   var(--text)         body text
//   var(--text-h)       heading text
//   var(--bg)           background
//   var(--border)       border
//   var(--code-bg)      subtle card/input background
//   var(--accent-bg)    purple tint background
//   var(--accent-border)purple tint border

import { Link } from 'react-router'

export default function MyProject() {
    return (
        <div className="flex flex-col flex-1 px-6 py-10 max-w-lg mx-auto w-full">
            {/* Back link — update the slug */}
            <Link
                to="/projects/your-project-slug"
                className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8"
            >
                ← Back
            </Link>

            <h1 className="text-2xl font-bold text-(--text-h) tracking-tight mb-1">
                Your Project Name
            </h1>
            <p className="font-mono text-xs text-(--text) mb-8">Built by your-name</p>

            {/* Your project goes here */}
        </div>
    )
}