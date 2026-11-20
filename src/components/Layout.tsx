import { NavLink, Link, useLocation } from 'react-router-dom'
import { Instagram, Linkedin, Mail } from 'lucide-react'
import { site } from '../data/site'

const links = [
  ['/', 'Início'],
  ['/sobre', 'Sobre'],
  ['/projetos', 'Projetos'],
  ['/galeria', 'Galeria'],
  ['/contacto', 'Contacto'],
]

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return <>{children}</>
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-5">
        <nav className="shell glass flex items-center justify-between rounded-full px-5 py-3">
          <Link to="/" className="text-sm font-semibold tracking-tight">RQ.</Link>
          <div className="hidden items-center gap-7 md:flex">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} className={({isActive}) => `text-xs transition ${isActive ? 'text-white' : 'text-zinc-500 hover:text-white'}`}>
                {label}
              </NavLink>
            ))}
          </div>
          <a href={`mailto:${site.email}`} className="text-zinc-500 transition hover:text-white" aria-label="Enviar email">
            <Mail size={16} />
          </a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/10 py-10">
        <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium">© {new Date().getFullYear()} Rafael Quiosa.</div>
            <div className="mt-1 text-xs text-zinc-600">Backend · Security · Web · Luanda, Angola</div>
          </div>
          <div className="flex gap-4 text-zinc-500">
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16}/></a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16}/></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
