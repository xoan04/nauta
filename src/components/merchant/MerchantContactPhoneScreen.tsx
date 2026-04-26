"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMerchantProfileMerchantPhone } from "@/core/services/merchant-my-profile.service";
import { useAuthStore } from "@/store/auth.store";

export function MerchantContactPhoneScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [hydrated, setHydrated] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const t = useAuthStore.getState().token;
      if (!t) throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      await updateMerchantProfileMerchantPhone(t, phone);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["merchant-my-profile"] });
      router.push("/perfil");
    },
  });

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent("/merchant/contacto")}`);
    }
  }, [hydrated, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await mutateAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar. Intenta de nuevo.");
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-perlapp-canvas">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-perlapp-line border-t-perlapp-orange" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-perlapp-canvas px-4 text-center">
        <p className="font-display text-sm text-perlapp-inkMuted">Redirigiendo al inicio de sesión…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-perlapp-canvas">
      <div className="sticky top-0 z-10 border-b border-perlapp-line/30 bg-perlapp-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-xl items-center px-4 py-3">
          <Link
            href="/perfil"
            className="flex items-center gap-1 font-display text-sm text-perlapp-inkMuted transition-colors hover:text-perlapp-ink"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Tu perfil
          </Link>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-6">
        <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white">
          <p className="mb-1 font-display text-xs font-semibold uppercase tracking-widest text-white/70">
            Contacto del negocio
          </p>
          <h1 className="font-display text-2xl font-bold leading-tight">
            Deja tu teléfono y activa el catálogo
          </h1>
          <p className="mt-2 font-display text-sm text-white/85">
            Es el dato que faltaba para publicar productos: los clientes te escriben y llaman directo, sin pasos extra.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 font-display text-xs font-medium text-white/95 ring-1 ring-white/25">
            <Phone className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            <span>Se guarda en tu perfil público de comerciante</span>
          </div>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
          <div>
            <Label htmlFor="merchant-contact-phone" className="font-display text-sm font-semibold text-perlapp-ink">
              Teléfono de contacto del negocio
            </Label>
            <Input
              id="merchant-contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. 300 123 4567"
              required
              autoComplete="tel"
              className="mt-1.5"
            />
            <p className="mt-2 font-sans text-xs text-perlapp-inkMuted">
              Usa un número al que atiendas pedidos y mensajes (WhatsApp si aplica).
            </p>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 font-display text-sm text-red-700">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isPending || !phone.trim()}
            className="w-full bg-rose-600 font-display text-white hover:bg-rose-700"
          >
            {isPending ? "Guardando…" : "Guardar y volver al perfil"}
          </Button>
        </form>
      </main>
    </div>
  );
}
