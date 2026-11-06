import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Introduce tu nombre.").max(100),
  email: z.string().trim().email("Introduce un correo válido.").max(255),
  phone: z.string().trim().max(30).optional().default(""),
  service: z.string().trim().min(1, "Selecciona un servicio.").max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida."),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida."),
  message: z.string().trim().max(1000).optional().default(""),
});

function createAuthenticatedSupabaseClient() {
  const url =
  process.env["SUPABASE_URL"] ??
  process.env["VITE_SUPABASE_URL"];

const key =
  process.env["SUPABASE_PUBLISHABLE_KEY"] ??
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) {
    throw new Error("La conexión con la base de datos no está configurada.");
  }

  const request = getRequest();
  const authorization = request?.headers.get("authorization");

  console.log(
  "☁️ Cloudflare runtime:",
  (request as any).runtime?.cloudflare
);

  if (!authorization) {
    throw new Error(
      "No se encontró la sesión. Recarga la página e intenta nuevamente."
    );
  }

  return createClient(url, key, {
    global: {
      headers: {
        Authorization: authorization,
      },
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        headers.set("Authorization", authorization);

        return fetch(input, {
          ...init,
          headers,
        });
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const bookAppointment = createServerFn({ method: "POST" })
  .inputValidator((input) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createAuthenticatedSupabaseClient();

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        name: data.name,
        email: data.email,
        service: data.service,
        date: data.date,
        time: data.time,
        status: "pendiente",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creando appointment:", error);

      if (error.code === "23505") {
        throw new Error(
          "Ese horario ya está ocupado. Selecciona otro horario."
        );
      }

      throw new Error(
        "No se pudo guardar la cita. Intenta nuevamente."
      );
    }

    return {
      ok: true,
      id: appointment.id,
    };
  });

type SupportInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export const sendSupportRequest = createServerFn({ method: "POST" })
  .inputValidator((input: SupportInput) => {
    const name = String(input.name ?? "").trim();
    const email = String(input.email ?? "").trim();
    const phone = String(input.phone ?? "").trim();
    const message = String(input.message ?? "").trim();

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(
        "Nombre, correo y mensaje son obligatorios."
      );
    }

    return {
      name,
      email,
      phone,
      message,
    };
  })
  .handler(async ({ data }) => {
    console.log("Solicitud de soporte:", data);

    return {
      ok: true,
    };
  });
