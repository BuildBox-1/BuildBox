import { Link, useParams } from 'react-router-dom'
import { lazy, Suspense, type ComponentType, createElement } from 'react'
import { Component, type ReactNode } from 'react'
import { projects } from '../data/projects'

const pageModules = import.meta.glob('./*.tsx')

function slugToPascal(slug: string) {
    return slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
}

function getPageComponent(slug: string) {
    const filePath = `./${slugToPascal(slug)}.tsx`
    const importer = pageModules[filePath]

    if (!importer) return null

    return lazy(importer as () => Promise<{ default: ComponentType }>)
}

export default function ProjectPage() {
    const { slug } = useParams<{ slug: string }>()

    if (!slug) {
        return null
    }

    const project = projects.find((p) => p.slug === slug)

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-24 text-center">
                <span className="text-4xl">404</span>
                <h1 className="text-xl font-semibold text-(--text-h)">Project not found</h1>
                <p className="font-mono text-sm text-(--text)">
                    That slug does not match any project in the list.
                </p>
                <Link to="/" className="font-mono text-sm text-(--accent) hover:underline">
                    ← Back to home
                </Link>
            </div>
        )
    }

    const PageComponent = getPageComponent(slug)

    if (!PageComponent) {
        return <ComingSoon project={project} />
    }

    return (
        <Suspense fallback={<PageLoader />}>
            <ErrorBoundary fallback={<ComingSoon project={project} />}>
                {createElement(PageComponent)}
            </ErrorBoundary>
        </Suspense>
    )
}

function PageLoader() {
    return (
        <div className="flex items-center justify-center flex-1 py-24">
            <span className="font-mono text-sm text-(--text) animate-pulse">
                Loading…
            </span>
        </div>
    )
}

function ComingSoon({
    project,
}: {
    project: { name: string; icon: string; slug: string }
}) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-24 text-center">
            <span className="text-5xl">{project.icon}</span>

            <div>
                <h1 className="mb-2 text-2xl font-bold tracking-tight text-(--text-h)">
                    {project.name}
                </h1>
                <p className="mx-auto max-w-[36ch] font-mono text-sm leading-relaxed text-(--text)">
                    Nobody has built this one yet. Want to be the first?
                </p>
            </div>

            <div className="w-full max-w-sm rounded-xl border border-(--border) bg-(--code-bg) px-6 py-4 text-left font-mono text-sm text-(--text)">
                <p className="mb-2 text-xs uppercase tracking-widest text-(--accent)">
                    To claim this project
                </p>
                <p>1. Create a branch with your name</p>
                <p>2. Add <code className="text-(--accent)">src/pages/{slugToPascal(project.slug)}.tsx</code></p>
                <p>3. Build it, commit, open a PR</p>
            </div>

            <Link
                to="/"
                className="font-mono text-sm text-(--text) transition-colors hover:text-(--accent)"
            >
                ← Back to all projects
            </Link>
        </div>
    )
}

class ErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        return this.state.hasError ? this.props.fallback : this.props.children
    }
}