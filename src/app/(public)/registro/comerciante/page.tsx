"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Mail, Lock, Check, Eye, EyeOff } from "lucide-react";
import type { LocationValue } from "@/components/map-picker";
import { registerMerchant } from "@/lib/mock-merchant";

const MapPicker = dynamic(() => import("@/components/map-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] bg-brand-sand-dark rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-sm text-brand-stone">Cargando mapa…</p>
    </div>
  ),
});

type FormData = {
  businessName: string;
  location: LocationValue | null;
  email: string;
  password: string;
  confirmPassword: string;
};

const TOTAL_STEPS = 4;

const STEP_META = [
  {
    icon: Building2,
    label: "Negocio",
    title: "¿Cómo se llama tu negocio?",
    hint: "Este será el nombre visible en Perlapp",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    title: "¿Dónde está tu negocio?",
    hint: "Usa tu ubicación o toca el mapa para marcar el punto exacto",
  },
  {
    icon: Mail,
    label: "Correo",
    title: "¿Cuál es tu correo?",
    hint: "Lo usarás para iniciar sesión",
  },
  {
    icon: Lock,
    label: "Contraseña",
    title: "Crea tu contraseña",
    hint: "Mínimo 8 caracteres",
  },
] as const;

const inputClass =
  "w-full px-4 py-4 text-base bg-white border-2 border-brand-sand-dark focus:border-brand-teal rounded-xl outline-none transition-colors text-brand-teal placeholder:text-brand-stone/50";

export default function MerchantRegistrationPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    businessName: "",
    location: null,
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const current = STEP_META[step - 1];

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (step === 1 && data.businessName.trim().length < 2) {
      next.businessName = "El nombre debe tener al menos 2 caracteres";
    }
    if (step === 2 && !data.location) {
      next.location = "Selecciona la ubicación de tu negocio en el mapa";
    }
    if (step === 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "Ingresa un correo electrónico válido";
    }
    if (step === 4) {
      if (data.password.length < 8)
        next.password = "Mínimo 8 caracteres";
      else if (data.password !== data.confirmPassword)
        next.confirmPassword = "Las contraseñas no coinciden";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setSubmitting(true);
      await registerMerchant({
        businessName: data.businessName,
        location: data.location!,
        email: data.email,
        password: data.password,
      });
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-sand flex flex-col items-center justify-center px-4 text-center gap-5">
        <div className="w-20 h-20 rounded-full bg-brand-teal flex items-center justify-center shadow-lg">
          <Check className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-1">¡Listo, {data.businessName}!</h1>
          <p className="text-sm text-brand-stone max-w-[280px] mx-auto">
            Tu negocio ha sido registrado. Pronto podrás gestionar tu perfil en Perlapp.
          </p>
        </div>
        <Link
          href="/"
          className="mt-2 px-6 py-3 bg-brand-orange text-white font-semibold rounded-xl text-sm hover:bg-brand-orange-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-sand flex flex-col">

      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-10 pb-3">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-brand-sand-dark transition-colors -ml-2 flex-shrink-0"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-brand-teal" />
          </button>
        ) : (
          <Link
            href="/registro"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-brand-sand-dark transition-colors -ml-2 flex-shrink-0"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-brand-teal" />
          </Link>
        )}
        <span className="text-sm text-brand-stone font-medium">
          Paso {step} de {TOTAL_STEPS}
        </span>
      </header>

      {/* Progress */}
      <div className="px-4 mb-7">
        <div className="h-1.5 bg-brand-sand-dark rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-brand-orange rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <div className="flex justify-between">
          {STEP_META.map((s, i) => {
            const StepIcon = s.icon;
            const done = i + 1 < step;
            const active = i + 1 === step;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    done
                      ? "bg-brand-orange"
                      : active
                      ? "bg-brand-teal ring-2 ring-brand-teal/30"
                      : "bg-brand-sand-dark"
                  }`}
                >
                  {done ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <StepIcon
                      className={`w-3.5 h-3.5 ${active ? "text-white" : "text-brand-stone"}`}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-brand-teal" : "text-brand-stone"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brand-teal leading-tight mb-1">
            {current.title}
          </h1>
          <p className="text-sm text-brand-stone">{current.hint}</p>
        </div>

        {/* Step 1 — Business name */}
        {step === 1 && (
          <div>
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => {
                setData((d) => ({ ...d, businessName: e.target.value }));
                if (errors.businessName) setErrors({});
              }}
              placeholder="Ej. Tienda El Pelícano"
              className={inputClass}
              autoFocus
              maxLength={80}
            />
            {errors.businessName && (
              <p className="mt-2 text-sm text-destructive">{errors.businessName}</p>
            )}
          </div>
        )}

        {/* Step 2 — Location map */}
        {step === 2 && (
          <div>
            <MapPicker
              value={data.location}
              onChange={(loc) => {
                setData((d) => ({ ...d, location: loc }));
                if (errors.location) setErrors({});
              }}
            />
            {errors.location && (
              <p className="mt-2 text-sm text-destructive">{errors.location}</p>
            )}
          </div>
        )}

        {/* Step 3 — Email */}
        {step === 3 && (
          <div>
            <input
              type="email"
              value={data.email}
              onChange={(e) => {
                setData((d) => ({ ...d, email: e.target.value }));
                if (errors.email) setErrors({});
              }}
              placeholder="tu@correo.com"
              className={inputClass}
              autoFocus
              autoComplete="email"
              inputMode="email"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        )}

        {/* Step 4 — Password */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => {
                  setData((d) => ({ ...d, password: e.target.value }));
                  if (errors.password) setErrors({});
                }}
                placeholder="Contraseña"
                className={`${inputClass} pr-12`}
                autoFocus
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-stone hover:text-brand-teal transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={data.confirmPassword}
                onChange={(e) => {
                  setData((d) => ({ ...d, confirmPassword: e.target.value }));
                  if (errors.confirmPassword) setErrors({});
                }}
                placeholder="Confirmar contraseña"
                className={`${inputClass} pr-12`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-stone hover:text-brand-teal transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA sticky footer */}
      <div className="px-4 pb-10 pt-6">
        <button
          onClick={handleNext}
          disabled={submitting}
          className="w-full py-4 bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-[0_8px_24px_-8px_rgba(241,90,41,0.4)] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creando cuenta…
            </span>
          ) : step === TOTAL_STEPS ? (
            "Crear cuenta"
          ) : (
            "Continuar"
          )}
        </button>
        {step === 1 && (
          <p className="text-center text-sm text-brand-stone mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-brand-orange font-semibold hover:underline underline-offset-2"
            >
              Inicia sesión
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
