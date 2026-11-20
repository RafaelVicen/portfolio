import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Download, Github, Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'

export function Home() {
  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.09),transparent_30%),linear-gradient(#050505,#050505)]" />
        <div className="shell relative z-10 w-full py-32">
          <motion.div initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <div className="eyebrow">Luanda · Angola · 2026</div>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <div>
                {/* FOTO DE PERFIL: o caminho vem de src/data/site.ts para facilitar futuras trocas. */}
                <div className="mb-6 h-28 w-28 overflow-hidden rounded-full border border-white/15 bg-white/[.04] shadow-[0_0_0_8px_rgba(255,255,255,0.02)]">
                  <img
                    src={site.profileImage}
                    alt="Rafael Quiosa"
                    width={768}
                    height={1190}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover object-top grayscale"
                  />
                </div>
                <h1 className="max-w-5xl text-5xl font-semibold leading-[.95] tracking-[-.05em] sm:text-7xl lg:text-[7rem]">
                  Engenharia<br/><span className="text-zinc-600">com segurança</span><br/>no centro.
                </h1>
              </div>
              <div className="lg:pb-2">
                <p className="max-w-xl text-base leading-8 text-zinc-400">{site.role}. Construo produtos digitais, APIs, interfaces e ambientes com foco em performance, segurança e escalabilidade.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {site.cvPath && <a href={site.cvPath} download className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"><Download size={15}/> Baixar CV</a>}
                  <Link to="/projetos" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm hover:bg-white/[.06]">Ver projetos <ArrowUpRight size={15}/></Link>
                </div>
                <div className="mt-7 flex gap-4 text-zinc-500">
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18}/></a>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18}/></a>
                  {site.github && <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18}/></a>}
                </div>
              </div>
            </div>
          </motion.div>
          <a href="#sobre" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 transition hover:text-white" aria-label="Descer"><ArrowDown size={18}/></a>
        </div>
      </section>
      <section id="sobre" className="border-y border-white/10 py-20">
        <div className="shell grid gap-8 md:grid-cols-[.3fr_.7fr]">
          <div className="eyebrow">01 / Sobre</div>
          <p className="max-w-4xl text-2xl leading-relaxed tracking-tight text-zinc-300 sm:text-4xl">Backend, segurança web, infraestrutura Linux e produtos digitais — unidos por uma abordagem prática de engenharia.</p>
        </div>
      </section>
    </>
  )
}
