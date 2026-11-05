import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/striv-logo.jpg.asset.json";

const links = [
  ["Inicio", "/"],
  ["Servicios", "/servicios"],
  ["Ayuda y soporte", "/ayuda"],
  ["Contáctanos", "/contacto"],
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-cyber relative flex min-h-screen flex-col overflow-x-hidden text-foreground">
      <div className="grid-overlay" aria-hidden />
      <header className="sticky top-3 z-20 mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-6xl">
        <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-2">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="STRIV INDUSTRIES" className="pulse-glow h-10 w-10 rounded-full object-cover" />
            <span className="hidden font-display text-sm font-bold tracking-[0.3em] sm:inline">STRIV</span>
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm text-muted-foreground">
            {links.map(([t, h]) => (
              <Link
                key={h}
                to={h}
                className="rounded-full px-3 py-1.5 transition hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-neon" }}
                activeOptions={{ exact: true }}
              >
                {t}
              </Link>
            ))}
          </nav>
          <Link to="/agendar" className="btn-neon !px-5 !py-2 text-sm">
            Agendar una cita
          </Link>
        </div>
      </header>
      <main className="relative z-10 flex-1">{children}</main>
      <footer className="relative z-10 mt-10">
        <div className="neon-line mx-auto max-w-6xl" />
        <p className="py-8 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} STRIV INDUSTRIES · Technology. Innovation. Digital Solutions.
        </p>
      </footer>
    </div>
  );
}
