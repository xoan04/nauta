"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HttpError } from "@/core/http";
import { loginUseCase } from "@/core/use-cases/auth/login.use-case";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(1, "Introduce la contraseña"),
});

type LoginForm = z.infer<typeof loginSchema>;

type WelcomeScreenProps = {
  onGuest: () => void;
};

export function WelcomeScreen({ onGuest }: WelcomeScreenProps) {
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginFromApi = useAuthStore((s) => s.loginFromApi);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setAuthError("");
    try {
      const data = await loginUseCase({ email: values.email.trim(), password: values.password });
      loginFromApi(data);
    } catch (e) {
      if (e instanceof HttpError) {
        setAuthError(e.message);
      } else if (e instanceof Error && e.message) {
        setAuthError(e.message);
      } else {
        setAuthError("No se pudo iniciar sesión. Revisa tu conexión e inténtalo de nuevo.");
      }
    }
  });

  const inputClass =
    "w-full px-4 py-4 text-base bg-white border-2 border-brand-sand-dark focus:border-brand-teal rounded-xl outline-none transition-colors text-brand-teal placeholder:text-brand-stone/50";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Branding */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg overflow-hidden bg-white">
            <Image src="/logo.png" alt="Perlapp logo" width={80} height={80} priority />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-teal mb-1">
            Perlapp
          </h1>
          <p className="text-brand-stone text-base">
            Descubre comercios locales cerca de ti
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {authError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
              {authError}
            </p>
          )}

          <div>
            <input
              type="email"
              autoComplete="email"
              placeholder="Correo electrónico"
              className={inputClass}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Contraseña"
              className={`${inputClass} pr-12`}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-stone hover:text-brand-teal transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full py-4 bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-[0_8px_24px_-8px_rgba(241,90,41,0.4)] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entrando…
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-sand-dark" />
          <span className="text-xs text-brand-stone font-medium">o</span>
          <div className="flex-1 h-px bg-brand-sand-dark" />
        </div>

        {/* Soy nuevo */}
        <Link
          href="/registro"
          className="w-full py-4 border-2 border-brand-teal text-brand-teal font-bold text-base rounded-2xl text-center transition-all duration-150 hover:bg-brand-teal/5 active:scale-[0.98]"
        >
          Soy nuevo — Crear cuenta
        </Link>

        {/* Invitado */}
        <button
          type="button"
          onClick={onGuest}
          className="w-full py-3 text-brand-stone font-semibold text-sm rounded-2xl transition-all duration-150 hover:text-brand-teal hover:bg-brand-sand-dark active:scale-[0.98]"
        >
          Entrar como invitado
        </button>

        <p className="text-center text-xs text-brand-stone/60 pt-2">
          Al continuar aceptas nuestros términos y política de privacidad.
        </p>
      </div>
    </div>
  );
}
