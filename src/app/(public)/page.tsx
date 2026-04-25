import Link from "next/link";
import { Zap, Sun, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[420px] mx-auto flex flex-col items-center">

        {/* Brand header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-teal mb-4 shadow-lg">
            <span className="text-brand-pearl text-2xl font-bold">N</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-teal mb-1">
            Nauta
          </h1>
          <p className="text-lg font-semibold text-brand-teal/80 mb-1">
            Bienvenido
          </p>
          <p className="text-sm text-brand-stone">
            ¿Qué te gustaría hacer hoy?
          </p>
        </header>

        {/* Action cards */}
        <div className="w-full flex flex-col gap-3 mb-8">

          {/* Comprar — Primary CTA */}
          <Link
            href="/comprar"
            className="group w-full flex items-center gap-4 p-5 bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] text-brand-pearl rounded-2xl shadow-[0_8px_24px_-8px_rgba(241,90,41,0.45)] transition-all duration-150"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-white/20">
              <Zap className="w-7 h-7 text-brand-pearl fill-brand-pearl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold leading-tight mb-0.5">
                Quiero Comprar
              </p>
              <p className="text-sm text-white/75 leading-snug">
                Explora energía limpia y únete a la red costera
              </p>
            </div>
            <ArrowRight className="flex-shrink-0 w-5 h-5 text-white/60 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Vender — Secondary CTA */}
          <Link
            href="/vender"
            className="group w-full flex items-center gap-4 p-5 bg-brand-teal hover:bg-brand-teal-dark active:scale-[0.98] text-brand-pearl rounded-2xl shadow-[0_8px_24px_-8px_rgba(29,92,74,0.35)] transition-all duration-150"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-white/15">
              <Sun className="w-7 h-7 text-brand-pearl fill-brand-pearl/30" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold leading-tight mb-0.5">
                Quiero Vender
              </p>
              <p className="text-sm text-white/75 leading-snug">
                Ofrece tu excedente y gestiona tu cartera
              </p>
            </div>
            <ArrowRight className="flex-shrink-0 w-5 h-5 text-white/60 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Footer login link */}
        <p className="text-sm text-brand-stone text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-brand-orange font-semibold hover:underline underline-offset-2"
          >
            Iniciar sesión
          </Link>
        </p>

      </main>
    </div>
  );
}
