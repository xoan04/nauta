/** Categorías de servicio para el mapa de exploración (demo). */
export type MerchantMapCategory = "plomeria" | "electricidad" | "limpieza" | "carpinteria";

export const MERCHANT_MAP_CATEGORIES: { id: MerchantMapCategory; label: string }[] = [
  { id: "plomeria", label: "Plomería" },
  { id: "electricidad", label: "Electricidad" },
  { id: "limpieza", label: "Limpieza" },
  { id: "carpinteria", label: "Carpintería" },
];

export type MerchantMapPin = {
  merchantId: string;
  lat: number;
  lng: number;
  category: MerchantMapCategory;
};

/** Centro por defecto (Santa Marta, CO) — alineado con el mapa de registro. */
export const MERCHANT_MAP_CENTER = { lat: 11.2408, lng: -74.199 };

export const MERCHANT_MAP_PINS: MerchantMapPin[] = [
  { merchantId: "1", lat: 11.2432, lng: -74.2025, category: "plomeria" },
  { merchantId: "ecovolt", lat: 11.2375, lng: -74.1955, category: "electricidad" },
  { merchantId: "2", lat: 11.241, lng: -74.1928, category: "limpieza" },
  { merchantId: "3", lat: 11.2368, lng: -74.204, category: "carpinteria" },
  { merchantId: "4", lat: 11.2455, lng: -74.1972, category: "plomeria" },
  { merchantId: "me", lat: 11.244, lng: -74.198, category: "electricidad" },
];
