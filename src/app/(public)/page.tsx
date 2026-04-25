import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <main className="w-full max-w-[420px] mx-auto flex flex-col items-center text-center gap-6">

        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-lg overflow-hidden bg-white">
          <Image src="/logo.png" alt="Perlapp" width={96} height={96} priority />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-teal mb-2">
            Perlapp
          </h1>
          <p className="text-sm text-brand-stone max-w-[260px] mx-auto leading-relaxed">
            El marketplace social de tu región — descubre, compra y vende con los negocios locales que te rodean
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <Link
            href="/registro"
            className="w-full py-4 bg-brand-orange hover:bg-brand-orange-dark active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-[0_8px_24px_-8px_rgba(241,90,41,0.4)] transition-all duration-150 text-center"
          >
            Comenzar
          </Link>
          <Link
            href="/login"
            className="w-full py-3 text-brand-teal font-semibold text-sm hover:underline underline-offset-2 text-center"
          >
            Ya tengo una cuenta
          </Link>
        </div>

      </main>
    </div>
  );
}
