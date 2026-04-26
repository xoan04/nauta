"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Lock, Check, Eye, EyeOff } from "lucide-react";
import { HttpError } from "@/core/http";
import { registerPublicBuyerUseCase } from "@/core/use-cases/buyer/register-public-buyer.use-case";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const TOTAL_STEPS = 3;

const STEP_META = [
  {
    icon: User,
    label: "Nombre",
    title: "¿Cómo te llamas?",
    hint: "Así te mostraremos en tu perfil",
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

export default function BuyerRegistrationPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const current = STEP_META[step - 1];

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (step === 1 && data.name.trim().length < 2) {
      next.name = "Ingresa al menos 2 caracteres";
    }
    if (step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "Ingresa un correo válido";
    }
    if (step === 3) {
      if (data.password.length < 8) next.password = "Mínimo 8 caracteres";
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
      setSubmitError(null);
      try {
        await registerPublicBuyerUseCase({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        setSubmitted(true);
      } catch (e) {
        if (e instanceof HttpError) {
          setSubmitError(e.message);
        } else if (e instanceof Error && e.message) {
          setSubmitError(e.message);
        } else {
          setSubmitError("No se pudo completar el registro. Revisa tu conexión e inténtalo de nuevo.");
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    setSubmitError(null);
    setStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-sand flex flex-col items-center justify-center px-4 text-center gap-5">
        <div className="w-20 h-20 rounded-full bg-brand-orange flex items-center justify-center shadow-lg">
          <Check className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-1">
            ¡Bienvenido, {data.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-brand-stone max-w-[280px] mx-auto">
            Tu cuenta está lista. Empieza a descubrir negocios cerca de ti.
          </p>
        </div>
        <Link
          href="/explorar/mapa"
          className="mt-2 px-6 py-3 bg-brand-orange text-white font-semibold rounded-xl text-sm hover:bg-brand-orange-dark transition-colors"
        >
          Empezar a explorar →
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
            href="/explorar"
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
        <div className="flex justify-between max-w-[160px]">
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
                    <StepIcon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-brand-stone"}`} />
                  )}
                </div>
                <span className={`text-[10px] font-medium ${active ? "text-brand-teal" : "text-brand-stone"}`}>
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
          <h1 className="text-2xl font-bold text-brand-teal leading-tight mb-1">{current.title}</h1>
          <p className="text-sm text-brand-stone">{current.hint}</p>
        </div>

        {step === 1 && (
          <div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => {
                setData((d) => ({ ...d, name: e.target.value }));
                if (errors.name) setErrors({});
              }}
              placeholder="Tu nombre"
              className={inputClass}
              autoFocus
              autoComplete="name"
              maxLength={60}
            />
            {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
          </div>
        )}

        {step === 2 && (
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
            {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}
          </div>
        )}

        {step === 3 && (
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
              {errors.password && <p className="mt-2 text-sm text-destructive">{errors.password}</p>}
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

      {/* CTA */}
      <div className="px-4 pb-10 pt-6">
        {submitError ? (
          <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {submitError}
          </p>
        ) : null}
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
            <Link href="/login" className="text-brand-orange font-semibold hover:underline underline-offset-2">
              Inicia sesión
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
