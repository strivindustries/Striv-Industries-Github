import { createClient } from '@supabase/supabase-js';
import { getRequestHeader } from '@tanstack/react-start/server';
import type { Database } from '@/integrations/supabase/types';

export function publicBookingClient() {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('La conexión de reservas no está configurada.');
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
    headers.set('apikey', key);
    return fetch(input, { ...init, headers });
  } } });
}

export async function hashToken(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function checkBookingLimit(action: string, identity = '') {
  const ip = getRequestHeader('cf-connecting-ip') || getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const key = await hashToken(`${action}:${ip}:${identity}`);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data, error } = await supabaseAdmin.rpc('booking_rate_limit', { p_key: key });
  if (error || !data) throw new Error('Demasiados intentos. Intenta nuevamente más tarde.');
}

export function bookingError(error: { code?: string; message?: string } | null) {
  if (error?.code === '23P01') return 'Este horario acaba de ser ocupado. Por favor selecciona otro.';
  return 'No se pudo completar la solicitud. Intenta nuevamente.';
}