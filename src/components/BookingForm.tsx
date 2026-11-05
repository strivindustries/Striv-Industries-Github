import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { bookAppointment } from "@/lib/booking.functions";
import { field, services, WHATSAPP, HOURS } from "@/lib/site";

export function BookingForm() {
  const book = useServerFn(bookAppointment);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | string>("idle");
  const [waLink, setWaLink] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      await book({ data: f as never });
      const text = `Hola STRIV, agendé una cita:\nNombre: ${f["name"]}\nServicio: ${f["service"]}\nFecha: ${f["date"]} a las ${f["time"]}\nTeléfono: ${f["phone"] || "-"}\nCorreo: ${f["email"]}\n${f["message"] ? `Mensaje: ${f["message"]}` : ""}`;
      setWaLink(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`);
      form.reset();
      setStatus("ok");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Error al agendar.");
    }
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input name="name" required placeholder="Nombre" className={field} />
      <input name="email" type="email" required placeholder="Correo" className={field} />
      <input name="phone" placeholder="Teléfono" className={field} />
      <select name="service" className={field}>
        {services.map(([t]) => <option key={t}>{t}</option>)}
      </select>
      <input name="date" type="date" required min={new Date().toISOString().slice(0, 10)} className={field} />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {HOURS.map((h) => (
          <label key={h} className="cursor-pointer">
            <input type="radio" name="time" value={h} required className="peer sr-only" />
            <span className="slot-neon">
              {h}
            </span>
          </label>
        ))}
      </div>
      <textarea name="message" rows={3} placeholder="Cuéntanos tu proyecto" className={field} />
      <button disabled={status === "sending"} className="btn-neon mt-2 w-full">
        {status === "sending" ? "Agendando..." : "Agendar cita"}
      </button>
      {status === "ok" && (
        <div className="grid gap-3 text-center">
          <p className="text-neon text-glow">¡Cita agendada! Revisa tu correo.</p>
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-ghost-neon w-full">
            Confirmar por WhatsApp
          </a>
        </div>
      )}
      {status !== "idle" && status !== "ok" && status !== "sending" && <p className="text-center text-destructive">{status}</p>}
    </form>
  );
}
