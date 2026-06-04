import { useParams, Link } from 'react-router'
import { lazy, Suspense, Component, type ReactNode } from 'react'
import { projects } from '../data/projects'
import { builds } from '../data/buiilds'

export default function ContributorPage() {
    const { slug, contributor } = useParams<{ slug: string; contributor: string }>()

    const project = projects.find((p) => p.slug === slug)
    const build = builds.find((b) => b.slug === slug && b.contributor === contributor)

    if (!project || !build) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-24 text-center">
                <span className="text-4xl">404</span>
                <h1 className="text-xl font-semibold text-(--text-h)">Build not found</h1>
                <p className="font-mono text-sm text-(--text)">
                    No build by <span className="text-(--accent)">{contributor}</span> for {project?.name ?? slug}.
                </p>
                <Link to={`/projects/${slug}`} className="font-mono text-sm text-(--accent) hover:underline">
                    ← Back to {project?.name ?? slug}
                </Link>
            </div>
        )
    }

    const PageComponent = lazy(build.component)

    return (
        <Suspense fallback={<Loader />}>
            <ErrorBoundary
                fallback={
                    <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-24 text-center">
                        <span className="text-4xl">⚠</span>
                        <h1 className="text-xl font-semibold text-(--text-h)">Failed to load</h1>
                        <p className="font-mono text-sm text-(--text)">Something went wrong loading this build.</p>
                        <Link to="/" className="font-mono text-sm text-(--accent) hover:underline">← Back to home</Link>
                    </div>
                }
            >
                <PageComponent />
            </ErrorBoundary>
        </Suspense>
    )
}

function Loader() {
    return (
        <div className="flex items-center justify-center flex-1 py-24">
            <span className="font-mono text-sm text-(--text) animate-pulse">Loading…</span>
        </div>
    )
}

class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
    state = { hasError: false }
    static getDerivedStateFromError() { return { hasError: true } }
    render() { return this.state.hasError ? this.props.fallback : this.props.children }
}