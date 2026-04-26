import Link from "next/link";

export default function MerchantNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-perlapp-canvas px-6 text-center">
      <h1 className="font-display text-perlapp-headline-md text-perlapp-ink">Comercio no encontrado</h1>
      <p className="max-w-sm text-perlapp-inkMuted">
        No hay un perfil público con ese identificador. Revisa la URL o vuelve al inicio.
      </p>
      <Link
        href="/"
        className="rounded-full bg-perlapp-orange px-6 py-2 font-display text-sm font-semibold text-white hover:bg-perlapp-orange/90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
