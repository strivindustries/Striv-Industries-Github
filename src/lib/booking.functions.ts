import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { accessSchema, availabilitySchema, bookingSchema, rescheduleSchema, supportSchema } from './booking.schemas';
import { bookingError, checkBookingLimit, generateToken, hashToken, publicBookingClient } from './booking.server';
import type { AppointmentSummary } from './booking.types';

export const getServices = createServerFn({ method: 'GET' }).handler(async () => {
  const { data, error } = await publicBookingClient().from('services').select('*').eq('active', true).order('created_at');
  if (error) throw new Error('No se pudieron cargar los servicios.');
  return data ?? [];
});
export const getBusinessHours = createServerFn({ method: 'GET' }).handler(async () => {
  const { data, error } = await publicBookingClient().from('business_hours').select('*').order('day_of_week');
  if (error) throw new Error('No se pudieron cargar los horarios.');
  return data ?? [];
});
export const getBlockedDates = createServerFn({ method: 'GET' }).handler(async () => {
  const { data, error } = await publicBookingClient().rpc('get_blocked_dates');
  if (error) throw new Error('No se pudieron cargar las fechas bloqueadas.');
  return data ?? [];
});
export const getBookingSettings = createServerFn({ method: 'GET' }).handler(async () => {
  const { data, error } = await publicBookingClient().from('booking_settings').select('*').eq('id', true).single();
  if (error) throw new Error('No se pudo cargar la configuración de reservas.');
  return data;
});
export const getAvailability = createServerFn({ method: 'POST' }).inputValidator((d) => availabilitySchema.parse(d)).handler(async ({ data }) => {
  const { data: slots, error } = await publicBookingClient().rpc('public_availability', { p_service: data.service_id, p_date: data.date });
  if (error) throw new Error('No se pudieron consultar los horarios disponibles.');
  return slots ?? [];
});
export const createAppointment = createServerFn({ method: 'POST' }).inputValidator((d) => bookingSchema.parse(d)).handler(async ({ data }) => {
  await checkBookingLimit('create');
  const token = generateToken();
  const tokenHash = await hashToken(token);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: id, error } = await supabaseAdmin.rpc('submit_booking', { p_name: data.name, p_email: data.email, p_phone: data.phone, p_service: data.service_id, p_date: data.date, p_time: data.time, p_notes: data.notes, p_hash: tokenHash, p_token: token });
  if (error || !id) return { ok: false as const, error: bookingError(error) };
  return { ok: true as const, code: `${id}.${token}`, email: data.email, email_sent: false };
});
export const bookAppointment = createAppointment;

const summarySchema = z.object({ id: z.string().uuid(), service: z.string(), date: z.string(), start_time: z.string(), end_time: z.string(), status: z.string(), business_name: z.string() });
async function manage(data: z.infer<typeof accessSchema>, action: 'get' | 'cancel' | 'reschedule', date?: string, time?: string): Promise<AppointmentSummary> {
  await checkBookingLimit('manage');
  const [id, token] = data.code.split('.');
  if (!id || !token) throw new Error('El enlace de reserva no es válido.');
  const hash = await hashToken(token);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: result, error } = await supabaseAdmin.rpc('manage_appointment', { p_id: id, p_email: data.email, p_hash: hash, p_action: action, ...(date ? { p_date: date } : {}), ...(time ? { p_time: time } : {}) });
  if (error) throw new Error(error.code === '23P01' ? bookingError(error) : 'El enlace de reserva no es válido o esta cita ya no se puede modificar.');
  return summarySchema.parse(result);
}
export const getAppointment = createServerFn({ method: 'POST' }).inputValidator((d) => accessSchema.parse(d)).handler(({ data }) => manage(data, 'get'));
export const cancelAppointment = createServerFn({ method: 'POST' }).inputValidator((d) => accessSchema.parse(d)).handler(({ data }) => manage(data, 'cancel'));
export const rescheduleAppointment = createServerFn({ method: 'POST' }).inputValidator((d) => rescheduleSchema.parse(d)).handler(({ data }) => manage(data, 'reschedule', data.date, data.time));

export const sendSupportRequest = createServerFn({ method: 'POST' }).inputValidator((d) => supportSchema.parse(d)).handler(async ({ data }) => {
  await checkBookingLimit('support');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('support_requests').insert(data);
  if (error) throw new Error('No se pudo guardar tu mensaje. Intenta nuevamente.');
  return { ok: true, email_sent: false };
});