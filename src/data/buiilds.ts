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
    {
        slug: 'qr-code-generator',
        contributor: 'Flashyfury',
        component: () => import('../pages/QrCodeGenerator/Flashyfury'),
    },
    {
        slug: 'password-generator',
        contributor: 'raj',
        component: () => import('../pages/PasswordGenerator/raj'),
    },
    {
        slug: 'password-generator',
        contributor: 'Rahul',
        component: () => import('../pages/PasswordGenerator/Rahul'),
    },
    {
        slug: 'calculator',
        contributor: 'Rahul',
        component: () => import('../pages/Calculator/Rahul'),
    },
    {
        slug: 'currency-converter',
        contributor: 'Rahul',
        component: () => import('../pages/CurrencyConverter/Rahul'),
    },
    {
        slug: 'url-shortener',
        contributor: 'Rahul',
        component: () => import('../pages/UrlShortener/Rahul'),
    },
    {
        slug: 'github-profile-finder',
        contributor: 'Rahul',
        component: () => import('../pages/GithubProfileFinder/Rahul'),
    },
    {
        slug: 'random-quote-generator',
        contributor: 'Rahul',
        component: () => import('../pages/RandomQuoteGenerator/Rahul'),
    },
    {
        slug: 'qr-code-generator',
        contributor: 'Rahul',
        component: () => import('../pages/QrCodeGenerator/Rahul'),
    },
    {
        slug: 'notes-app',
        contributor: 'Rahul',
        component: () => import('../pages/NotesApp/Rahul'),
    },
    {
        slug: 'pomodoro-timer',
        contributor: 'Rahul',
        component: () => import('../pages/PomodoroTimer/Rahul'),
    },
    {
        slug: 'markdown-previewer',
        contributor: 'Rahul',
        component: () => import('../pages/MarkdownPreviewer/Rahul'),
    },
    {
        slug: 'ai-prompt-library',
        contributor: 'Rahul',
        component: () => import('../pages/AIPromptLibrary/Rahul'),
    },
    {
        slug: 'typing-speed-test',
        contributor: 'Rahul',
        component: () => import('../pages/TypingSpeedTest/Rahul'),
    },
    {
        slug: 'bmi-calculator',
        contributor: 'Rahul',
        component: () => import('../pages/BMICalculator/Rahul'),
    },
    {
        slug: 'unit-converter',
        contributor: 'Rahul',
        component: () => import('../pages/UnitConverter/Rahul'),
    },
    {
        slug: 'github-profile-finder',
        contributor: "Raj",
        component: () => import("../pages/GithubProfileFinder/raj"),
    },
    {
        slug: 'wake-up-cunt',
        contributor: 'Flashyfury',
        component: () => import('../pages/WakeupCunt/Flashyfury'),
    },
    {
        slug: 'resume-builder',
        contributor: 'Rahul',
        component: () => import('../pages/ResumeBuilder/Rahul'),
    },
    {
        slug: 'quiz-app',
        contributor: 'Rahul',
        component: () => import('../pages/QuizApp/Rahul'),
    },
    {
        slug: 'tic-tac-toe',
        contributor: 'Rahul',
        component: () => import('../pages/Tictactoe/Rahul'),
    },
    {
        slug: 'color-palette-generator',
        contributor: 'Rahul',
        component: () => import('../pages/ColorPaletteGenerator/Rahul'),
    }
]