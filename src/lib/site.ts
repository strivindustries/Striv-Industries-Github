export const WHATSAPP = "573203862211";
export const WHATSAPP_DISPLAY = "320 386 2211";
export const EMAIL = "strivindustries@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/strivindustries/";
export const ADDRESS = "Cra 2 #45-13, Santana, Cartago, Valle del Cauca, Colombia";

export const field = "field-neon";


export const meta = (title: string, description: string) => [
  { title },
  { name: "description", content: description },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
];

export const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export const services = [
  ["Diseño y desarrollo web", "Creamos sitios web modernos, rápidos y adaptados a las necesidades de tu negocio."],
  ["Tiendas virtuales", "Desarrollamos tiendas online para que puedas mostrar y vender tus productos."],
  ["Mantenimiento web", "Mantenemos tu sitio actualizado, funcional y disponible."],
  ["Automatizaciones y sistemas", "Creamos soluciones digitales y automatizaciones para optimizar procesos de tu negocio."],
] as const;
