import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/BookingForm";
import { ADDRESS, meta } from "@/lib/site";

export const Route = createFileRoute("/agendar")({
  head: () => ({ meta: meta("Agendar cita — STRIV INDUSTRIES", "Elige día y hora para tu cita. Lunes a sábado, 8:00 a 18:00, en Cartago.") }),
  component: Agendar,
});

function Agendar() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="reveal text-center">
        <span className="eyebrow">Reserva tu espacio</span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          <span className="text-gradient">Agenda tu cita</span>
        </h1>
      </div>
      <div className="glass reveal mt-10 rounded-2xl p-6 text-center [animation-delay:120ms]">
        <h2 className="text-sm font-bold tracking-[0.2em] text-neon uppercase">Horario de atención</h2>
        <p className="mt-2 text-muted-foreground">Lunes a sábado · 8:00 a 12:00 y 14:00 a 18:00 (hora Colombia)</p>
      </div>
      <div className="glass reveal mt-6 rounded-3xl p-6 sm:p-8 [animation-delay:240ms]">
        <BookingForm />
      </div>
      <h2 className="mt-16 text-center text-2xl font-bold">Ubicación</h2>
      <p className="mt-2 text-center text-muted-foreground">{ADDRESS}</p>
      <div className="glass mt-6 overflow-hidden rounded-2xl p-1.5">
        <iframe
          title="Ubicación STRIV INDUSTRIES"
          src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
          className="h-72 w-full rounded-xl"
          loading="lazy"
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block text-center text-sm text-neon hover:underline"
      >
        Abrir en Google Maps
      </a>
    </section>
  );
}
