import { useParams, Link } from 'react-router'
import { lazy, Suspense, type ComponentType, createElement } from 'react'
import { projects } from '../data/projects'

// Dynamically import from pages/ folder
// Contributors create e.g. src/pages/TodoApp.tsx and it auto-loads
function loadPage(slug: string) {
    // Convert slug to PascalCase filename: todo-app → TodoApp
    const name = slug
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('')
    return lazy(() =>
        import(`../pages/${name}.tsx`).catch(() => ({
            default: () => null, // will be handled by error boundary below
        }))
    )
}

const pageCache: Record<string, ComponentType> = {}

function getPageComponent(slug: string) {
    if (!pageCache[slug]) {
        pageCache[slug] = loadPage(slug)
    }
    return pageCache[slug]
}

export default function ProjectPage() {
    const { slug } = useParams<{ slug: string }>()

    const project = projects.find((p) => p.slug === slug)

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-24 text-center">
                <span className="text-4xl">404</span>
                <h1 className="text-xl font-semibold text-(--text-h)">Project not found</h1>
                <p className="font-mono text-sm text-(--text)">
                    That slug doesn't match any project in the list.
                </p>
                <Link to="/" className="font-mono text-sm text-(--accent) hover:underline">
                    ← Back to home
                </Link>
            </div>
        )
    }

    return (
        <Suspense fallback={<PageLoader />}>
            <ErrorBoundary fallback={<ComingSoon project={project} />}>
                {createElement(getPageComponent(slug!))}
            </ErrorBoundary>
        </Suspense>
    )
}

// ─── Loading state ────────────────────────────────────────────────────────────
function PageLoader() {
    return (
        <div className="flex items-center justify-center flex-1 py-24">
            <span className="font-mono text-sm text-(--text) animate-pulse">Loading…</span>
        </div>
    )
}

// ─── Coming soon placeholder ──────────────────────────────────────────────────
function ComingSoon({ project }: { project: { name: string; icon: string; slug: string } }) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-24 text-center">
            <span className="text-5xl">{project.icon}</span>

            <div>
                <h1 className="text-2xl font-bold text-(--text-h) tracking-tight mb-2">
                    {project.name}
                </h1>
                <p className="font-mono text-sm text-(--text) max-w-[36ch] mx-auto leading-relaxed">
                    Nobody has built this one yet. Want to be the first?
                </p>
            </div>

            <div className="bg-(--code-bg) border border-(--border) rounded-xl px-6 py-4 text-left font-mono text-sm text-(--text) max-w-sm w-full">
                <p className="text-(--accent) mb-2 text-xs uppercase tracking-widest">To claim this project</p>
                <p>1. Create a branch with your name</p>
                <p>2. Add <code className="text-(--accent)">src/pages/{slug2pascal(project.slug)}.tsx</code></p>
                <p>3. Build it, commit, open a PR</p>
            </div>

            <Link to="/" className="font-mono text-sm text-(--text) hover:text-(--accent) transition-colors">
                ← Back to all projects
            </Link>
        </div>
    )
}

function slug2pascal(slug: string) {
    return slug
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('')
}

// ─── Minimal error boundary ───────────────────────────────────────────────────
import { Component, type ReactNode } from 'react'

class ErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) return this.props.fallback
        return this.props.children
    }
}