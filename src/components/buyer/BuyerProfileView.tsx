"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Store } from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PerlappBottomNav } from "@/components/home/PerlappBottomNav";
import { PerlappHomeHeader } from "@/components/home/PerlappHomeHeader";
import { MerchantProfileView } from "@/components/merchant/MerchantProfileView";
import { Button } from "@/components/ui/button";
import { getMyMerchantProfileUseCase } from "@/core/use-cases/merchant/get-my-merchant-profile.use-case";
import { getMerchantProfileById, merchantProfilePath } from "@/lib/merchant-profile.mock";
import { RECENT_POSTS } from "@/lib/perlapp-home.constants";
import { useAuthStore } from "@/store/auth.store";
import { useBuyerActivityStore } from "@/store/buyer-activity.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

type TabKey = "actividad" | "favoritos";

export function BuyerProfileView() {
  const role = usePerlappRoleStore((s) => s.role);
  const authToken = useAuthStore((s) => s.token);
  const [tab, setTab] = useState<TabKey>("actividad");

  const favoriteMerchantIds = useBuyerActivityStore((s) => s.favoriteMerchantIds);
  const interactedPostIds = useBuyerActivityStore((s) => s.interactedPostIds);
  const {
    data: myMerchantProfile,
    isLoading: isLoadingMyMerchantProfile,
    isError: isErrorMyMerchantProfile,
  } = useQuery({
    queryKey: ["merchant-my-profile"],
    queryFn: () => getMyMerchantProfileUseCase(authToken ?? ""),
    enabled: role === "market" && Boolean(authToken),
  });

  const postsWithInteraction = RECENT_POSTS.filter((p) => interactedPostIds.includes(p.id));
  const favoriteMerchants = favoriteMerchantIds
    .map((id) => getMerchantProfileById(id))
    .filter(Boolean);

  if (role === "market") {
    if (isLoadingMyMerchantProfile) {
      return (
        <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink md:pb-0">
          <PerlappHomeHeader />
          <main className="mx-auto max-w-2xl px-perlapp-margin-mobile pb-perlapp-lg pt-24 md:px-perlapp-margin-desktop">
            <p className="text-sm text-perlapp-inkMuted">Cargando tu perfil…</p>
          </main>
          <PerlappBottomNav activeTab="profile" />
          <CartDrawer />
        </div>
      );
    }

    if (isErrorMyMerchantProfile || !myMerchantProfile) {
      return (
        <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink md:pb-0">
          <PerlappHomeHeader />
          <main className="mx-auto max-w-2xl px-perlapp-margin-mobile pb-perlapp-lg pt-24 md:px-perlapp-margin-desktop">
            <p className="text-sm text-red-600">
              No se pudo cargar tu perfil de comercio. Intenta recargar la página.
            </p>
          </main>
          <PerlappBottomNav activeTab="profile" />
          <CartDrawer />
        </div>
      );
    }

    return <MerchantProfileView merchant={myMerchantProfile.profile} />;
  }

  if (role === "invitado") {
    return (
      <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink md:pb-0">
        <PerlappHomeHeader />
        <main className="mx-auto max-w-2xl px-perlapp-margin-mobile pb-perlapp-lg pt-24 md:px-perlapp-margin-desktop">
          <p className="font-display text-perlapp-headline-md text-perlapp-ink">Tu perfil</p>
          <p className="mt-2 text-perlapp-inkMuted">
            Como <strong>invitado</strong> este espacio es solo informativo: no hay favoritos, historial
            de compras ni otras interacciones guardadas en el perfil.
          </p>
          <p className="mt-3 text-sm text-perlapp-inkMuted">
            Para comprar, marcar comercios favoritos y ver tu actividad,{" "}
            <Link href="/login" className="font-semibold text-perlapp-orange underline underline-offset-2">
              inicia sesión
            </Link>{" "}
            con una cuenta de comprador.
          </p>
          <Button asChild className="mt-6 bg-perlapp-orange text-white hover:bg-perlapp-orange/90">
            <Link href="/login">Ir a iniciar sesión</Link>
          </Button>
        </main>
        <PerlappBottomNav activeTab="profile" />
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink antialiased md:pb-0">
      <PerlappHomeHeader />

      <main className="mx-auto w-full max-w-2xl border-x border-perlapp-line/30 bg-perlapp-white pt-20">
        <header className="border-b border-perlapp-line/50 px-4 py-6">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-perlapp-surfaceContainer text-perlapp-orange">
              <Sparkles className="h-7 w-7" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-perlapp-headline-md font-bold text-perlapp-ink">Tu perfil</h1>
              <p className="mt-1 font-display text-perlapp-label-sm text-perlapp-inkMuted">
                Comprador · compras (carrito), favoritos y publicaciones con las que interactúas
              </p>
            </div>
          </div>
        </header>

        <div className="flex border-b border-perlapp-line/50 bg-perlapp-white/90 backdrop-blur-md">
          {(
            [
              { id: "actividad" as const, label: "Actividad" },
              { id: "favoritos" as const, label: "Favoritos" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              className="relative flex-1 py-3 font-display text-perlapp-label-md transition-colors hover:bg-perlapp-surfaceVariant/30"
              onClick={() => setTab(t.id)}
            >
              <span
                className={
                  tab === t.id ? "font-bold text-perlapp-orange" : "text-perlapp-inkMuted"
                }
              >
                {t.label}
              </span>
              {tab === t.id ? (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-perlapp-orange" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="min-h-[40vh] p-4">
          {tab === "actividad" ? (
            postsWithInteraction.length === 0 ? (
              <p className="text-center text-sm text-perlapp-inkMuted">
                Aún no hay actividad. Añade productos al carrito desde publicaciones del home para
                registrarlas aquí.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {postsWithInteraction.map((post) => (
                  <li
                    key={post.id}
                    className="rounded-xl border border-perlapp-line/40 bg-perlapp-canvas/40 p-3"
                  >
                    <Link
                      href={merchantProfilePath(post.merchantId)}
                      className="font-display text-sm font-semibold text-perlapp-tertiary hover:underline"
                    >
                      {post.author}
                    </Link>
                    <p className="mt-1 font-sans text-sm text-perlapp-ink">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-perlapp-inkMuted">{post.body}</p>
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {tab === "favoritos" ? (
            favoriteMerchants.length === 0 ? (
              <p className="text-center text-sm text-perlapp-inkMuted">
                Marca comercios como favoritos desde su perfil (icono corazón).
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {favoriteMerchants.map((m) =>
                  m ? (
                    <li key={m.id}>
                      <Link
                        href={merchantProfilePath(m.id)}
                        className="flex items-center gap-3 rounded-xl border border-perlapp-line/40 p-3 transition-colors hover:bg-perlapp-canvas/50"
                      >
                        <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full">
                          <Image src={m.avatarUrl} alt="" fill className="object-cover" sizes="48px" />
                        </span>
                        <div>
                          <p className="font-display font-semibold text-perlapp-ink">{m.displayName}</p>
                          <p className="font-display text-perlapp-label-sm text-perlapp-inkMuted">
                            {m.handle}
                          </p>
                        </div>
                        <Store className="ml-auto h-4 w-4 text-perlapp-inkMuted" />
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
            )
          ) : null}

        </div>

        <div className="border-t border-perlapp-line/40 p-4">
          <Button asChild variant="outline" className="w-full font-display">
            <Link href="/">Volver al home</Link>
          </Button>
        </div>
      </main>

      <PerlappBottomNav activeTab="profile" />
      <CartDrawer />
    </div>
  );
}
