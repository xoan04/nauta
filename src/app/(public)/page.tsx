import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="text-muted-foreground text-balance">
          Aplicación de demostración con Next.js 14, App Router y arquitectura Model → Service → Use Case → Hook →
          View. Conecta con APIs externas y estado local con autenticación de prueba.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link href="/login">Ir al inicio de sesión</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
