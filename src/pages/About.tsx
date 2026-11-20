import { motion } from 'framer-motion'
import { Section } from '../components/Section'
import { certifications, education, experiences, profile, volunteering } from '../data/profile'

export function About() {
  return (
    <>
      <Section number="01" title="About">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Engenharia com segurança no centro.</h1>
          </div>
          <div>
            <p className="whitespace-pre-line text-lg leading-8 text-zinc-400">{profile.about}</p>
            <div className="mt-7 flex flex-wrap gap-2">{profile.languages.map(x => <span className="pill" key={x}>{x}</span>)}</div>
          </div>
        </div>
      </Section>

      <Section number="02" title="Competências">
        <div className="grid gap-5 md:grid-cols-2">
          {Object.entries(profile.skills).map(([group, skills], i) => (
            <motion.article initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} key={group} className="glass rounded-3xl p-7">
              <h2 className="text-xl font-semibold">{group}</h2>
              <div className="mt-5 flex flex-wrap gap-2">{skills.map(skill => <span className="pill" key={skill}>{skill}</span>)}</div>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section number="03" title="Experiência">
        <div className="relative ml-2 border-l border-white/10">
          {experiences.map((item, i) => (
            <article key={item.company} className="relative pb-12 pl-8 last:pb-0">
              <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-white" />
              <div className="eyebrow">{String(i + 1).padStart(2,'0')} · {item.period}</div>
              <h2 className="mt-3 text-2xl font-semibold">{item.title}</h2>
              <div className="mt-1 text-sm text-zinc-500">{item.company} · {item.location}</div>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-400">{item.description}</p>
              <ul className="mt-4 max-w-3xl space-y-2 text-sm leading-7 text-zinc-500">{item.bullets.map(b => <li key={b}>— {b}</li>)}</ul>
            </article>
          ))}
        </div>
      </Section>

      <Section number="04" title="Educação">
        <div className="grid gap-5 md:grid-cols-2">
          {education.map(item => (
            <article key={item.institution} className="glass rounded-3xl p-7">
              <div className="eyebrow">{item.period}</div>
              <h2 className="mt-3 text-2xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-zinc-500">{item.institution} · {item.location}</p>
              {item.area && <p className="mt-5 text-sm leading-7 text-zinc-400">{item.area}</p>}
            </article>
          ))}
        </div>
      </Section>

      <Section number="05" title="Certificações">
        <div className="grid gap-5 md:grid-cols-2">
          {certifications.map(item => (
            <article key={item.title} className="glass rounded-3xl p-7">
              <div className="eyebrow">{item.date}</div>
              <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">{item.institution}</p>
              <p className="mt-5 text-sm leading-7 text-zinc-400">{item.description}</p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-500">{item.bullets.map(b => <li key={b}>— {b}</li>)}</ul>
            </article>
          ))}
        </div>
      </Section>

      <Section number="06" title="Voluntariado & Comunidade">
        <div className="grid gap-5 md:grid-cols-2">
          {volunteering.map(item => (
            <article key={item.title} className="glass rounded-3xl p-7">
              <div className="eyebrow">{item.period}{item.location ? ` · ${item.location}` : ''}</div>
              <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
              <p className="mt-5 text-sm leading-7 text-zinc-400">{item.description}</p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-500">{item.bullets.map(b => <li key={b}>— {b}</li>)}</ul>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
