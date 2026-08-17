export function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="shell py-24 sm:py-32">
      <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-5">
        <div className="eyebrow">{number} / {title}</div>
      </div>
      {children}
    </section>
  )
}
