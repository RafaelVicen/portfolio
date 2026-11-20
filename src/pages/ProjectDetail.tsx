import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { projects as fallback } from '../data/projects'
import { getPublicProjects, type ApiProject } from '../data/api'
import { Section } from '../components/Section'

export function ProjectDetail() {
  const { slug } = useParams(); const [items, setItems] = useState<ApiProject[] | null>(null)
  useEffect(() => { getPublicProjects().then(r => setItems(r.projects)).catch(() => setItems(null)) }, [])
  const project: any = (items ?? fallback).find(p => p.slug === slug)
  if (!project) return <Section number="404" title="Projeto"><p className="text-zinc-500">Projeto não encontrado.</p></Section>
  return <Section number={project.category} title={project.title}><Link to="/projetos" className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft size={15}/> Voltar</Link><div className="grid gap-12 lg:grid-cols-[1fr_.75fr]">{project.cover ? <div className="overflow-hidden rounded-3xl border border-white/10 bg-black"><img src={project.cover.variants?.['1600'] || project.cover.mediaUrl} alt={project.cover.alt || project.title} className="h-full max-h-[560px] w-full object-cover" /></div> : <div className="glass rounded-3xl p-10 text-zinc-600">Este projeto ainda não tem uma imagem de capa.</div>}<div><div className="eyebrow">{project.subtitle}</div><p className="mt-6 text-xl leading-9 text-zinc-300">{project.description}</p><div className="mt-8 flex flex-wrap gap-2">{project.tags.map((t:string)=><span className="pill" key={t}>{t}</span>)}</div>{project.link&&<a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm text-white hover:text-zinc-400">Abrir projeto <ExternalLink size={15}/></a>}</div></div><div className="mt-12 glass rounded-3xl p-7"><h2 className="text-lg font-semibold">Responsabilidades & resultados</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">{project.details.map((d:string)=><li key={d}>— {d}</li>)}</ul></div></Section>
}
