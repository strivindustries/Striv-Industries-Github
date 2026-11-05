import { createServerFn } from "@tanstack/react-start";

type Booking = { name: string; email: string; phone: string; service: string; date: string; time: string; message: string };

const b64 = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const hdr = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

async function gw(service: string, path: string, key: string, init?: RequestInit) {
  const res = await fetch(`https://connector-gateway.lovable.dev/${service}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env['LOVABLE_API_KEY']}`,
      "X-Connection-Api-Key": key,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const t = await res.text();
    console.error(`${service} ${path} [${res.status}]: ${t}`);
    throw new Error("No se pudo completar la reserva. Intenta de nuevo.");
  }
  return res.json();
}

export const bookAppointment = createServerFn({ method: "POST" })
  .inputValidator((d: Booking) => {
    const s = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
    const out = { name: s(d.name, 100), email: s(d.email, 150), phone: s(d.phone, 30), service: s(d.service, 80), date: s(d.date, 10), time: s(d.time, 5), message: s(d.message, 1000) };
    if (!out.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) throw new Error("Nombre y correo válidos son obligatorios.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(out.date) || !/^\d{2}:\d{2}$/.test(out.time)) throw new Error("Fecha u hora inválida.");
    return out;
  })
  .handler(async ({ data }) => {
    const cal = process.env['GOOGLE_CALENDAR_API_KEY']!;
    const mail = process.env['GOOGLE_MAIL_API_KEY']!;
    const start = `${data.date}T${data.time}:00-05:00`;
    const end = new Date(new Date(start).getTime() + 3600000).toISOString();
    const details = `Cliente: ${data.name}\nCorreo: ${data.email}\nTeléfono: ${data.phone}\nServicio: ${data.service}\nMensaje: ${data.message}`;

    await gw("google_calendar", "/calendar/v3/calendars/primary/events", cal, {
      method: "POST",
      body: JSON.stringify({
        summary: `Cita STRIV: ${data.name} — ${data.service}`,
        description: details,
        start: { dateTime: start, timeZone: "America/Bogota" },
        end: { dateTime: end, timeZone: "America/Bogota" },
      }),
    });

    const profile = await gw("google_mail", "/gmail/v1/users/me/profile", mail);
    const send = (to: string, subject: string, body: string) =>
      gw("google_mail", "/gmail/v1/users/me/messages/send", mail, {
        method: "POST",
        body: JSON.stringify({
          raw: b64([`To: ${to}`, `Subject: ${hdr(subject)}`, "MIME-Version: 1.0", 'Content-Type: text/plain; charset="UTF-8"', "", body].join("\r\n"))
            .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
        }),
      });

    const when = `${data.date} a las ${data.time} (hora Colombia)`;
    await send(profile.emailAddress, `Nueva cita: ${data.name}`, `Nueva cita agendada para ${when}.\n\n${details}`);
    await send(data.email, "Tu cita con STRIV INDUSTRIES", `Hola ${data.name},\n\nTu cita quedó agendada para ${when}.\nServicio: ${data.service}\n\nTe contactaremos pronto.\n\nSTRIV INDUSTRIES`);
    return { ok: true };
  });

type Support = { name: string; email: string; phone: string; message: string };

export const sendSupportRequest = createServerFn({ method: "POST" })
  .inputValidator((d: Support) => {
    const s = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
    const out = { name: s(d.name, 100), email: s(d.email, 150), phone: s(d.phone, 30), message: s(d.message, 2000) };
    if (!out.name || !out.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) throw new Error("Nombre, correo y mensaje son obligatorios.");
    return out;
  })
  .handler(async ({ data }) => {
    const mail = process.env['GOOGLE_MAIL_API_KEY']!;
    const raw = b64([
      "To: strivindustries@gmail.com",
      `Reply-To: ${data.email}`,
      `Subject: ${hdr(`Soporte: ${data.name}`)}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      `Nombre: ${data.name}\nCorreo: ${data.email}\nTeléfono: ${data.phone || "-"}\n\n${data.message}`,
    ].join("\r\n")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    await gw("google_mail", "/gmail/v1/users/me/messages/send", mail, { method: "POST", body: JSON.stringify({ raw }) });
    return { ok: true };
  });
