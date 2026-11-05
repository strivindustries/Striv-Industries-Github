import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { sendSupportRequest } from "@/lib/booking.functions";
import { EMAIL, WHATSAPP, WHATSAPP_DISPLAY, field, meta } from "@/lib/site";

export const Route = createFileRoute("/ayuda")({
  head: () => ({ meta: meta("Ayuda y soporte — STRIV INDUSTRIES", "Escríbenos tu problema o pregunta y te respondemos pronto.") }),
  component: Ayuda,
});

function Ayuda() {
  const send = useServerFn(sendSupportRequest);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | string>("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      await send({ data: f as never });
      form.reset();
      setStatus("ok");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "No se pudo enviar.");
    }
  }
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="reveal text-center">
        <span className="eyebrow">Estamos para ayudarte</span>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          <span className="text-gradient">Ayuda y soporte</span>
        </h1>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="neon-card rounded-2xl p-6">
          <h2 className="font-bold text-neon">WhatsApp</h2>
          <p className="text-muted-foreground">{WHATSAPP_DISPLAY}</p>
        </a>
        <a href={`mailto:${EMAIL}`} className="neon-card rounded-2xl p-6">
          <h2 className="font-bold text-neon">Correo</h2>
          <p className="text-muted-foreground">{EMAIL}</p>
        </a>
      </div>

      <h2 className="mt-12 text-center text-2xl font-bold">Escríbenos</h2>
      <form onSubmit={onSubmit} className="glass mt-6 grid gap-4 rounded-3xl p-6 sm:p-8">
        <input name="name" required placeholder="Nombre" className={field} />
        <input name="email" type="email" required placeholder="Correo" className={field} />
        <input name="phone" placeholder="Teléfono" className={field} />
        <textarea name="message" required rows={5} placeholder="¿En qué te podemos ayudar?" className={field} />
        <button disabled={status === "sending"} className="btn-neon mt-2 w-full">
          {status === "sending" ? "Enviando..." : "Enviar"}
        </button>
        {status === "ok" && <p className="text-center text-neon text-glow">¡Mensaje enviado! Te responderemos pronto.</p>}
        {status !== "idle" && status !== "ok" && status !== "sending" && <p className="text-center text-destructive">{status}</p>}
      </form>

      <h2 className="mt-12 mb-4 text-center text-2xl font-bold">Preguntas frecuentes</h2>
      {[
        ["¿Cómo agendo una cita?", "Ve a “Agendar una cita”, elige el día y uno de los horarios disponibles."],
        ["¿Cuál es el horario de atención?", "Lunes a sábado de 8:00 a 18:00 (hora Colombia)."],
        ["¿Ya tengo un proyecto y necesito soporte?", "Escríbenos con el formulario de arriba y cuéntanos el problema."],
      ].map(([q, a]) => (
        <details key={q} className="glass mb-3 rounded-2xl p-5 transition open:shadow-[var(--glow-primary)]">
          <summary className="cursor-pointer font-semibold marker:text-neon">{q}</summary>
          <p className="mt-2 text-muted-foreground">{a}</p>
        </details>
      ))}
    </section>
  );
}
