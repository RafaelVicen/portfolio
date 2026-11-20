import { Mail, Phone, Instagram, Linkedin } from 'lucide-react'
import { Section } from '../components/Section'
import { site } from '../data/site'

export function Contact() {
  return <Section number="04" title="Contacto">
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-5xl font-semibold tracking-tight">Vamos conversar.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-500">Para oportunidades profissionais, projetos, colaboração tecnológica ou assuntos relacionados a segurança e engenharia de software.</p>
      </div>
      <div className="glass rounded-3xl p-7">
        <a href={`mailto:${site.email}`} className="flex items-center gap-4 border-b border-white/10 py-4"><Mail size={17}/><span>{site.email}</span></a>
        <a href={`tel:${site.phone.replace(/\s/g,'')}`} className="flex items-center gap-4 border-b border-white/10 py-4"><Phone size={17}/><span>{site.phone}</span></a>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 border-b border-white/10 py-4"><Linkedin size={17}/><span>linkedin.com/in/rafael-quiosa</span></a>
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-4"><Instagram size={17}/><span>@rafael_vicente67</span></a>
      </div>
    </div>
  </Section>
}