import { createFileRoute } from "@tanstack/react-router";
import { EMAIL, INSTAGRAM, WHATSAPP, WHATSAPP_DISPLAY, meta } from "@/lib/site";

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: meta("Contáctanos — STRIV INDUSTRIES", "Escríbenos por Instagram, WhatsApp o correo.") }),
  component: Contacto,
});

const channels: [string, string, string | null][] = [
  ["Instagram", "@strivindustries", INSTAGRAM],
  ["WhatsApp", WHATSAPP_DISPLAY, `https://wa.me/${WHATSAPP}`],
  ["Correo", EMAIL, `mailto:${EMAIL}`],
  ["TikTok", "Muy pronto", null],
  ["Facebook", "Muy pronto", null],
];

function Contacto() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="reveal mb-14 text-center">
        <span className="eyebrow">Conecta con nosotros</span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          <span className="text-gradient">Contáctanos</span>
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {channels.map(([name, value, href], i) =>
          href ? (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="neon-card reveal rounded-2xl p-7"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <h2 className="text-lg font-bold text-neon">{name}</h2>
              <p className="mt-2 text-muted-foreground">{value}</p>
            </a>
          ) : (
            <div key={name} className="glass reveal rounded-2xl p-7 opacity-50" style={{ animationDelay: `${i * 90}ms` }}>
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="mt-2 text-muted-foreground">{value}</p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
