import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group glass overflow-hidden rounded-3xl transition duration-500 hover:-translate-y-1 hover:border-white/20">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0a0a0a]">{project.cover ? <img src={project.cover.variants?.['960'] || project.cover.mediaUrl} alt={project.cover.alt || project.title} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.12),transparent_35%),linear-gradient(135deg,#151515,#050505)]" />}<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" /><div className="absolute inset-0 p-6">
        <div className="flex h-full flex-col justify-between">
          <div className="eyebrow">{project.category}</div>
          <div>
            <div className="mb-3 text-xs text-zinc-500">CASE / {project.slug}</div>
            <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
          </div>
        </div></div></div>
      <div className="p-6">
        <p className="text-sm leading-7 text-zinc-400">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, 5).map(tag => <span className="pill" key={tag}>{tag}</span>)}
        </div>
        <Link to={`/projetos/${project.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm text-white transition hover:text-zinc-400">
          Ver projeto <ArrowUpRight size={15}/>
        </Link>
      </div>
    </article>
  )
}
