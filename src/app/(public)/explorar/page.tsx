import Link from "next/link";
import { Search, Heart, Bell, MapPin } from "lucide-react";

export default function ExplorarPage() {
  return (
    <div className="min-h-screen bg-brand-sand flex flex-col items-center justify-between px-4 py-10">
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center">

        {/* Top: brand */}
        <div className="w-full flex items-center justify-start mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center">
              <span className="text-white text-sm font-extrabold">P</span>
            </div>
            <span className="text-brand-teal font-bold text-lg">Perlapp</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-orange mb-5 shadow-[0_8px_24px_-8px_rgba(241,90,41,0.5)]">
            <Search className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-teal leading-tight mb-2">
            Descubre tu región
          </h1>
          <p className="text-sm text-brand-stone max-w-[280px] mx-auto leading-relaxed">
            Negocios locales, productos únicos y comercios de tu área que quizás no conocías.
          </p>
        </div>

        {/* Feature list */}
        <ul className="w-full flex flex-col gap-3 mb-10">
          {[
            { icon: Heart, text: "Guarda tus negocios favoritos" },
            { icon: Bell, text: "Recibe alertas de ofertas cercanas" },
            { icon: MapPin, text: "Explora el mapa de tu región" },
          ].map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-brand-sand-dark"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-brand-teal" />
              </div>
              <span className="text-sm text-brand-teal font-medium">{text}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/registro/comprador"
            className="w-full py-4 bg-brand-teal hover:bg-brand-teal-dark active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-[0_8px_24px_-8px_rgba(29,92,74,0.3)] transition-all duration-150 text-center"
          >
            Crear mi cuenta gratis
          </Link>

          <Link
            href="/explorar/mapa"
            className="w-full py-3.5 border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/5 active:scale-[0.98] font-semibold text-base rounded-2xl transition-all duration-150 text-center"
          >
            Explorar sin cuenta →
          </Link>
        </div>

        <p className="mt-6 text-sm text-brand-stone text-center">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-orange font-semibold hover:underline underline-offset-2">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
