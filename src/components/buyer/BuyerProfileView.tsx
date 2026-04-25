"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link2, Sparkles, Store } from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PerlappBottomNav } from "@/components/home/PerlappBottomNav";
import { PerlappHomeHeader } from "@/components/home/PerlappHomeHeader";
import { Button } from "@/components/ui/button";
import { getMerchantProfileById } from "@/lib/merchant-profile.mock";
import { RECENT_POSTS } from "@/lib/perlapp-home.constants";
import { useBuyerActivityStore } from "@/store/buyer-activity.store";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

type TabKey = "actividad" | "favoritos";

export function BuyerProfileView() {
  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const setRole = usePerlappRoleStore((s) => s.setRole);
  const [tab, setTab] = useState<TabKey>("actividad");

  const favoriteMerchantIds = useBuyerActivityStore((s) => s.favoriteMerchantIds);
  const interactedPostIds = useBuyerActivityStore((s) => s.interactedPostIds);
  const marketRequests = useMarketConnectionsStore((s) => s.requests);
  const acceptedPairs = marketRequests.filter((r) => r.status === "aceptada");

  const postsWithInteraction = RECENT_POSTS.filter((p) => interactedPostIds.includes(p.id));
  const favoriteMerchants = favoriteMerchantIds
    .map((id) => getMerchantProfileById(id))
    .filter(Boolean);

  if (role === "market") {
    return (
      <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink md:pb-0">
        <PerlappHomeHeader />
        <main className="mx-auto max-w-2xl px-perlapp-margin-mobile py-perlapp-lg md:px-perlapp-margin-desktop">
          <p className="font-display text-perlapp-headline-md text-perlapp-ink">Perfil de comercio</p>
          <p className="mt-2 text-perlapp-inkMuted">
            Con el rol <strong>Comercio</strong> gestionas tu ficha pública. Las{" "}
            <strong>conexiones B2B</strong> entre comercios las creas en el home con el botón{" "}
            <strong>Conectar</strong> en cada tarjeta de comercios destacados.
          </p>
          <Button asChild className="mt-6 bg-perlapp-orange text-white hover:bg-perlapp-orange/90">
            <Link href="/merchant/me">Ir a mi comercio</Link>
          </Button>
          {acceptedPairs.length > 0 ? (
            <div className="mt-10">
              <h2 className="font-display text-sm font-bold text-perlapp-ink">Conexiones entre comercios</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {acceptedPairs.map((pair) => {
                  const a = getMerchantProfileById(pair.fromMerchantId);
                  const b = getMerchantProfileById(pair.toMerchantId);
                  if (!a || !b) return null;
                  return (
                    <li
                      key={pair.id}
                      className="flex items-center gap-2 rounded-xl border border-perlapp-line/40 bg-perlapp-white px-3 py-2 font-display text-sm"
                    >
                      <Link2 className="h-4 w-4 shrink-0 text-perlapp-tertiary" />
                      <span className="font-semibold">{a.displayName}</span>
                      <span className="text-perlapp-inkMuted">↔</span>
                      <span className="font-semibold">{b.displayName}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="mt-8 text-sm text-perlapp-inkMuted">
              No tienes conexiones aceptadas para {getMerchantProfileById(activeMarketId)?.displayName ?? "este comercio"}.
            </p>
          )}
        </main>
        <PerlappBottomNav activeTab="profile" />
        <CartDrawer />
      </div>
    );
  }

  if (role === "invitado") {
    return (
      <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink md:pb-0">
        <PerlappHomeHeader />
        <main className="mx-auto max-w-2xl px-perlapp-margin-mobile py-perlapp-lg md:px-perlapp-margin-desktop">
          <p className="font-display text-perlapp-headline-md text-perlapp-ink">Tu perfil</p>
          <p className="mt-2 text-perlapp-inkMuted">
            Como <strong>invitado</strong> este espacio es solo informativo: no hay favoritos, historial
            de compras ni otras interacciones guardadas en el perfil.
          </p>
          <p className="mt-3 text-sm text-perlapp-inkMuted">
            Para comprar, marcar comercios favoritos y ver tu actividad, inicia sesión o prueba el modo{" "}
            <strong>Comprador</strong> (demostración).
          </p>
          <Button
            type="button"
            className="mt-6 bg-perlapp-orange text-white hover:bg-perlapp-orange/90"
            onClick={() => setRole("comprador")}
          >
            Probar como comprador
          </Button>
          <p className="mt-4 text-sm text-perlapp-inkMuted">
            En producción aquí iría el acceso a tu cuenta. El selector de rol arriba sirve solo para maquetar.
          </p>
        </main>
        <PerlappBottomNav activeTab="profile" />
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink antialiased md:pb-0">
      <PerlappHomeHeader />

      <main className="mx-auto w-full max-w-2xl border-x border-perlapp-line/30 bg-perlapp-white">
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
                      href={`/merchant/${post.merchantId}`}
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
                        href={`/merchant/${m.id}`}
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
