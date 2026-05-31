import { Link } from 'react-router'
import type { Project } from '../types'

interface Props {
    project: Project
}

export default function ProjectCard({ project }: Props) {
    const { name, icon, tag, featured, slug } = project
    const isApi = tag === 'api'

    return (
        <Link
            to={`/projects/${slug}`}
            className={`flex flex-col gap-1.5 p-4 rounded-xl border cursor-pointer transition-colors no-underline
        ${featured
                    ? 'border-(--accent-border) hover:bg-(--accent-bg)'
                    : 'border-(--border) hover:border-(--accent-border) hover:bg-(--accent-bg)'
                }`}
        >
            <span className="text-lg leading-none mb-0.5" aria-hidden="true">{icon}</span>

            <span className="text-sm font-semibold text-(--text-h)">
                {name}{featured && <span className="text-(--accent) text-[11px]"> ★</span>}
            </span>

            <span
                className={`font-mono text-[10px] self-start px-1.5 py-0.5 rounded border
          ${isApi
                        ? 'text-(--accent) border-(--accent-border) bg-(--accent-bg)'
                        : 'text-(--text) border-(--border) bg-(--code-bg)'
                    }`}
            >
                {tag}
            </span>
        </Link>
    )
}