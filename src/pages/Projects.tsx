import { useEffect, useState } from 'react'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { projects as fallback } from '../data/projects'
import { getPublicProjects, type ApiProject } from '../data/api'

export function Projects() {
  const [items, setItems] = useState<ApiProject[] | null>(null)
  useEffect(() => { getPublicProjects().then(r => setItems(r.projects)).catch(() => setItems(null)) }, [])
  const list = items ?? fallback
  return <Section number="02" title="Projetos"><div className="grid gap-6 md:grid-cols-2">{list.map(p => <ProjectCard key={p.slug} project={p as any} />)}</div></Section>
}
