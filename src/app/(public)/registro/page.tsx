import Link from "next/link";
import Image from "next/image";
import { Search, Store, ArrowRight } from "lucide-react";

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-[420px] mx-auto flex flex-col items-center">

        {/* Brand header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg overflow-hidden bg-white">
            <Image src="/logo.png" alt="Perlapp logo" width={80} height={80} priority />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-teal mb-1">
            Perlapp
          </h1>
          <p className="text-base font-semibold text-brand-teal/70 mb-1">
            Bienvenido
          </p>
          <p className="text-sm text-brand-stone max-w-[260px] mx-auto leading-snug">
            El marketplace de tu región — descubre negocios locales o registra el tuyo
          </p>
        </header>

        {/* Action cards */}
        <div className="w-full flex flex-col gap-3 mb-8">

          <Link
            href="/explorar"
            className="group w-full flex items-center gap-4 p-5 bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] text-brand-pearl rounded-2xl shadow-[0_8px_24px_-8px_rgba(241,90,41,0.4)] transition-all duration-150"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-white/20">
              <Search className="w-7 h-7 text-brand-pearl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold leading-tight mb-0.5">Quiero Comprar</p>
              <p className="text-sm text-white/75 leading-snug">
                Encuentra negocios cerca de ti que quizás aún no conoces
              </p>
            </div>
            <ArrowRight className="flex-shrink-0 w-5 h-5 text-white/60 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/registro/comerciante"
            className="group w-full flex items-center gap-4 p-5 bg-brand-teal hover:bg-brand-teal-dark active:scale-[0.98] text-brand-pearl rounded-2xl shadow-[0_8px_24px_-8px_rgba(29,92,74,0.3)] transition-all duration-150"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-white/15">
              <Store className="w-7 h-7 text-brand-pearl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold leading-tight mb-0.5">Quiero Vender</p>
              <p className="text-sm text-white/75 leading-snug">
                Registra tu negocio y llega a nuevos clientes en tu área
              </p>
            </div>
            <ArrowRight className="flex-shrink-0 w-5 h-5 text-white/60 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Footer */}
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
