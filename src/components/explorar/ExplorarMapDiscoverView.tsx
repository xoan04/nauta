"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Hammer,
  MapPin,
  Menu,
  Navigation,
  Search,
  Sparkles,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getMerchantProfileById, merchantProfilePath } from "@/lib/merchant-profile.mock";
import {
  MERCHANT_MAP_CENTER,
  MERCHANT_MAP_CATEGORIES,
  MERCHANT_MAP_PINS,
  type MerchantMapCategory,
} from "@/lib/explorar-map.mock";
import type { MerchantProfileData } from "@/lib/merchant-profile.types";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MARKER_SVGS: Record<MerchantMapCategory, string> = {
  plomeria: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  electricidad: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  limpieza: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  carpinteria: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.5v-1a2 2 0 0 0-2-2h-1a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2h-2.272a2 2 0 0 0-1.789 1.106L9 6.5"/></svg>`,
};

const categoryIconCache = new Map<MerchantMapCategory, L.DivIcon>();

function categoryMarkerIcon(category: MerchantMapCategory): L.DivIcon {
  const cached = categoryIconCache.get(category);
  if (cached) return cached;
  const svg = MARKER_SVGS[category];
  const icon = L.divIcon({
    className: "explorar-cat-marker",
    html: `<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:50%;border:3px solid #1D5C4A;box-shadow:0 4px 14px rgba(0,0,0,.12)">${svg}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
  categoryIconCache.set(category, icon);
  return icon;
}

const userMarkerIcon = L.divIcon({
  className: "explorar-user-marker",
  html: `<div style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;pointer-events:none">
    <div style="position:absolute;width:42px;height:42px;border-radius:50%;background:rgba(29,92,74,0.28);"></div>
    <div style="position:relative;width:30px;height:30px;border-radius:50%;background:#1D5C4A;border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 21v-1a6 6 0 0 1 6-6 6 6 0 0 1 6 6v1"/></svg>
    </div>
  </div>`,
  iconSize: [52, 52],
  iconAnchor: [26, 26],
});

function FlyTo({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  const prev = useRef(center);

  useEffect(() => {
    if (prev.current.lat === center.lat && prev.current.lng === center.lng) return;
    prev.current = center;
    map.flyTo([center.lat, center.lng], zoom, { duration: 0.9 });
  }, [center, zoom, map]);

  return null;
}

const CATEGORY_ICONS: Record<MerchantMapCategory, typeof Wrench> = {
  plomeria: Wrench,
  electricidad: Zap,
  limpieza: Sparkles,
  carpinteria: Hammer,
};

function mapServiceCategoryLabel(id: MerchantMapCategory): string {
  return MERCHANT_MAP_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function ExplorarMerchantPopup({
  merchant,
  mapCategory,
  profileHref,
}: {
  merchant: MerchantProfileData;
  mapCategory: MerchantMapCategory;
  profileHref: string;
}) {
  const serviceLabel = mapServiceCategoryLabel(mapCategory);
  const bioShort =
    merchant.bio.length > 128 ? `${merchant.bio.slice(0, 125).trim()}…` : merchant.bio;

  return (
    <article className="merchant-popup-card w-[min(268px,calc(100vw-3.25rem))]">
      <div className="flex gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-brand-sand-dark bg-brand-sand shadow-sm ring-2 ring-white">
          <Image
            src={merchant.avatarUrl}
            alt=""
            width={56}
            height={56}
            className="h-full w-full object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1">
            <h3 className="text-[15px] font-bold leading-snug text-brand-teal">{merchant.displayName}</h3>
            {merchant.verified ? (
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" strokeWidth={2.2} aria-label="Verificado" />
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-[11px] font-medium text-brand-stone">{merchant.handle}</p>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-lg border border-brand-teal/35 bg-brand-teal/[0.08] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
          {serviceLabel}
        </span>
        <span className="inline-flex max-w-full items-center rounded-lg border border-brand-sand-dark bg-white px-2 py-1 text-[10px] font-medium leading-tight text-brand-stone">
          <span className="truncate">{merchant.categoryLabel}</span>
        </span>
      </div>

      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-brand-teal/90">{bioShort}</p>

      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-brand-stone">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" aria-hidden />
        <span>{merchant.location}</span>
      </p>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-brand-sand-dark pt-3">
        <div className="min-w-0">
          <p className="text-sm font-bold tabular-nums text-brand-teal">{merchant.followersCount}</p>
          <p className="text-[10px] font-medium text-brand-stone">seguidores</p>
        </div>
        <Link
          href={profileHref}
          className="shrink-0 rounded-xl bg-brand-orange px-4 py-2.5 text-center text-xs font-bold text-white shadow-[0_6px_16px_-4px_rgba(241,90,41,0.5)] transition hover:bg-brand-orange-dark active:scale-[0.98]"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}

export default function ExplorarMapDiscoverView() {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const geoRequested = useRef(false);
  const [locating, setLocating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MerchantMapCategory>("plomeria");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mapCenter = userPos ?? MERCHANT_MAP_CENTER;

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setUserPos((p) => p ?? MERCHANT_MAP_CENTER);
      },
      { timeout: 12_000, maximumAge: 60_000 }
    );
  }, []);

  useEffect(() => {
    if (geoRequested.current) return;
    geoRequested.current = true;
    requestLocation();
  }, [requestLocation]);

  const visiblePins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MERCHANT_MAP_PINS.filter((pin) => {
      if (pin.category !== selectedCategory) return false;
      if (!q) return true;
      const m = getMerchantProfileById(pin.merchantId);
      const name = m?.displayName?.toLowerCase() ?? "";
      const handle = m?.handle?.toLowerCase() ?? "";
      return name.includes(q) || handle.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-brand-sand">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={14}
        className="absolute inset-0 z-0 h-full w-full"
        zoomControl={false}
        scrollWheelZoom
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo center={mapCenter} zoom={userPos ? 15 : 14} />

        <Marker position={[mapCenter.lat, mapCenter.lng]} icon={userMarkerIcon} zIndexOffset={1000}>
          <Popup>
            <span className="text-sm font-medium text-brand-teal">Tu ubicación</span>
          </Popup>
        </Marker>

        {visiblePins.map((pin) => {
          const merchant = getMerchantProfileById(pin.merchantId);
          const profileHref = merchantProfilePath(merchant?.id ?? pin.merchantId);
          return (
            <Marker
              key={`${pin.merchantId}-${pin.lat}-${pin.lng}`}
              position={[pin.lat, pin.lng]}
              icon={categoryMarkerIcon(pin.category)}
            >
              <Popup
                className="explorar-map-merchant-leaflet-popup"
                minWidth={288}
                maxWidth={320}
                offset={[0, 6]}
                autoPanPadding={[48, 120]}
                keepInView
              >
                {merchant ? (
                  <ExplorarMerchantPopup
                    merchant={merchant}
                    mapCategory={pin.category}
                    profileHref={profileHref}
                  />
                ) : (
                  <div className="max-w-[240px] space-y-2 py-0.5">
                    <p className="text-sm font-semibold text-brand-teal">{pin.merchantId}</p>
                    <p className="text-xs text-brand-stone">No hay ficha pública para este punto.</p>
                    <Link href={profileHref} className="inline-block text-xs font-bold text-brand-orange hover:underline">
                      Intentar abrir perfil →
                    </Link>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {locating && (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
          <p className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-brand-teal shadow-lg">
            Obteniendo tu ubicación…
          </p>
        </div>
      )}

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-[500] flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-teal shadow-[0_4px_16px_rgba(0,0,0,.12)] transition hover:bg-brand-sand"
          aria-label="Ir al inicio"
        >
          <Menu className="h-5 w-5" />
        </Link>
        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              requestLocation();
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-teal shadow-[0_4px_16px_rgba(0,0,0,.12)] transition hover:bg-brand-sand"
            aria-label="Centrar en mi ubicación"
          >
            <Navigation className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-teal shadow-[0_4px_16px_rgba(0,0,0,.12)] transition hover:bg-brand-sand"
            aria-label="Buscar comercio"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-[max(4.5rem,env(safe-area-inset-top)+3rem)] z-[600] px-4">
          <div className="mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-brand-sand-dark bg-white px-3 py-2 shadow-lg">
            <Search className="h-4 w-4 shrink-0 text-brand-stone" aria-hidden />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre…"
              className="min-w-0 flex-1 bg-transparent text-sm text-brand-teal outline-none placeholder:text-brand-stone/60"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-stone hover:bg-brand-sand"
              aria-label="Cerrar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[500] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto mx-auto max-w-lg rounded-t-3xl bg-white px-4 pb-5 pt-4 shadow-[0_-8px_32px_rgba(0,0,0,.1)]">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-stone">
            ¿Qué necesitas?
          </p>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 pt-0.5">
            {MERCHANT_MAP_CATEGORIES.map(({ id, label }) => {
              const Icon = CATEGORY_ICONS[id];
              const active = selectedCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedCategory(id)}
                  className={`flex min-w-[76px] flex-shrink-0 flex-col items-center gap-2 rounded-2xl border-2 px-2 py-3 transition ${
                    active
                      ? "border-brand-teal bg-brand-teal/10 shadow-sm"
                      : "border-transparent bg-brand-sand/80 hover:border-brand-sand-dark"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      active ? "bg-white text-brand-teal" : "bg-white text-brand-stone"
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <span
                    className={`text-center text-[11px] font-semibold leading-tight ${
                      active ? "text-brand-teal" : "text-brand-stone"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-brand-stone">
            {visiblePins.length === 0
              ? "No hay comercios en esta categoría con ese filtro."
              : `${visiblePins.length} comercio${visiblePins.length === 1 ? "" : "s"} en el mapa`}
          </p>
        </div>
      </div>
    </div>
  );
}
