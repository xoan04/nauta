"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth.store";
import { useMerchantGamification } from "@/hooks/use-merchant-gamification";
import {
  fetchEconomicSectors,
  fetchMunicipalities,
  completeStage1,
  completeStage2,
  completeStage3,
  completeStage4,
  completeStage5,
  type EconomicSector,
  type Municipality,
} from "@/core/services/merchant-gamification.service";
import { merchantGamificationQueryKey } from "@/hooks/use-merchant-gamification";
import { useQueryClient } from "@tanstack/react-query";

// ─── Stage 1: Identidad del negocio ───────────────────────────────────────────
// Para completar: business_name, works_alone, identification_type,
//                identification_number, photo?, photo_banner?

function Stage1({ token, onDone }: { token: string; onDone: () => void }) {
  const [businessName, setBusinessName] = useState("");
  const [worksAlone, setWorksAlone] = useState<boolean>(true);
  const [idType, setIdType] = useState("CC");
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [bannerName, setBannerName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await completeStage1({
        business_name: businessName,
        works_alone: worksAlone,
        identification_type: idType,
        identification_number: idNumber,
        photo: photoRef.current?.files?.[0] ?? null,
        photo_banner: bannerRef.current?.files?.[0] ?? null,
      }, token);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white">
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
          Empieza aquí
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight">
          Dale identidad a tu negocio
        </h2>
        <p className="mt-2 font-display text-sm text-white/85">
          Con tu perfil activo empiezas a aparecer en Perlapp y a conectar con compradores locales.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            ¿Cómo se llama tu negocio?
          </Label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Ej: Panadería La Samaria"
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            ¿Cómo operas?
          </Label>
          <div className="mt-2 flex gap-3">
            {[
              { value: true, label: "Solo", emoji: "🙋" },
              { value: false, label: "Con equipo", emoji: "👥" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setWorksAlone(opt.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 font-display text-sm font-semibold transition-all ${
                  worksAlone === opt.value
                    ? "border-orange-400 bg-orange-50 text-orange-700"
                    : "border-perlapp-line bg-perlapp-white text-perlapp-inkMuted"
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-28">
            <Label className="font-display text-sm font-semibold text-perlapp-ink">Documento</Label>
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-perlapp-line bg-perlapp-white px-3 py-2 font-display text-sm text-perlapp-ink focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {["CC", "NIT", "CE", "Pasaporte"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <Label className="font-display text-sm font-semibold text-perlapp-ink">Número</Label>
            <Input
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="123456789"
              required
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Foto del negocio", ref: photoRef, name: photoName, setName: setPhotoName, emoji: "📷" },
            { label: "Banner (opcional)", ref: bannerRef, name: bannerName, setName: setBannerName, emoji: "🖼️" },
          ].map((item) => (
            <div key={item.label}>
              <Label className="font-display text-sm font-semibold text-perlapp-ink">{item.label}</Label>
              <button
                type="button"
                onClick={() => item.ref.current?.click()}
                className="mt-1.5 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-perlapp-line bg-perlapp-surfaceContainer py-4 transition-colors hover:border-orange-400"
              >
                <span className="text-2xl">{item.name ? "✅" : item.emoji}</span>
                <span className="mt-1 max-w-full truncate px-2 font-display text-xs text-perlapp-inkMuted">
                  {item.name ?? "Subir imagen"}
                </span>
              </button>
              <input
                ref={item.ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => item.setName(e.target.files?.[0]?.name ?? null)}
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 font-display text-sm text-red-700">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 font-display text-white hover:bg-orange-600"
        >
          {loading ? "Guardando…" : "Crear mi perfil →"}
        </Button>
      </form>
    </>
  );
}

// ─── Stage 2: Actividad económica ─────────────────────────────────────────────
// Para completar: activity_description, economic_sector_ids[], ciiu_code=""

function Stage2({ token, onDone }: { token: string; onDone: () => void }) {
  const [description, setDescription] = useState("");
  const [sectors, setSectors] = useState<EconomicSector[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEconomicSectors(token)
      .then(setSectors)
      .catch(() => setSectors([]))
      .finally(() => setLoadingSectors(false));
  }, [token]);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await completeStage2({ activity_description: description, economic_sector_ids: selectedIds }, token);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
          Próximo paso
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight">
          Aparece donde te buscan
        </h2>
        <p className="mt-2 font-display text-sm text-white/85">
          Define tu actividad y sector para aparecer en los <strong>Comercios Destacados</strong> junto a negocios como el tuyo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            ¿Qué hace tu negocio?
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Fabricamos y vendemos pan artesanal hecho con ingredientes locales…"
            required
            className="mt-1.5 min-h-[90px] resize-none"
          />
        </div>

        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            ¿En qué sector está tu negocio?
          </Label>
          <p className="mb-2 mt-0.5 font-display text-xs text-perlapp-inkMuted">
            Selecciona todos los que apliquen
          </p>
          {loadingSectors ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-perlapp-line/40" />
              ))}
            </div>
          ) : sectors.length === 0 ? (
            <p className="font-display text-xs text-perlapp-inkMuted">No se pudieron cargar los sectores.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sectors.map((s) => {
                const sel = selectedIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggle(s.id)}
                    className={`rounded-full border-2 px-4 py-1.5 font-display text-sm font-medium transition-all ${
                      sel
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-perlapp-line bg-perlapp-white text-perlapp-inkMuted hover:border-blue-300"
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 font-display text-sm text-red-700">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading || selectedIds.length === 0 || !description.trim()}
          className="w-full bg-blue-600 font-display text-white hover:bg-blue-700"
        >
          {loading ? "Guardando…" : "Aparecer en Destacados →"}
        </Button>
      </form>
    </>
  );
}

// ─── Stage 3: Ubicación en el mapa ────────────────────────────────────────────
// Para completar: municipality_id, business_address

function Stage3({ token, onDone }: { token: string; onDone: () => void }) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [municipalityId, setMunicipalityId] = useState("");
  const [address, setAddress] = useState("");
  const [loadingMun, setLoadingMun] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMunicipalities()
      .then(setMunicipalities)
      .catch(() => setMunicipalities([]))
      .finally(() => setLoadingMun(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await completeStage3({ municipality_id: municipalityId, business_address: address }, token);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-6 text-white">
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
          Sé más visible
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight">
          Aparece destacado en el mapa
        </h2>
        <p className="mt-2 font-display text-sm text-white/85">
          Cuando alguien busque comercios cerca de ti, tu negocio aparecerá <strong>resaltado</strong> sobre los demás.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            ¿En qué municipio está tu negocio?
          </Label>
          {loadingMun ? (
            <div className="mt-1.5 h-10 w-full animate-pulse rounded-md bg-perlapp-line/40" />
          ) : (
            <select
              value={municipalityId}
              onChange={(e) => setMunicipalityId(e.target.value)}
              required
              className="mt-1.5 w-full rounded-md border border-perlapp-line bg-perlapp-white px-3 py-2 font-display text-sm text-perlapp-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Seleccionar municipio…</option>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            Dirección del negocio{" "}
            <span className="font-normal text-perlapp-inkMuted">(opcional)</span>
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej: Calle 10 #5-20, Barrio Centro"
            className="mt-1.5"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 font-display text-sm text-red-700">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading || !municipalityId}
          className="w-full bg-emerald-600 font-display text-white hover:bg-emerald-700"
        >
          {loading ? "Guardando…" : "Activar mi ubicación →"}
        </Button>
      </form>
    </>
  );
}

// ─── Stage 4: Datos financieros ───────────────────────────────────────────────
// Para completar: total_assets_value, annual_revenue, employee_count

function Stage4({ token, onDone }: { token: string; onDone: () => void }) {
  const [employees, setEmployees] = useState("");
  const [assets, setAssets] = useState("");
  const [revenue, setRevenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fmtCop = (val: string) => {
    const n = val.replace(/\D/g, "");
    return n ? Number(n).toLocaleString("es-CO") : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await completeStage4({
        employee_count: Number(employees),
        total_assets_value: Number(assets.replace(/\D/g, "")),
        annual_revenue: Number(revenue.replace(/\D/g, "")),
      }, token);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const EMP_OPTIONS = [
    { label: "Solo yo", value: "1" },
    { label: "2–3", value: "2" },
    { label: "4–9", value: "6" },
    { label: "10+", value: "10" },
  ];

  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
          Crece más
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight">
          Accede a financiamiento para tu empresa
        </h2>
        <p className="mt-2 font-display text-sm text-white/85">
          Con estos datos te conectamos con <strong>líneas de crédito y programas de apoyo</strong> disponibles para tu tipo de negocio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            ¿Cuántas personas trabajan en tu negocio?
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EMP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEmployees(opt.value)}
                className={`rounded-full border-2 px-5 py-2 font-display text-sm font-semibold transition-all ${
                  employees === opt.value
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-perlapp-line text-perlapp-inkMuted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            Valor total de activos del negocio (COP)
          </Label>
          <p className="mb-1.5 mt-0.5 font-display text-xs text-perlapp-inkMuted">
            Maquinaria, inventario, equipos, local…
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display text-sm text-perlapp-inkMuted">$</span>
            <Input
              value={assets}
              onChange={(e) => setAssets(fmtCop(e.target.value))}
              placeholder="15.000.000"
              className="pl-7"
              required
            />
          </div>
        </div>

        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            Ingresos anuales aproximados (COP)
          </Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display text-sm text-perlapp-inkMuted">$</span>
            <Input
              value={revenue}
              onChange={(e) => setRevenue(fmtCop(e.target.value))}
              placeholder="48.000.000"
              className="pl-7"
              required
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 font-display text-sm text-red-700">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading || !employees}
          className="w-full bg-purple-600 font-display text-white hover:bg-purple-700"
        >
          {loading ? "Guardando…" : "Activar mis beneficios →"}
        </Button>
      </form>
    </>
  );
}

// ─── Stage 5: Datos de contacto ───────────────────────────────────────────────
// Para completar: contact_phone, contact_email, wants_sales_or_financing_support

function Stage5({ token, onDone }: { token: string; onDone: () => void }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wantsSupport, setWantsSupport] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await completeStage5({
        contact_phone: phone,
        contact_email: email,
        wants_sales_or_financing_support: wantsSupport,
      }, token);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white">
        <p className="mb-1 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
          Conecta más
        </p>
        <h2 className="font-display text-2xl font-bold leading-tight">
          Que los clientes lleguen a ti
        </h2>
        <p className="mt-2 font-display text-sm text-white/85">
          Con tus datos de contacto visibles, los compradores y aliados pueden conectarse directamente contigo sin intermediarios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            Teléfono de contacto del negocio
          </Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="3001234567"
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            Email del negocio
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="minegocio@ejemplo.com"
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="font-display text-sm font-semibold text-perlapp-ink">
            ¿Quieres recibir apoyo para ventas y financiamiento?
          </Label>
          <div className="mt-2 flex gap-3">
            {[
              { value: true, label: "Sí, me interesa", emoji: "🚀" },
              { value: false, label: "Por ahora no", emoji: "👋" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setWantsSupport(opt.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 font-display text-sm font-semibold transition-all ${
                  wantsSupport === opt.value
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-perlapp-line bg-perlapp-white text-perlapp-inkMuted"
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 font-display text-sm text-red-700">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 font-display text-white hover:bg-rose-700"
        >
          {loading ? "Guardando…" : "Activar mis conexiones →"}
        </Button>
      </form>
    </>
  );
}

// ─── Pantalla final ────────────────────────────────────────────────────────────

function AllDoneScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-5xl shadow-xl">
        🏆
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold text-perlapp-ink">
          ¡Tu perfil está completo!
        </h2>
        <p className="mt-2 font-sans text-sm text-perlapp-inkMuted">
          Ahora estás en revisión para el reconocimiento máximo de Perlapp.
        </p>
        <div className="mt-4 rounded-2xl bg-amber-50 px-5 py-4 text-left">
          <p className="font-display text-sm font-semibold text-amber-900">
            ⭐ Samaria Pro Entrepreneur
          </p>
          <p className="mt-1 font-sans text-xs text-amber-800">
            Nuestro equipo revisará tu solicitud. Te notificaremos cuando seas aprobado y tu negocio sea reconocido como un Empresario Samario Pro.
          </p>
        </div>
      </div>
      <Button onClick={onClose} className="w-full bg-perlapp-orange font-display text-white hover:bg-perlapp-orange/90">
        Volver al inicio
      </Button>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function GamificationJourney() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const { data: gamification, isPending } = useMerchantGamification();

  const currentStage = gamification?.current_stage ?? 1;
  const allDone = gamification?.onboarding_completed ?? false;

  const handleDone = async () => {
    // Invalidate to refetch and get the updated current_stage
    await queryClient.invalidateQueries({ queryKey: merchantGamificationQueryKey });
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-perlapp-line border-t-perlapp-orange" />
          <p className="font-display text-sm text-perlapp-inkMuted">Un momento…</p>
        </div>
      </div>
    );
  }

  if (allDone || currentStage > 5) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <AllDoneScreen onClose={() => router.push("/")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-perlapp-canvas">
      {/* Header mínimo */}
      <div className="sticky top-0 z-10 border-b border-perlapp-line/30 bg-perlapp-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-xl items-center px-4 py-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 font-display text-sm text-perlapp-inkMuted transition-colors hover:text-perlapp-ink"
          >
            <ChevronLeft className="h-4 w-4" /> Inicio
          </button>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-6">
        {currentStage === 1 && token && <Stage1 token={token} onDone={handleDone} />}
        {currentStage === 2 && token && <Stage2 token={token} onDone={handleDone} />}
        {currentStage === 3 && token && <Stage3 token={token} onDone={handleDone} />}
        {currentStage === 4 && token && <Stage4 token={token} onDone={handleDone} />}
        {currentStage === 5 && token && <Stage5 token={token} onDone={handleDone} />}
      </main>
    </div>
  );
}
