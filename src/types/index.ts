export type ProjectCategory = 'beginner' | 'api' | 'game' | 'tool'

export interface Project {
    name: string
    icon: string
    tag: string
    cat: ProjectCategory
    featured?: boolean
    slug: string
}

export type FilterType = 'all' | ProjectCategory