import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Video } from 'lucide-react'
import { Section } from '../components/Section'
import { getPublicMedia, type Media } from '../data/api'

const categoryTitles: Record<string,string> = { EcoAngola:'EcoAngola — Ações Ambientais & Comunidade', Formações:'Formações & Aprendizagem', Hackathons:'Hackathon EcoAngola — Semana Verde da Juventude', Eventos:'Eventos & Comunidade', Projetos:'Projetos', Outras:'Outras' }
export function Gallery() {
  const [filter,setFilter]=useState('Todos'); const [media,setMedia]=useState<Media[]>([])
  useEffect(()=>{getPublicMedia().then(r=>setMedia(r.media)).catch(()=>{})},[])
  const categories=useMemo(()=>['Todos',...Array.from(new Set(media.map(x=>x.category)))],[media])
  const groups=useMemo(()=>{const map=new Map<string,Media[]>();for(const x of media){if(filter!=='Todos'&&x.category!==filter)continue;if(!map.has(x.category))map.set(x.category,[]);map.get(x.category)!.push(x)}return [...map.entries()]},[media,filter])
  return <Section number="03" title="Galeria"><div className="mb-8 flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setFilter(c)} className={`pill transition ${filter===c?'border-white/30 text-white':'hover:text-white'}`}>{c}</button>)}</div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{groups.map(([cat,items])=>{const cover=items.find(x=>x.kind==='image');return <article key={cat} className="group glass overflow-hidden rounded-3xl"><Link to={`/galeria-dinamica/${encodeURIComponent(cat)}`}><div className="relative aspect-[16/10] overflow-hidden bg-black">{cover?<img src={cover.variants?.['960']||cover.mediaUrl} alt={cover.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/>:<div className="flex h-full items-center justify-center"><Video size={30}/></div>}<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"/><div className="absolute bottom-0 left-0 right-0 p-5"><div className="eyebrow">{cat}</div><div className="mt-2 text-xl font-semibold">{categoryTitles[cat]||cat}</div></div></div><div className="flex items-center justify-between p-5 text-sm"><span>{items.length} ficheiros</span><ArrowUpRight size={15}/></div></Link></article>})}</div>{media.length===0&&<div className="glass rounded-3xl p-10 text-center text-sm text-zinc-600">A galeria está preparada para receber fotografias e vídeos através do painel.</div>}</Section>
}
