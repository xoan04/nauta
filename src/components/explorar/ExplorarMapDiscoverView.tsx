"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  Briefcase,
  Factory,
  HelpCircle,
  Home,
  LayoutGrid,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Navigation,
  Package,
  Palette,
  Search,
  ShoppingCart,
  Sprout,
  Star,
  Truck,
  User,
  Utensils,
  X,
  Zap,
} from "lucide-react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { PublicMerchantListItem } from "@/core/models/public-merchants-list.model";
import { useEconomicSectors } from "@/hooks/use-economic-sectors";
import { useExplorarMerchants } from "@/hooks/use-explorar-merchants";
import { MERCHANT_MAP_CENTER } from "@/lib/explorar-map.mock";
import { cartItemCount } from "@/lib/cart.utils";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { getProfileHrefForRole, usePerlappRoleStore } from "@/store/perlapp-role.store";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const merchantMarkerIcon = L.divIcon({
  className: "explorar-merchant-marker",
  html: `<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:50%;border:3px solid #1D5C4A;box-shadow:0 4px 14px rgba(0,0,0,.12)">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D5C4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
      <path d="M2 7h20"/>
    </svg>
  </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

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

function getMerchantDisplayName(merchant: PublicMerchantListItem): string {
  const b = merchant.businesses[0]?.business;
  return b?.business_name?.trim() || b?.nombre?.trim() || b?.name?.trim() || merchant.user.name;
}

function getMerchantDescription(merchant: PublicMerchantListItem): string {
  const b = merchant.businesses[0]?.business;
  return b?.description?.trim() || b?.descripcion?.trim() || "";
}

function getMerchantVerified(merchant: PublicMerchantListItem): boolean {
  const b = merchant.businesses[0]?.business;
  return Boolean(b?.is_verified || b?.verified || b?.verificado);
}

type MerchantPin = {
  merchant: PublicMerchantListItem;
  lat: number;
  lng: number;
  categoryCode: string;
  categoryName: string;
};

function toMerchantPins(merchants: PublicMerchantListItem[]): MerchantPin[] {
  return merchants
    .map((merchant) => {
      const lat = merchant.profile_merchant?.latitude;
      const lng = merchant.profile_merchant?.longitude;
      if (lat == null || lng == null) return null;
      return {
        merchant,
        lat,
        lng,
        categoryCode: merchant.businesses[0]?.business_category?.code ?? "GENERAL",
        categoryName: merchant.businesses[0]?.business_category?.name ?? "General",
      };
    })
    .filter((p): p is MerchantPin => p !== null);
}

function MerchantDetailModal({
  merchant,
  categoryName,
  profileHref,
  onClose,
}: {
  merchant: PublicMerchantListItem;
  categoryName: string;
  profileHref: string;
  onClose: () => void;
}) {
  const business = merchant.businesses[0]?.business;
  const displayName = getMerchantDisplayName(merchant);
  const description = getMerchantDescription(merchant);
  const bioShort = description
    ? description.length > 180
      ? `${description.slice(0, 177).trim()}…`
      : description
    : "Comercio registrado en Perlapp.";

  const locationLabel =
    merchant.businesses[0]?.municipality?.name ??
    merchant.profile_merchant?.municipality_name ??
    "Santa Marta, Magdalena";

  const avatarUrl =
    business?.profile_photo_url ??
    merchant.profile_merchant?.photo ??
    "/logo.png";

  const bannerUrl =
    business?.banner_photo_url ??
    merchant.profile_merchant?.photo_banner ??
    "https://picsum.photos/seed/default-banner/800/200";

  const isVerified = getMerchantVerified(merchant);
  const productCount = (merchant.products as unknown[]).length;
  const postCount = (merchant.posts as unknown[]).length;

  const stageLabel = (business as any)?.stage
    ? (business as any).stage
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase())
    : null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-teal/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <article className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40 active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Banner */}
        <div className="relative h-36 w-full overflow-hidden">
          <Image src={bannerUrl} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute left-6 bottom-4 flex flex-col gap-1">
            <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-md ring-1 ring-white/30">
              {categoryName}
            </span>
            {stageLabel && (
              <span className="inline-flex w-fit items-center rounded-full bg-brand-orange px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                {stageLabel}
              </span>
            )}
          </div>
        </div>

        <div className="relative px-6 pb-8 pt-5">
          {/* Avatar Overlap */}
          <div className="absolute -top-12 right-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-[4px] border-white bg-white shadow-xl">
              <Image src={avatarUrl} alt="" fill className="object-cover" sizes="96px" />
            </div>
          </div>

          <div className="pr-20">
            <div className="flex items-center gap-1.5 pt-1">
              <h3 className="line-clamp-1 text-xl font-extrabold leading-tight text-brand-teal">
                {displayName}
              </h3>
              {isVerified && (
                <BadgeCheck
                  className="h-5 w-5 shrink-0 text-brand-teal"
                  strokeWidth={2.8}
                  aria-label="Verificado"
                />
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-brand-stone/60">
              <span>@{merchant.user.name.toLowerCase().replace(/\s+/g, "")}</span>
              <span className="h-1 w-1 rounded-full bg-brand-stone/20" />
              <span className="text-[10px]">ID: {merchant.user.id.slice(0, 4)}</span>
            </p>
          </div>

          <p className="mt-6 text-[13px] leading-relaxed text-brand-teal/70">
            {bioShort}
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-brand-stone">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-sand">
              <MapPin className="h-3.5 w-3.5 text-brand-orange" />
            </div>
            <span className="line-clamp-1">{locationLabel}</span>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-8 rounded-2xl bg-brand-sand/40 p-4 border border-brand-sand-dark/20">
              <div className="flex flex-col items-center">
                <div className="mb-1 flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-brand-orange" />
                  <span className="text-lg font-black text-brand-teal leading-none">
                    {productCount}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-brand-stone uppercase tracking-widest">
                  Productos
                </span>
              </div>
              <div className="h-8 w-[1px] bg-brand-sand-dark/30" />
              <div className="flex flex-col items-center">
                <div className="mb-1 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-brand-orange" />
                  <span className="text-lg font-black text-brand-teal leading-none">
                    {postCount}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-brand-stone uppercase tracking-widest">
                  Publicaciones
                </span>
              </div>
            </div>

            <Link
              href={profileHref}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand-orange text-sm font-black text-white shadow-[0_12px_24px_-8px_rgba(241,90,41,0.5)] transition-all hover:bg-brand-orange-dark active:scale-[0.98]"
            >
              Ver perfil y ofertas
              <Search className="ml-2 h-4 w-4" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ExplorarMapDiscoverView() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = usePerlappRoleStore((s) => s.role);
  const profileHref = getProfileHrefForRole(role);
  const itemCount = useCartStore((s) => cartItemCount(s.items));
  const openDrawer = useCartStore((s) => s.openDrawer);

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const geoRequested = useRef(false);
  const [locating, setLocating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantPin | null>(null);

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

  const { data, isPending } = useExplorarMerchants(userPos?.lat, userPos?.lng);

  const allPins = useMemo(() => toMerchantPins(data?.merchants ?? []), [data?.merchants]);

  const { data: sectorsData, isLoading: isLoadingSectors } = useEconomicSectors();

  const SECTOR_ICONS: Record<string, any> = {
    all: LayoutGrid,
    campo_cultivos: Sprout,
    transporte_envios: Truck,
    comida_hospedaje: Utensils,
    oficinas_apoyo_negocios: Briefcase,
    arte_deporte_diversion: Palette,
    fabricas_creacion_productos: Factory,
    otros: MoreHorizontal,
  };

  const sectors = useMemo(() => {
    return sectorsData?.sectors ?? [];
  }, [sectorsData]);

  const visiblePins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPins.filter((pin) => {
      // Si hay una categoría seleccionada, buscamos coincidencia parcial o total en el código
      // o inclusive en el nombre por si las moscas, pero priorizamos código.
      if (selectedCategory) {
        const pinCode = pin.categoryCode.toLowerCase();
        const selCode = selectedCategory.toLowerCase();
        
        // Mapeo simple de fallback si los códigos no coinciden exactamente entre APIs
        const isMatch = pinCode.includes(selCode) || selCode.includes(pinCode);
        if (!isMatch) return false;
      }
      
      if (!q) return true;
      return getMerchantDisplayName(pin.merchant).toLowerCase().includes(q);
    });
  }, [allPins, selectedCategory, searchQuery]);

  const isGuest = role === "invitado";

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

        {!isGuest && visiblePins.map((pin) => (
          <Marker
            key={pin.merchant.user.id}
            position={[pin.lat, pin.lng]}
            icon={merchantMarkerIcon}
            eventHandlers={{
              click: () => setSelectedMerchant(pin),
            }}
          />
        ))}
      </MapContainer>

      {/* Guest overlay */}
      {isGuest && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-3xl bg-white px-6 py-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-teal/10">
              <MapPin className="h-8 w-8 text-brand-teal" strokeWidth={1.5} />
            </div>
            <h2 className="mb-2 font-display text-xl font-bold text-brand-teal">
              ¿Quién está cerca de ti?
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-brand-stone">
              Regístrate para ver los comercios de tu zona en el mapa y encontrar lo que necesitas.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/registro/comprador"
                className="w-full rounded-2xl bg-brand-teal py-3.5 font-display text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(29,92,74,0.4)] transition hover:bg-brand-teal/90 active:scale-[0.98]"
              >
                Crear cuenta gratis
              </Link>
              <Link
                href="/login"
                className="w-full rounded-2xl border-2 border-brand-orange py-3 font-display text-sm font-semibold text-brand-orange transition hover:bg-brand-orange/5 active:scale-[0.98]"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}

      {locating && (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
          <p className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-brand-teal shadow-lg">
            Obteniendo tu ubicación…
          </p>
        </div>
      )}

      {/* Floating controls */}
      <div className="pointer-events-none absolute right-0 top-20 z-[500] flex flex-col items-end gap-2 p-4">
        <button
          type="button"
          onClick={requestLocation}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-teal shadow-[0_4px_16px_rgba(0,0,0,.12)] transition hover:bg-brand-sand"
          aria-label="Centrar en mi ubicación"
        >
          <Navigation className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setSearchOpen((v) => !v)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-teal shadow-[0_4px_16px_rgba(0,0,0,.12)] transition hover:bg-brand-sand"
          aria-label="Buscar comercio"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-[max(5rem,calc(env(safe-area-inset-top)+5rem))] z-[600] px-4">
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
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-stone hover:bg-brand-sand"
              aria-label="Cerrar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom unified panel */}
      <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-[500]">
        <div className="mx-auto max-w-lg rounded-t-3xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,.1)]">
          {/* Categories */}
          {!isGuest && (
            <div className="pb-6 pt-5">
              <div className="mb-4 px-6">
                <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-brand-teal/40">
                  Explorar Categorías
                </h2>
              </div>
              
              <div className="no-scrollbar flex gap-4 overflow-x-auto px-6 pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`group relative flex min-w-[84px] flex-col items-center gap-2.5 transition-all duration-300 active:scale-95`}
                >
                  <div 
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                      selectedCategory === null 
                        ? "border-brand-orange bg-brand-orange text-white shadow-[0_8px_20px_-6px_rgba(241,90,41,0.5)]" 
                        : "border-brand-sand-dark bg-brand-sand/50 text-brand-stone group-hover:border-brand-stone/30"
                    }`}
                  >
                    <LayoutGrid className={`${selectedCategory === null ? "h-7 w-7" : "h-6 w-6"} transition-all`} strokeWidth={2.5} />
                  </div>
                  <span className={`text-center text-[11px] font-bold tracking-tight transition-colors duration-300 ${
                    selectedCategory === null ? "text-brand-orange" : "text-brand-stone/80"
                  }`}>
                    Todos
                  </span>
                  {selectedCategory === null && (
                    <div className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  )}
                </button>

                {isLoadingSectors ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex min-w-[84px] flex-col items-center gap-2.5 animate-pulse">
                      <div className="h-16 w-16 rounded-2xl bg-brand-sand" />
                      <div className="h-3 w-12 rounded bg-brand-sand" />
                    </div>
                  ))
                ) : (
                  sectors.map((sector) => {
                    const Icon = SECTOR_ICONS[sector.code] || HelpCircle;
                    const isSelected = selectedCategory === sector.code;
                    return (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => setSelectedCategory(isSelected ? null : sector.code)}
                        className="group relative flex min-w-[84px] flex-col items-center gap-2.5 transition-all duration-300 active:scale-95"
                      >
                        <div 
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                            isSelected 
                              ? "border-brand-teal bg-brand-teal text-white shadow-[0_8px_20px_-6px_rgba(29,92,74,0.4)]" 
                              : "border-brand-sand-dark bg-brand-sand/50 text-brand-stone group-hover:border-brand-stone/30"
                          }`}
                        >
                          <Icon className={`${isSelected ? "h-7 w-7" : "h-6 w-6"} transition-all`} strokeWidth={2.2} />
                        </div>
                        <span className={`line-clamp-2 px-1 text-center text-[10px] font-bold leading-[1.3] transition-colors duration-300 ${
                          isSelected ? "text-brand-teal" : "text-brand-stone/80"
                        }`}>
                          {sector.name}
                        </span>
                        {isSelected && (
                          <div className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-brand-teal" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
              
              <div className="mt-4 px-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-sand-dark to-transparent" />
                  <p className="whitespace-nowrap text-[11px] font-bold text-brand-stone/60">
                    {visiblePins.length} comercio{visiblePins.length === 1 ? "" : "s"} encontrados
                  </p>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-sand-dark to-transparent" />
                </div>
              </div>
            </div>
          )}

          {/* Bottom nav */}
          <nav
            className="flex h-[4.25rem] items-center justify-between gap-0.5 border-t border-perlapp-divider px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1"
            aria-label="Navegación móvil"
          >
            <Link
              href="/"
              className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 font-display text-[10px] font-medium leading-tight text-perlapp-navMuted transition-all duration-100 hover:scale-[1.02] sm:text-[11px]"
            >
              <Home className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.25} />
              <span className="truncate">Inicio</span>
            </Link>
            <span className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-perlapp-orange/10 px-1 py-1 font-display text-[10px] font-medium leading-tight text-perlapp-orange sm:text-[11px]">
              <Search className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
              <span className="truncate">Explorar</span>
            </span>
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 font-display text-[10px] font-medium leading-tight text-perlapp-navMuted transition-all duration-100 hover:scale-[1.02] sm:text-[11px]"
              aria-label={itemCount > 0 ? `Abrir carrito, ${itemCount} artículos` : "Abrir carrito"}
            >
              {itemCount > 0 && (
                <span className="absolute right-[22%] top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-perlapp-orange px-0.5 font-display text-[9px] font-bold leading-none text-white sm:right-[26%]">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
              <ShoppingCart className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
              <span className="truncate">Carrito</span>
            </button>
            <Link
              href="/notifications"
              className="relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 font-display text-[10px] font-medium leading-tight text-perlapp-navMuted transition-all duration-100 hover:scale-[1.02] sm:text-[11px]"
            >
              <Bell className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
              <span className="truncate">Alertas</span>
            </Link>
            {isAuthenticated ? (
              <Link
                href={profileHref}
                className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 font-display text-[10px] font-medium leading-tight text-perlapp-navMuted transition-all duration-100 hover:scale-[1.02] sm:text-[11px]"
              >
                <User className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
                <span className="truncate">Perfil</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1 font-display text-[10px] font-medium leading-tight text-perlapp-navMuted transition-all duration-100 hover:scale-[1.02] sm:text-[11px]"
                aria-label="Iniciar sesión"
              >
                <User className="mb-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} />
                <span className="truncate">Entrar</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Merchant Detail Modal */}
      {selectedMerchant && (
        <MerchantDetailModal
          merchant={selectedMerchant.merchant}
          categoryName={selectedMerchant.categoryName}
          profileHref={`/merchant/${selectedMerchant.merchant.user.id}`}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
    </div>
  );
}
