# BuildBox

A collection of mini projects built by contributors to practice Git, GitHub collaboration, and frontend development skills.

## What is this?

BuildBox is a shared React codebase where contributors pick a project, build it on their own branch, and submit a pull request. Whether you're new to Git or an experienced developer, there's something here for you.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for bundling.
- [Tailwind CSS v4](https://tailwindcss.com/) for styling.
- [React Router v7](https://reactrouter.com/) for routing.

> JavaScript contributors: just rename `.tsx` → `.jsx` and `.ts` → `.js` and remove the type annotations.

---

## Getting started

```bash
git clone https://github.com/your-org/buildbox.git
cd buildbox
npm install
npm run dev
```

---

## How to contribute

### 1. Create your branch

Use your name as the branch name:

```bash
git checkout -b your-name
```

### 2. Pick a project

Browse the project list on the landing page or check [`src/data/projects.ts`](./src/data/projects.ts).

Each project has a `slug` (e.g. `todo-app`). Convert it to PascalCase to get your filename:

| slug          | filename         |
| ------------- | ---------------- |
| `todo-app`    | `TodoApp.tsx`    |
| `weather-app` | `WeatherApp.tsx` |
| `quiz-app`    | `QuizApp.tsx`    |

### 3. Create your page

Add your file to `src/pages/`:

```
src/pages/YourProjectName.tsx
```

The routing is automatic — if `src/pages/TodoApp.tsx` exists, `/projects/todo-app` loads it. If it doesn't, a "coming soon" placeholder is shown.

### 4. Build your project

Your page is a standard React component. Keep it self-contained — all logic and UI in one file if possible.

Use the existing CSS variables for theming so your project looks consistent in light and dark mode:

```css
var(--accent)        /* purple highlight */
var(--text)          /* body text */
var(--text-h)        /* heading text */
var(--bg)            /* page background */
var(--border)        /* border color */
var(--code-bg)       /* subtle background for inputs/cards */
```

Add a back link so users can return to the home page:

```tsx
import { Link } from 'react-router'

<Link to="/" className="font-mono text-xs text-(--text) hover:text-(--accent)">
  ← Back
</Link>
```

See [`src/pages/TodoApp.tsx`](./src/pages/TodoApp.tsx) for a complete example.

### 5. Commit and push

```bash
git add .
git commit -m "add: todo app"
git push origin your-name
```

### 6. Open a pull request

Go to GitHub and open a PR from your branch into `main`. Add a short description of what you built.

---

## Project list

| Project               | Slug                      | Difficulty |
| --------------------- | ------------------------- | ---------- |
| Todo App              | `todo-app`                | beginner   |
| Weather App           | `weather-app`             | api        |
| Password Generator    | `password-generator`      | tool       |
| QR Code Generator     | `qr-code-generator`       | tool       |
| Notes App             | `notes-app`               | beginner   |
| Expense Tracker       | `expense-tracker`         | tool       |
| Pomodoro Timer        | `pomodoro-timer`          | beginner   |
| Calculator            | `calculator`              | beginner   |
| Currency Converter    | `currency-converter`      | api        |
| BMI Calculator        | `bmi-calculator`          | tool       |
| Habit Tracker         | `habit-tracker`           | tool       |
| URL Shortener UI      | `url-shortener`           | tool       |
| GitHub Profile Finder | `github-profile-finder`   | api        |
| Random Quote Gen      | `random-quote-generator`  | api        |
| Movie Search App      | `movie-search`            | api        |
| Recipe Finder         | `recipe-finder`           | api        |
| Markdown Previewer    | `markdown-previewer`      | tool       |
| Quiz App              | `quiz-app`                | beginner   |
| Flashcard App         | `flashcard-app`           | beginner   |
| Kanban Board          | `kanban-board`            | tool       |
| Chat UI Clone         | `chat-ui`                 | tool       |
| E-commerce Page       | `ecommerce-page`          | tool       |
| Meme Generator        | `meme-generator`          | tool       |
| Color Palette Gen     | `color-palette-generator` | tool       |
| AI Prompt Library     | `ai-prompt-library`       | api        |
| Resume Builder        | `resume-builder`          | tool       |
| Unit Converter        | `unit-converter`          | beginner   |
| Typing Speed Test     | `typing-speed-test`       | tool       |
| Rock Paper Scissors   | `rock-paper-scissors`     | game       |
| Tic-Tac-Toe           | `tic-tac-toe`             | game       |

Don't see a project you want to build? Suggest a new one by opening an issue.

---

## Project structure

```
src/
├── App.tsx               # root layout + routes
├── index.css             # global styles + CSS vars
├── components/           # shared UI (Navbar, Hero, etc.)
├── data/
│   └── projects.ts       # project list with slugs
├── types/
│   └── index.ts          # shared TypeScript types
└── pages/                # ← your project goes here
    ├── ProjectPage.tsx   # dynamic route handler
    └── TodoApp.tsx       # example
```

---

## License

MIT
