"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MerchantFeaturedConnectButton } from "@/components/perlapp/MerchantFeaturedConnectButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import type { PublicMerchantListItem } from "@/core/models/public-merchants-list.model";
import { usePublicMerchants } from "@/hooks/use-public-merchants";
import { getProductForPost } from "@/lib/cart-catalog";
import { merchantProfilePath } from "@/lib/merchant-profile.mock";
import { RECENT_POSTS, TOP_MERCHANTS } from "@/lib/perlapp-home.constants";
import { useBuyerActivityStore } from "@/store/buyer-activity.store";
import { useCartStore } from "@/store/cart.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { PerlappHomeBottomNav } from "./PerlappHomeBottomNav";
import { PerlappHomeHeader } from "./PerlappHomeHeader";

const FEATURED_GRADIENTS = TOP_MERCHANTS.map((m) => m.gradient);

function merchantProfileHref(m: PublicMerchantListItem): string {
  const raw = m.profile_merchant_id ?? m.user_id;
  return merchantProfilePath(raw);
}

function merchantConnectId(m: PublicMerchantListItem): string {
  return m.profile_merchant_id ?? m.user_id;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PerlappHome() {
  const { data: merchantsData, isPending, isError, error, refetch, isFetching } = usePublicMerchants();
  const merchants = merchantsData?.merchants ?? [];

  const role = usePerlappRoleStore((s) => s.role);
  const registerPostInteraction = useBuyerActivityStore((s) => s.registerPostInteraction);
  const addItem = useCartStore((s) => s.addItem);

  const addFromPost = (postId: string) => {
    const p = getProductForPost(postId);
    if (!p) return;
    addItem({
      productId: p.productId,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      merchantId: p.merchantId,
      merchantName: p.merchantName,
      quantity: 1,
    });
    if (role === "comprador") {
      registerPostInteraction(postId);
    }
  };

  return (
    <div className="min-h-screen bg-perlapp-canvas text-perlapp-ink antialiased selection:bg-perlapp-orange/20 selection:text-perlapp-ink">
      <PerlappHomeHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-perlapp-lg pb-28 pt-20 md:pb-12">
        {/* Comercios destacados */}
        <section className="w-full" aria-labelledby="top-merchants-heading">
          <div className="mb-perlapp-sm px-perlapp-margin-mobile md:px-perlapp-margin-desktop">
            <h2
              id="top-merchants-heading"
              className="font-display text-perlapp-headline-md leading-8 text-perlapp-ink"
            >
              Comercios destacados
            </h2>
          </div>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-perlapp-sm overflow-x-auto px-perlapp-margin-mobile pb-perlapp-sm md:px-perlapp-margin-desktop">
            {isPending ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="relative h-40 w-[min(280px,85vw)] shrink-0 snap-center animate-pulse rounded-xl bg-perlapp-line/40"
                  />
                ))}
              </>
            ) : isError ? (
              <div className="w-full min-w-0 rounded-xl border border-perlapp-line/60 bg-perlapp-white px-perlapp-md py-perlapp-md text-center shadow-perlapp-float">
                <p className="font-display text-sm text-perlapp-inkMuted">
                  {error instanceof Error ? error.message : "No se pudieron cargar los comercios."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 font-display"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  {isFetching ? "Reintentando…" : "Reintentar"}
                </Button>
              </div>
            ) : merchants.length === 0 ? (
              <p className="px-perlapp-sm font-display text-sm text-perlapp-inkMuted">
                Aún no hay comercios para mostrar.
              </p>
            ) : (
              merchants.map((m, index) => {
                const gradient = FEATURED_GRADIENTS[index % FEATURED_GRADIENTS.length];
                return (
                  <div
                    key={m.user_id}
                    className="relative h-40 w-[min(280px,85vw)] shrink-0 snap-center"
                  >
                    <Link
                      href={merchantProfileHref(m)}
                      className="group relative block h-full w-full overflow-hidden rounded-xl shadow-perlapp-float outline-none ring-perlapp-orange focus-visible:ring-2"
                      aria-label={`Ver perfil de ${m.name}`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                        aria-hidden
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        <span className="font-display text-5xl font-bold text-white/25">
                          {initialsFromName(m.name)}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-perlapp-ink/85 via-perlapp-ink/25 to-transparent" aria-hidden />
                      <div className="absolute bottom-0 left-0 w-full p-perlapp-md">
                        <span className="mb-perlapp-xs inline-block rounded-md border border-white/30 bg-white/20 px-2 py-1 font-display text-perlapp-label-sm leading-4 text-white backdrop-blur-md">
                          Comercio
                        </span>
                        <h3 className="font-display text-[20px] font-bold leading-tight text-white">
                          {m.name}
                        </h3>
                      </div>
                    </Link>
                    <MerchantFeaturedConnectButton
                      merchantId={merchantConnectId(m)}
                      merchantTitle={m.name}
                    />
                  </div>
                );
              })
            )}
          </div>
          {role === "market" ? (
            <Link
              href="/merchant/group-invite"
              className="mt-2 block px-perlapp-margin-mobile font-display text-base font-semibold text-perlapp-orange underline underline-offset-2 transition md:px-perlapp-margin-desktop"
            >
              ¿Quieres ser parte de este grupo?
            </Link>
          ) : null}
        </section>

        {/* Comerciantes cercanos */}
        <section className="w-full" aria-labelledby="nearby-heading">
          <div className="mb-perlapp-sm px-perlapp-margin-mobile md:px-perlapp-margin-desktop">
            <h2
              id="nearby-heading"
              className="font-display text-[20px] font-semibold text-perlapp-ink"
            >
              Comerciantes cercanos
            </h2>
          </div>
          <div className="no-scrollbar flex items-start gap-perlapp-md overflow-x-auto px-perlapp-margin-mobile pb-perlapp-sm md:px-perlapp-margin-desktop">
            {isPending ? (
              <>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex w-[72px] shrink-0 flex-col items-center gap-perlapp-xs">
                    <div className="h-16 w-16 animate-pulse rounded-full bg-perlapp-line/50" />
                    <div className="h-3 w-12 animate-pulse rounded bg-perlapp-line/50" />
                  </div>
                ))}
              </>
            ) : isError ? null : (
              merchants.map((m, index) => {
                const ringGradient = index % 2 === 0;
                return (
                  <Link
                    key={m.user_id}
                    href={merchantProfileHref(m)}
                    className="flex w-[72px] shrink-0 flex-col items-center gap-perlapp-xs rounded-xl outline-none ring-perlapp-orange transition-opacity hover:opacity-90 focus-visible:ring-2"
                    aria-label={`Ver perfil: ${m.name}`}
                  >
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full p-0.5 ${
                        ringGradient
                          ? "bg-gradient-to-br from-perlapp-orange to-perlapp-tertiary"
                          : "bg-perlapp-line"
                      }`}
                    >
                      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-perlapp-white bg-perlapp-surfaceContainer font-display text-sm font-bold text-perlapp-teal">
                        {initialsFromName(m.name)}
                      </div>
                    </div>
                    <span className="w-full truncate text-center font-display text-perlapp-label-sm leading-4 text-perlapp-inkMuted">
                      {m.name}
                    </span>
                  </Link>
                );
              })
            )}
            <Link
              href="/explorar"
              className="flex w-[72px] shrink-0 flex-col items-center gap-perlapp-xs"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-perlapp-line bg-perlapp-surfaceContainer text-perlapp-orange transition-colors hover:bg-perlapp-surfaceVariant">
                <Plus className="h-6 w-6" strokeWidth={2} />
              </div>
              <span className="w-full truncate text-center font-display text-perlapp-label-sm font-medium leading-4 text-perlapp-orange">
                Ver más
              </span>
            </Link>
          </div>
        </section>

        {/* Publicaciones */}
        <section
          className="w-full px-perlapp-margin-mobile md:px-perlapp-margin-desktop"
          aria-labelledby="posts-heading"
        >
          <div className="mb-perlapp-md">
            <h2
              id="posts-heading"
              className="font-display text-perlapp-headline-md leading-8 text-perlapp-ink"
            >
              Publicaciones recientes
            </h2>
          </div>
          <div className="flex flex-col gap-perlapp-md">
            {RECENT_POSTS.map((post) => (
              <article
                key={post.id}
                className="flex flex-col gap-perlapp-sm rounded-xl border border-perlapp-line/30 bg-perlapp-white p-perlapp-md shadow-perlapp-float"
              >
                <div className="flex items-center gap-perlapp-sm">
                  <Link
                    href={merchantProfilePath(post.merchantId)}
                    className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full outline-none ring-perlapp-orange ring-offset-2 ring-offset-perlapp-white transition-opacity hover:opacity-90 focus-visible:ring-2"
                    aria-label={`Ver perfil de ${post.author}`}
                  >
                    <Image
                      src={post.authorAvatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      href={merchantProfilePath(post.merchantId)}
                      className="block rounded-md outline-none ring-perlapp-orange focus-visible:ring-2"
                    >
                      <h4 className="font-display text-perlapp-label-md leading-5 text-perlapp-ink hover:underline">
                        {post.author}
                      </h4>
                      <p className="font-display text-[11px] text-perlapp-inkMuted">{post.time}</p>
                    </Link>
                  </div>
                </div>

                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 672px"
                    priority={post.id === "1"}
                  />
                  {post.badge ? (
                    <div className="absolute right-perlapp-sm top-perlapp-sm rounded-full bg-perlapp-orange/90 px-2 py-1 font-display text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                      {post.badge}
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="mb-1 font-display text-[18px] font-semibold leading-snug text-perlapp-ink">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 font-sans text-base leading-6 text-perlapp-inkMuted">
                    {post.body}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-perlapp-line font-display text-perlapp-ink hover:bg-perlapp-surfaceContainer"
                  onClick={() => addFromPost(post.id)}
                >
                  Añadir al carrito
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PerlappHomeBottomNav />

      <CartDrawer />
    </div>
  );
}
