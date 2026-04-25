"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons broken by webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const brandMarker = L.divIcon({
  html: `<div style="
    width:26px;height:26px;
    background:#F15A29;
    border:3px solid #FDFDFD;
    border-radius:50%;
    box-shadow:0 2px 10px rgba(241,90,41,0.55);
  "></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  className: "",
});

type LatLng = { lat: number; lng: number };
export type LocationValue = { lat: number; lng: number; address: string };

// Santa Marta, Colombia — fallback when geolocation fails
const FALLBACK_CENTER: LatLng = { lat: 11.2408, lng: -74.199 };

function ClickHandler({ onMove }: { onMove: (pos: LatLng) => void }) {
  useMapEvents({ click: (e) => onMove({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

// Only flies when center actually changes — avoids janky animation on first render
function FlyTo({ center }: { center: LatLng }) {
  const map = useMap();
  const prev = useRef(center);

  useEffect(() => {
    if (prev.current.lat === center.lat && prev.current.lng === center.lng) return;
    prev.current = center;
    map.flyTo([center.lat, center.lng], 16, { duration: 1.0 });
  }, [center.lat, center.lng, map]);

  return null;
}

type Props = {
  value: LocationValue | null;
  onChange: (val: LocationValue) => void;
};

export default function MapPicker({ value, onChange }: Props) {
  const initialCenter = value ? { lat: value.lat, lng: value.lng } : FALLBACK_CENTER;

  const [position, setPosition] = useState<LatLng>(initialCenter);
  const [flyTarget, setFlyTarget] = useState<LatLng>(initialCenter);
  const [address, setAddress] = useState(value?.address ?? "");
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState("");

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
      );
      const data = await res.json();
      return (data.display_name as string) ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const applyPosition = async (pos: LatLng) => {
    setPosition(pos);
    setFlyTarget(pos);
    setGeocoding(true);
    setGeoError("");
    const addr = await reverseGeocode(pos.lat, pos.lng);
    setAddress(addr);
    setGeocoding(false);
    onChange({ ...pos, address: addr });
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Tu navegador no soporta geolocalización. Toca el mapa para seleccionar.");
      return;
    }
    setLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        applyPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setGeoError("No se pudo obtener tu ubicación. Toca el mapa para seleccionarla.");
      },
      { timeout: 10000 }
    );
  };

  // Auto-request geolocation on mount (only when no value is pre-set)
  useEffect(() => {
    if (value) return;
    requestGeolocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = locating || geocoding;

  return (
    <div className="flex flex-col gap-3">
      {/* Geolocation button */}
      <button
        type="button"
        onClick={requestGeolocation}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-brand-teal text-brand-teal font-semibold rounded-xl hover:bg-brand-teal/5 active:bg-brand-teal/10 transition-colors disabled:opacity-60 text-sm"
      >
        {locating ? (
          <>
            <Spinner />
            Detectando tu ubicación…
          </>
        ) : (
          <>
            <span>📍</span>
            {address ? "Volver a mi ubicación actual" : "Usar mi ubicación actual"}
          </>
        )}
      </button>

      <p className="text-xs text-brand-stone text-center">
        o toca el mapa para marcar el punto exacto
      </p>

      {/* Map */}
      <div
        className="rounded-2xl overflow-hidden border-2 border-brand-sand-dark relative"
        style={{ height: 250 }}
      >
        <MapContainer
          center={[initialCenter.lat, initialCenter.lng]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onMove={applyPosition} />
          <FlyTo center={flyTarget} />
          <Marker position={[position.lat, position.lng]} icon={brandMarker} />
        </MapContainer>

        {/* Overlay while locating */}
        {locating && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-[1000]">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-brand-teal">Detectando tu ubicación…</p>
          </div>
        )}
      </div>

      {geoError && (
        <p className="text-xs text-destructive text-center">{geoError}</p>
      )}

      {/* Selected address */}
      {geocoding && (
        <div className="flex gap-2 items-center bg-white px-4 py-3 rounded-xl border border-brand-sand-dark">
          <Spinner />
          <p className="text-sm text-brand-stone">Buscando dirección…</p>
        </div>
      )}
      {address && !geocoding && (
        <div className="flex gap-2 items-start bg-white px-4 py-3 rounded-xl border border-brand-sand-dark">
          <span className="text-brand-orange flex-shrink-0 mt-0.5">📌</span>
          <p className="text-sm text-brand-teal leading-snug">{address}</p>
        </div>
      )}
    </div>
  );
}

function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-8 h-8 border-3" : "w-4 h-4 border-2";
  return (
    <div
      className={`${cls} border-brand-teal border-t-transparent rounded-full animate-spin flex-shrink-0`}
    />
  );
}
