export type ProjectCategory = 'beginner' | 'api' | 'game' | 'tool'

export interface Project {
    name: string
    icon: string
    tag: string
    cat: ProjectCategory
    featured?: boolean
    slug: string
}

export interface ProjectBuild {
    slug: string
    contributor: string
    component: () => Promise<{ default: React.ComponentType }>
}

export type FilterType = 'all' | ProjectCategory