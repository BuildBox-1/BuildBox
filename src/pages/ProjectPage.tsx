import { useParams, Link } from 'react-router'
import { projects } from '../data/projects'
import { builds } from '../data/buiilds'

export default function ProjectPage() {
    const { slug } = useParams<{ slug: string }>()

    const project = projects.find((p) => p.slug === slug)
    const projectBuilds = builds.filter((b) => b.slug === slug)

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 py-24 text-center">
                <span className="text-4xl">404</span>
                <h1 className="text-xl font-semibold text-(--text-h)">Project not found</h1>
                <Link to="/" className="font-mono text-sm text-(--accent) hover:underline">← Back to home</Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
            <Link to="/" className="font-mono text-xs text-(--text) hover:text-(--accent) transition-colors mb-8">
                ← Back
            </Link>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{project.icon}</span>
                <h1 className="text-2xl font-bold text-(--text-h) tracking-tight">{project.name}</h1>
            </div>
            <p className="font-mono text-xs text-(--text) mb-8">
                {projectBuilds.length === 0
                    ? 'No builds yet — be the first contributor.'
                    : `${projectBuilds.length} contributor${projectBuilds.length > 1 ? 's' : ''} have built this.`}
            </p>

            {/* Contributor cards */}
            {projectBuilds.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                    {projectBuilds.map((build) => (
                        <Link
                            key={build.contributor}
                            to={`/projects/${slug}/${build.contributor}`}
                            className="flex items-center gap-3 p-4 rounded-xl border border-(--border) hover:border-(--accent-border) hover:bg-(--accent-bg) transition-colors"
                        >
                            <span className="w-9 h-9 rounded-full bg-(--accent-bg) border border-(--accent-border) flex items-center justify-center font-mono text-sm text-(--accent) font-semibold uppercase shrink-0">
                                {build.contributor[0]}
                            </span>
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-(--text-h)">{build.contributor}</div>
                                <div className="font-mono text-[11px] text-(--text) truncate">
                                    /projects/{slug}/{build.contributor}
                                </div>
                            </div>
                            <span className="ml-auto text-(--accent) shrink-0">→</span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Claim box */}
            <div className="bg-(--code-bg) border border-(--border) rounded-xl px-6 py-5 font-mono text-sm text-(--text)">
                <p className="text-(--accent) mb-3 text-xs uppercase tracking-widest">
                    Want to build this?
                </p>
                <p className="mb-1">1. Create a branch with your name</p>
                <p className="mb-1">2. Add <code className="text-(--accent)">src/pages/{slug2pascal(project.slug)}/your-name.tsx</code></p>
                <p className="mb-1">3. Register it in <code className="text-(--accent)">src/data/builds.ts</code></p>
                <p>4. Commit and open a PR</p>
            </div>
        </div>
    )
}

function slug2pascal(slug: string) {
    return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}