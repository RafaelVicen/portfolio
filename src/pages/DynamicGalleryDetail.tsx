import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'
import { Section } from '../components/Section'
import { getPublicMedia, type Media } from '../data/api'

export function DynamicGalleryDetail() {
  const { category } = useParams(); const decoded = decodeURIComponent(category || ''); const [items,setItems]=useState<Media[]>([])
  useEffect(()=>{getPublicMedia().then(r=>setItems(r.media.filter(x=>x.category===decoded))).catch(()=>{})},[decoded])
  return <Section number={decoded} title={decoded}><Link to="/galeria" className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft size={15}/> Voltar</Link><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><div key={item.id} className="glass overflow-hidden rounded-2xl"><div className="aspect-video bg-black">{item.kind==='image'?<img src={item.variants?.['960']||item.mediaUrl} alt={item.alt} loading="lazy" decoding="async" className="h-full w-full object-cover"/>:<video src={item.mediaUrl} poster={item.posterUrl||undefined} controls preload="metadata" className="h-full w-full object-cover"/>}</div><div className="p-4"><div className="text-[11px] uppercase tracking-wider text-zinc-600">{item.kind==='image'?'Fotografia':'Vídeo'}</div><p className="mt-1 text-sm text-zinc-300">{item.alt}</p></div></div>)}</div>{items.length===0&&<p className="text-zinc-600">Ainda não existem conteúdos nesta secção.</p>}</Section>
}
