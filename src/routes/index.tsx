import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/striv-logo.jpg.asset.json";
import { meta } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({ meta: meta("STRIV INDUSTRIES — Soluciones digitales", "Diseño web, tiendas virtuales, mantenimiento y automatizaciones en Cartago, Valle del Cauca.") }),
  component: Index,
});

const pillars = [
  ["01", "Innovación", "Usamos tecnología actual para que tu negocio destaque."],
  ["02", "Desarrollo personalizado", "Cada solución se adapta a lo que necesitas."],
  ["03", "Acompañamiento", "Te apoyamos antes, durante y después del proyecto."],
];

function Index() {
  return (
    <>
      <section className="relative mx-auto max-w-5xl px-6 pt-20 pb-24 text-center">
        <div className="orb orb-primary -top-10 left-0 h-72 w-72" aria-hidden />
        <div className="orb orb-neon top-32 right-0 h-64 w-64 [animation-delay:-6s]" aria-hidden />

        <div className="reveal relative">
          <span className="eyebrow">Cartago · Valle del Cauca</span>
        </div>

        <div className="reveal relative mx-auto mt-10 w-full max-w-md [animation-delay:120ms]">
          <div className="float-slow glass scan overflow-hidden rounded-3xl p-2">
            <img src={logo.url} alt="" className="h-48 w-full rounded-2xl object-cover" />
          </div>
        </div>

        <h1 className="reveal relative mt-12 text-4xl leading-tight font-black md:text-6xl [animation-delay:240ms]">
          <span className="text-gradient">Transformamos ideas en soluciones digitales.</span>
        </h1>
        <p className="reveal relative mx-auto mt-6 max-w-2xl text-lg text-muted-foreground [animation-delay:360ms]">
          Impulsamos negocios mediante tecnología, desarrollo web y soluciones digitales diseñadas para crecer.
        </p>
        <div className="reveal relative mt-10 flex flex-wrap justify-center gap-4 [animation-delay:480ms]">
          <Link to="/servicios" className="btn-neon">Explorar servicios</Link>
          <Link to="/agendar" className="btn-ghost-neon">Agendar una cita</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-12 text-center">
          <span className="eyebrow">Por qué STRIV</span>
          <h2 className="mt-4 text-2xl font-bold md:text-4xl">Tecnología que impulsa tu negocio</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map(([n, t, d], i) => (
            <div key={t} className="neon-card reveal rounded-2xl p-7" style={{ animationDelay: `${i * 120}ms` }}>
              <span className="font-display text-sm text-neon">{n}</span>
              <h3 className="mt-3 text-lg font-bold">{t}</h3>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
