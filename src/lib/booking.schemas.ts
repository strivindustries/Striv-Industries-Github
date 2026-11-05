import { z } from 'zod';

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida.').refine((s) => {
  const d = new Date(`${s}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}, 'Fecha inválida.');
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida.');
export const customerSchema = z.object({
  name: z.string().trim().min(1, 'Introduce tu nombre.').max(100),
  email: z.string().trim().email('Introduce un correo válido.').max(255).transform((s) => s.toLowerCase()),
  phone: z.string().trim().min(7, 'Introduce un teléfono válido.').max(30).regex(/^[+\d\s()-]+$/, 'Introduce un teléfono válido.'),
});
export const availabilitySchema = z.object({ service_id: z.string().uuid(), date: dateSchema });
export const bookingSchema = customerSchema.extend({ service_id: z.string().uuid('Selecciona un servicio.'), date: dateSchema, time: timeSchema, notes: z.string().trim().max(2000).default(''), website: z.string().max(0).default('') });
export const accessSchema = z.object({ email: customerSchema.shape.email, code: z.string().trim().regex(/^[a-f0-9-]{36}\.[a-f0-9]{64}$/, 'El enlace de reserva no es válido.') });
export const rescheduleSchema = accessSchema.extend({ date: dateSchema, time: timeSchema });
export const supportSchema = z.object({ name: customerSchema.shape.name, email: customerSchema.shape.email, phone: z.string().trim().max(30).default(''), message: z.string().trim().min(1, 'Introduce tu mensaje.').max(2000) });
export type BookingInput = z.infer<typeof bookingSchema>;

export function colombiaToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}