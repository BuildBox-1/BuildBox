import type { ProjectBuild } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTOR REGISTRY
// When you build a project, add an entry here.
//
// slug        → must match a slug in projects.ts
// contributor → your name (used in the URL and the listing card)
// component   → dynamic import of your page file
//
// File naming: src/pages/{Slug}/{YourName}.tsx
// Example:     src/pages/WeatherApp/john.tsx
// ─────────────────────────────────────────────────────────────────────────────

export const builds: ProjectBuild[] = [
    {
        slug: 'weather-app',
        contributor: 'raj',
        component: () => import('../pages/WeatherApp/raj'),
    },
    {
        slug: 'todo-app',
        contributor: 'raj',
        component: () => import('../pages/TodoApp/raj'),
    },
]