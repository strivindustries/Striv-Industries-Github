import { createFileRoute, Link } from "@tanstack/react-router";
import { meta, services } from "@/lib/site";

export const Route = createFileRoute("/servicios")({
  head: () => ({ meta: meta("Servicios — STRIV INDUSTRIES", "Diseño web, tiendas virtuales, mantenimiento web y automatizaciones para tu negocio.") }),
  component: Servicios,
});

function Servicios() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="reveal mb-14 text-center">
        <span className="eyebrow">Lo que hacemos</span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          <span className="text-gradient">Nuestros servicios</span>
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {services.map(([t, d], i) => (
          <div key={t} className="neon-card reveal rounded-2xl p-8" style={{ animationDelay: `${i * 100}ms` }}>
            <span className="font-display text-xs tracking-[0.3em] text-neon">0{i + 1}</span>
            <h2 className="mt-3 text-xl font-bold">{t}</h2>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link to="/agendar" className="btn-neon">Agendar una cita</Link>
      </div>
    </section>
  );
}
